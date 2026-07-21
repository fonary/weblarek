/**
 * @file Основной файл инициализации приложения. Управляет моделями, представлениями и обработкой событий.
 * Реализует архитектуру MVP (Model-View-Presenter) с использованием шаблона "наблюдатель" через событийный брокер.
 */

// Импорт стилей SCSS
import "./scss/styles.scss";

// Модели приложения
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { CustomerModel } from "./components/Models/CustomerModel";

// Типы данных и API
import { Product, ProductsResponse } from "./types";
import { Api } from "./components/base/Api";
import { ClientApi } from "./components/communication/ClientApi";

// Константы и утилиты
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

// Представления (Views)
import { HeaderView } from "./components/views/HeaderView";
import { GalleryView } from "./components/views/GalleryView";
import {
  CardBasketView,
  CardCatalogView,
  CardPreview,
} from "./components/views/CardView";
import { ModalView } from "./components/views/ModalView";
import { BasketView } from "./components/views/BasketView";
import { ContactsForm, OrderFormView } from "./components/views/FormView";
import { SuccessView } from "./components/views/SuccessView";

// Система событий
import { EventEmitter } from "./components/base/Events";

/**
 * Экземпляр API-клиента для взаимодействия с сервером.
 * @type {Api}
 */
const api = new Api(API_URL);

/**
 * Клиентский API-интерфейс, обёртка над `Api`, обеспечивающий бизнес-логику обмена данными.
 * @type {ClientApi}
 */
const clientApi = new ClientApi(api);

/**
 * Событийный брокер для декларативной реактивной архитектуры.
 * @type {EventEmitter}
 */
const events = new EventEmitter();

/**
 * Модель каталога товаров.
 * Отвечает за хранение и управление списком товаров и текущего выбранного товара.
 * @type {CatalogModel}
 */
const catalogModel = new CatalogModel(events);

/**
 * Модель корзины покупок.
 * Отвечает за добавление/удаление товаров, подсчёт итоговой суммы и количества.
 * @type {CartModel}
 */
const cartModel = new CartModel(events);

/**
 * Модель данных покупателя (адрес, способ оплаты, контактные данные).
 * Отвечает за валидацию и хранение формы заказа.
 * @type {CustomerModel}
 */
const customerModel = new CustomerModel(events);

/**
 * Представление шапки сайта.
 * Отображает счётчик товаров в корзине.
 * @type {HeaderView}
 */
const header = new HeaderView(ensureElement<HTMLElement>(".header"), events);

/**
 * Представление галереи товаров.
 * Отображает список карточек товаров.
 * @type {GalleryView}
 */
const gallery = new GalleryView(ensureElement<HTMLElement>(".page__wrapper"));

/**
 * Представление превью товара в модальном окне.
 * @type {CardPreview}
 */
const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  events,
);

/**
 * Представление модального окна.
 * @type {ModalView}
 */
const modal = new ModalView(
  ensureElement<HTMLElement>("#modal-container"),
  events,
);

/**
 * Представление корзины.
 * Отображает выбранные товары и итоговую стоимость.
 * @type {BasketView}
 */
const basket = new BasketView(cloneTemplate<HTMLElement>("#basket"), events);
basket.valid = cartModel.getTotalAmount() > 0;

/**
 * Представление формы заказа (адрес и способ оплаты).
 * @type {OrderFormView}
 */
const orderForm = new OrderFormView(
  cloneTemplate<HTMLFormElement>("#order"),
  events,
);

/**
 * Представление формы контактов (email и телефон).
 * @type {ContactsForm}
 */
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>("#contacts"),
  events,
);

/**
 * Текущее открытое представление формы в модальном окне.
 * Возможные значения: `"order"`, `"contacts"`, `null`.
 * @type {"order" | "contacts" | null}
 */
let currentForm: "order" | "contacts" | null = null;

/**
 * Представление экрана успеха после оформления заказа.
 * @type {SuccessView}
 */
const successView = new SuccessView(
  cloneTemplate<HTMLElement>("#success"),
  events,
);

// === Обработка событий ===

/**
 * Обработчик изменения каталога товаров.
 * При обновлении списка товаров перерисовывает галерею карточек.
 * @event "items:changed"
 * @param {Object} data - объект с новыми товарами.
 * @param {Product[]} data.products - массив товаров для отображения.
 */
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

/**
 * Обработчик выбора товара в каталоге.
 * Обновляет выбранный товар в модели.
 * @event "card:select"
 * @param {Object} data - данные карточки.
 * @param {string} data.id - идентификатор выбранного товара.
 */
events.on<{ id: string }>("card:select", ({ id }) => {
  catalogModel.selectedProduct = id;
});

/**
 * Обработчик обновления выбранного товара для превью.
 * Рендерит детальную карточку товара и управляет состоянием кнопки.
 * @event "preview:changed"
 * @param {Object} data - объект с данными товара.
 * @param {Product} data.product - выбранный товар.
 */
events.on<{ product: Product }>("preview:changed", ({ product }) => {
  cardPreview.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: CDN_URL + product.image,
    description: product.description,
  });

  // Управление состоянием кнопки
  if (product.price === null) {
    cardPreview.cardButton.disabled = true;
    cardPreview.cardButton.textContent = "Недоступно";
  } else if (cartModel.isProductInCart(product.id)) {
    cardPreview.cardButton.disabled = false;
    cardPreview.cardButton.textContent = "Удалить из корзины";
  } else {
    cardPreview.cardButton.disabled = false;
    cardPreview.cardButton.textContent = "В корзину";
  }

  modal.content = cardPreview.render();
  modal.render({ hidden: false });
});

