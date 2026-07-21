import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { CustomerModel } from "./components/Models/CustomerModel";
import { Product, ProductsResponse } from "./types";
import { Api } from "./components/base/Api";
import { ClientApi } from "./components/communication/ClientApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { HeaderView } from "./components/views/HeaderView";
import {
  CardBasketView,
  CardCatalogView,
  CardPreview,
} from "./components/views/CardView";
import { ModalView } from "./components/views/ModalView";
import { BasketView } from "./components/views/BasketView";
import { ContactsForm, OrderFormView } from "./components/views/FormView";
import { GalleryView } from "./components/views/GalleryView";
import { EventEmitter } from "./components/base/Events";

// API и брокер событий
const api = new Api(API_URL);
const clientApi = new ClientApi(api);
const events = new EventEmitter();

// Модели
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerModel(events);

// Представления
const header = new HeaderView(ensureElement<HTMLElement>(".header"), events);
const gallery = new GalleryView(ensureElement<HTMLElement>(".page__wrapper"));
const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  events,
);
const modal = new ModalView(
  ensureElement<HTMLElement>("#modal-container"),
  events,
);
const basket = new BasketView(cloneTemplate<HTMLElement>("#basket"), events);
basket.valid = cartModel.getTotalAmount() > 0;
const orderForm = new OrderFormView(
  cloneTemplate<HTMLFormElement>("#order"),
  events,
);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>("#contacts"), events);
let currentForm: "order" | "contacts" | null = null;

// Обработка событий

// Обработка события: каталог товаров изменился
events.on<{ products: Product[] }>("items:changed", ({ products }) => {
  const cardList: HTMLElement[] = products.map((product) => {
    const cardContainer = cloneTemplate<HTMLElement>("#card-catalog");
    const card = new CardCatalogView(cardContainer, events);

    // Рендер карточки с данными (включая id для dataset)
    card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image,
    });

    return cardContainer;
  });

  gallery.render({ catalog: cardList });
});

// Обработка события от представления: клик по карточке в каталоге
events.on<{ id: string }>("card:select", ({ id }) => {
  // Сохраняем выбранный товар в модели
  catalogModel.selectedProduct = id;
});

// Обработка события от модели: выбран товар для просмотра
events.on<{ product: Product }>("preview:changed", ({ product }) => {
  // Рендер данных товара в карточку превью
  cardPreview.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: CDN_URL + product.image,
    description: product.description,
  });

  // Управляем состоянием кнопки
  if (product.price === null) {
    // Товар бесценный — кнопка заблокирована
    cardPreview.cardButton.disabled = true;
    cardPreview.cardButton.textContent = "Недоступно";
  } else if (cartModel.isProductInCart(product.id)) {
    // Товар уже в корзине — кнопка "Удалить из корзины"
    cardPreview.cardButton.disabled = false;
    cardPreview.cardButton.textContent = "Удалить из корзины";
  } else {
    // Товар доступен и не в корзине — кнопка "В корзину"
    cardPreview.cardButton.disabled = false;
    cardPreview.cardButton.textContent = "В корзину";
  }

  // Открываем модальное окно с превью
  modal.content = cardPreview.render();
  modal.render({ hidden: false });
});

// Обработка события от представления: клик по иконке корзины в шапке
events.on("basket:open", () => {
  modal.content = basket.render();
  modal.render({ hidden: false });
});

// Обработка события от представления: нажатие кнопки "Оформить" в корзине
events.on("order:edit", () => {
  currentForm = "order";
  // Рендерим форму заказа с пустыми ошибками — placeholder отображается
  orderForm.render({
    payment: customerModel.getCustomer().payment,
    address: customerModel.getCustomer().address,
    valid: false,
    error: {},
  });
  modal.content = orderForm.render();
  modal.render({ hidden: false });
});

