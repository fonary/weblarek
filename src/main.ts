import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { CustomerModel } from "./components/Models/CustomerModel";
import { Product, ProductsResponse } from "./types";
import { Api } from "./components/base/Api";
import { ClientApi } from "./components/communication/ClientApi";
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { HeaderView } from "./components/views/HeaderView";
import { CardBasketView, CardCatalogView, CardPreview } from "./components/views/CardView";
import {ModalView} from "./components/views/ModalView";
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
const cardPreview = new CardPreview(cloneTemplate<HTMLElement>("#card-preview"), events);
const modal = new ModalView(ensureElement<HTMLElement>("#modal-container"), events);

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
  // Рендерим данные товара в карточку превью
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
events.on<{ products: Product[] }>("basket:changed", () => {
  // Обновляем счётчик в шапке
  header.render({ counter: cartModel.getProductCount() });
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
    console.error("Не удалось загрузить данные с сервера из-за ошибки: ", error);
  }
}

init();