/**
 * Обработчик открытия корзины (клик по иконке в шапке).
 * @event "basket:open"
 */
events.on("basket:open", () => {
  modal.content = basket.render();
  modal.render({ hidden: false });
});

/**
 * Обработчик перехода к оформлению заказа.
 * Рендерит первую форму (адрес и оплата).
 * @event "order:edit"
 */
events.on("order:edit", () => {
  currentForm = "order";
  orderForm.render({
    payment: customerModel.getCustomer().payment,
    address: customerModel.getCustomer().address,
    valid: false,
    error: {},
  });
  modal.content = orderForm.render();
  modal.render({ hidden: false });
});

/**
 * Обработчик изменения полей формы.
 * Обновляет данные модели и отображает ошибки валидации.
 * @event "form:change"
 * @param {Object} data - объект с именем поля и его значением.
 * @param {string} data.name - имя поля (payment, address, email, phone).
 * @param {string} data.value - новое значение поля.
 */
events.on<{ name: string; value: string }>("form:change", ({ name, value }) => {
   type ValidKeys = Extract<keyof CustomerModel, "payment" | "address" | "email" | "phone">;
  
  const key = name as ValidKeys;

  (customerModel as Record<ValidKeys, any>)[key] = value;

  const customer = customerModel.getCustomer();
  const errors = customerModel.validate();

  if (name === "payment" || name === "address") {
    orderForm.render({
      payment: customer.payment,
      address: customer.address,
      valid: !errors.payment && !errors.address,
      error: { payment: errors.payment, address: errors.address },
    });
  } else if (name === "email" || name === "phone") {
    contactsForm.render({
      email: customer.email,
      phone: customer.phone,
      valid: !errors.email && !errors.phone,
      error: { email: errors.email, phone: errors.phone },
    });
  }
});

/**
 * Обработчик отправки формы.
 * Переключает между формами или отправляет заказ на сервер.
 * @event "form:submit"
 */
events.on("form:submit", async () => {
  const errors = customerModel.validate();
  if (currentForm === "order") {
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
      orderForm.render({
        payment: customerModel.getCustomer().payment,
        address: customerModel.getCustomer().address,
        valid: false,
        error: { payment: errors.payment, address: errors.address },
      });
    }
  } else if (currentForm === "contacts") {
    if (!errors.email && !errors.phone) {
      try {
        const order = await clientApi.placeOrder({
          payment: customerModel.getCustomer().payment!,
          address: customerModel.getCustomer().address,
          email: customerModel.getCustomer().email,
          phone: customerModel.getCustomer().phone,
          total: cartModel.getTotalAmount(),
          items: cartModel.getProducts().map((p) => p.id),
        });

        successView.render({ amount: order.total });
        modal.content = successView.render();

        cartModel.deleteAll();
        customerModel.clear();
        currentForm = null;
      } catch (err) {
        contactsForm.render({
          email: customerModel.getCustomer().email,
          phone: customerModel.getCustomer().phone,
          valid: false,
          error: { email: "Ошибка отправки заказа", phone: "" },
        });
      }
    } else {
      contactsForm.render({
        email: customerModel.getCustomer().email,
        phone: customerModel.getCustomer().phone,
        valid: false,
        error: { email: errors.email, phone: errors.phone },
      });
    }
  }
});

/**
 * Обработчик нажатия кнопки «Купить» / «Удалить» в карточке превью.
 * Добавляет или удаляет товар из корзины.
 * @event "card:order"
 */
events.on("card:order", () => {
  const product = catalogModel.selectedProduct;
  if (!product) return;

  if (cartModel.isProductInCart(product.id)) {
    cartModel.deleteProduct(product);
  } else {
    cartModel.addProduct(product);
  }

  modal.render({ hidden: true });
});

/**
 * Обработчик изменения содержимого корзины.
 * Обновляет интерфейс корзины и шапки.
 * @event "basket:changed"
 * @param {Object} data - объект с обновлённым списком товаров.
 * @param {Product[]} data.products - список товаров в корзине.
 */
events.on<{ products: Product[] }>("basket:changed", ({ products }) => {
  header.render({ counter: cartModel.getProductCount() });

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

  basket.render({
    purchases,
    totalCost: cartModel.getTotalAmount(),
  });

  basket.valid = products.length > 0;
});

/**
 * Обработчик удаления товара из корзины.
 * @event "basket:delete"
 * @param {Object} data - идентификатор удаляемого товара.
 * @param {string} data.id - ID товара.
 */
events.on<{ id: string }>("basket:delete", ({ id }) => {
  const product = catalogModel.getProductById(id);
  if (product) {
    cartModel.deleteProduct(product);
  }
});

/**
 * Обработчик закрытия модального окна.
 * @event "modal:close"
 */
events.on("modal:close", () => {
  modal.render({ hidden: true });
});

// === Инициализация приложения ===

/**
 * Асинхронная функция инициализации приложения.
 * Загружает товары с сервера и передаёт их в модель каталога.
 * @returns {Promise<void>}
 */
async function init(): Promise<void> {
  try {
    const productsResponse: ProductsResponse = await clientApi.getProducts();
    catalogModel.products = productsResponse.items;
  } catch (error) {
    console.error(
      "Не удалось загрузить данные с сервера из-за ошибки: ",
      error,
    );
  }
}

init();