// Обработка события от представления: изменение полей формы
events.on<{ name: string; value: string }>("form:change", ({ name, value }) => {
  console.log("form:change:", { name, value });
  // Обновляем модель
  (customerModel as any)[name] = value;
  
  const customer = customerModel.getCustomer();
  const errors = customerModel.validate();
  
  if (name === "payment" || name === "address") {
    // Первая форма — показываем только ошибки payment и address
    orderForm.render({
      payment: customer.payment,
      address: customer.address,
      valid: !errors.payment && !errors.address,
      error: { payment: errors.payment, address: errors.address },
    });
  } else if (name === "email" || name === "phone") {
    // Вторая форма — показываем только ошибки email и phone
    contactsForm.render({
      email: customer.email,
      phone: customer.phone,
      valid: !errors.email && !errors.phone,
      error: { email: errors.email, phone: errors.phone },
    });
  }
});

// Обработка события от представления: отправка формы
events.on("form:submit", () => {
  const errors = customerModel.validate();
  
  if (currentForm === "order") {
    // Первая форма — переходим на вторую
    if (!errors.payment && !errors.address) {
      currentForm = "contacts";
      contactsForm.render({
        email: customerModel.getCustomer().email,
        phone: customerModel.getCustomer().phone,
        valid: false,
        error: {},
      });
      modal.content = contactsForm.render();
    } else {
      // Показываем ошибки первой формы
      orderForm.render({
        payment: customerModel.getCustomer().payment,
        address: customerModel.getCustomer().address,
        valid: false,
        error: { payment: errors.payment, address: errors.address },
      });
    }
  } else if (currentForm === "contacts") {
    // Вторая форма — отправляем заказ
    if (!errors.email && !errors.phone) {
      // TODO: Отправка заказа на сервер
      console.log("Отправка заказа:", customerModel.getCustomer());
      modal.render({ hidden: true });
      currentForm = null;
    } else {
      // Показываем ошибки второй формы
      contactsForm.render({
        email: customerModel.getCustomer().email,
        phone: customerModel.getCustomer().phone,
        valid: false,
        error: { email: errors.email, phone: errors.phone },
      });
    }
  }
});

// Обработка события от представления: нажатие кнопки "Купить"/"Удалить" в превью
events.on("card:order", () => {
  const product = catalogModel.selectedProduct;
  if (!product) return;

  if (cartModel.isProductInCart(product.id)) {
    // Товар уже в корзине — удаляем
    cartModel.deleteProduct(product);
  } else {
    // Товар не в корзине — добавляем
    cartModel.addProduct(product);
  }

  // Закрываем модальное окно
  modal.render({ hidden: true });
});

// Обработка события от модели: корзина изменилась
events.on<{ products: Product[] }>("basket:changed", ({ products }) => {
  // Обновляем счётчик в шапке
  header.render({ counter: cartModel.getProductCount() });

  // Создаём карточки товаров в корзине
  const purchases: HTMLElement[] = products.map((product, index) => {
    const cardContainer = cloneTemplate<HTMLElement>("#card-basket");
    const card = new CardBasketView(cardContainer, events);
    card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
    return cardContainer;
  });

  // Рендерим корзину
  basket.render({
    purchases,
    totalCost: cartModel.getTotalAmount(),
  });

  // Кнопка "Оформить" активна только если есть товары
  basket.valid = products.length > 0;
});

// Обработка события от представления: удаление товара из корзины
events.on<{ id: string }>("basket:delete", ({ id }) => {
  const product = catalogModel.getProductById(id);
  if (product) {
    cartModel.deleteProduct(product);
  }
});

// Обработка события от представления: закрытие модального окна
events.on("modal:close", () => {
  modal.render({ hidden: true });
});

// Инициализация приложения

async function init(): Promise<void> {
  try {
    const productsResponse: ProductsResponse = await clientApi.getProducts();
    const products: Product[] = productsResponse.items;
    catalogModel.products = products;
  } catch (error) {
    console.error(
      "Не удалось загрузить данные с сервера из-за ошибки: ",
      error,
    );
  }
}

init();
