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
import { Payment, Product, ProductsResponse } from "./types";
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
 */
events.on("items:changed", () => {
  const products = catalogModel.products;
  const cardList: HTMLElement[] = products.map((product) => {
    const cardContainer = cloneTemplate<HTMLElement>("#card-catalog");
    const card = new CardCatalogView(cardContainer, events);
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
 */
events.on<{ id: string }>("card:select", ({ id }) => {
  catalogModel.selectedProduct = id;
});

/**
 * Обработчик обновления выбранного товара для превью.
 * Рендерит детальную карточку товара и управляет состоянием кнопки.
 * @event "preview:changed"
 */
events.on("preview:changed", () => {
  const product = catalogModel.selectedProduct;
  if (!product) return;

  let buttonText: string;
  let buttonDisabled: boolean;

  if (product.price === null) {
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else if (cartModel.isProductInCart(product.id)) {
    buttonText = "Удалить из корзины";
    buttonDisabled = false;
  } else {
    buttonText = "В корзину";
    buttonDisabled = false;
  }

  modal.render({
    content: cardPreview.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image,
      description: product.description,
      buttonText,
      buttonDisabled,
    }),
    hidden: false,
  });
});

/**
 * Обработчик открытия корзины (клик по иконке в шапке).
 * @event "basket:open"
 */
events.on("basket:open", () => {
  modal.render({content: basket.render(), hidden: false });
});

/**
 * Обработчик перехода к оформлению заказа.
 * Рендерит первую форму (адрес и оплата).
 * @event "order:edit"
 */
events.on("order:edit", () => {
  const customer = customerModel.getCustomer();
  const errors = customerModel.validate();
  const hasData = customer.payment !== null || customer.address !== "";

  modal.render({content:  orderForm.render({
    payment: customer.payment,
    address: customer.address,
    valid: !errors.payment && !errors.address,
    error: hasData ? { payment: errors.payment, address: errors.address } : {},
  }), hidden: false });
});

/**
 * Обработчик изменения текстовых полей формы (address, email, phone).
 * Только сохраняет значение в модель — рендеринг выполнит order:changed.
 * @event "form:change"
 */
events.on<{ name: string; value: string }>("form:change", ({ name, value }) => {
  switch (name) {
    case "address":
      customerModel.address = value;
      break;
    case "email":
      customerModel.email = value;
      break;
    case "phone":
      customerModel.phone = value;
      break;
    default:
      return;
  }
});
/**
 * Обработчик выбора способа оплаты.
 * Только сохраняет значение в модель — рендеринг выполнит order:changed.
 * @event "payment:change"
 */
events.on<{ value: Payment }>("payment:change", ({ value }) => {
  customerModel.payment = value;
});

/**
 * Обработчик изменения данных покупателя.
 * Перерисовывает обе формы с актуальными данными и ошибками валидации.
 * @event "order:changed"
 */
events.on("order:changed", () => {
  const customer = customerModel.getCustomer();
  const errors = customerModel.validate();

  orderForm.render({
    payment: customer.payment,
    address: customer.address,
    valid: !errors.payment && !errors.address,
    error: { payment: errors.payment, address: errors.address },
  });

  contactsForm.render({
    email: customer.email,
    phone: customer.phone,
    valid: !errors.email && !errors.phone,
    error: { email: errors.email, phone: errors.phone },
  });
});

// Обработчик сабмита формы заказа
events.on("order:submit", () => {
  const customer = customerModel.getCustomer();
  const errors = customerModel.validate();
  const hasData = customer.email !== "" || customer.phone !== "";

  modal.render({content: contactsForm.render({
    email: customer.email,
    phone: customer.phone,
    valid: !errors.email && !errors.phone,
    error: hasData ? { email: errors.email, phone: errors.phone } : {},
  }), hidden: false});
});

/**
 * Сабмит формы контактов.
 * Проверка валидации не нужна: кнопка disabled при ошибках.
 * Только отправляет заказ на сервер.
 * @event "contacts:submit"
 */
events.on("contacts:submit", async () => {
  const customer = customerModel.getCustomer();
  try {
    const order = await clientApi.placeOrder({
      payment: customer.payment!,
      address: customer.address,
      email: customer.email,
      phone: customer.phone,
      total: cartModel.getTotalAmount(),
      items: cartModel.getProducts().map((p) => p.id),
    });

    modal.render({content: successView.render({ amount: order.total })});
    cartModel.deleteAll();
    customerModel.clear();
  } catch (err) {
    contactsForm.render({
      email: customer.email,
      phone: customer.phone,
      valid: false,
      error: { email: "Ошибка отправки заказа", phone: "" },
    });
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
 */
events.on("basket:changed", () => {
  const products = cartModel.getProducts();
  
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
    valid: products.length > 0,
  });
});

/**
 * Обработчик удаления товара из корзины.
 * @event "basket:delete"
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
    cartModel.deleteAll();
    customerModel.clear();
  } catch (error) {
    console.error(
      "Не удалось загрузить данные с сервера из-за ошибки: ",
      error,
    );
  }
}

init();
