import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { CustomerModel } from "./components/Models/CustomerModel";
import { apiProducts } from "./utils/data";
import { Product, ProductsResponse } from "./types";
import { Api } from "./components/base/Api";
import { ClientApi } from "./components/communication/ClientApi";
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { HeaderView } from "./components/views/HeaderView";
import { Component } from "./components/base/Component";
import { CardBasketView, CardCatalogView } from "./components/views/CardView";
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

// Обработка событий

// Обработка события: каталог товаров изменился
events.on<{ products: Product[] }>("items:changed", ({ products }) => {
  // Для каждого товара создаём карточку
  const cardList: HTMLElement[] = products.map((product) => {
    const cardContainer = cloneTemplate<HTMLElement>("#card-catalog");
    const card = new CardCatalogView(cardContainer, events);
    
    // Рендер карточки с данными
    card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image,
    });
    
    return cardContainer;
  });
  

  gallery.render({ catalog: cardList });
});

//Инициализация приложения

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

// const gallery = ensureElement<HTMLElement>(".gallery");
// const component = new HeaderView(ensureElement('.header'));
// console.log(component)
// gallery.replaceChildren(component.render({counter: 5}))
// const catalogView = new GalleryView(ensureElement('.page__wrapper'))
// console.log(catalogView);

// const cardList: HTMLElement[] = []; 

// catalog.products.forEach((product) => {
//   const cardContainer = cloneTemplate<HTMLElement>("#card-catalog");
//   const card = new CardCatalogView(cardContainer);

//   card.render({
//     title: product.title,
//     price: product.price,
//     category: product.category,
//     image: CDN_URL + product.image
//   })
//   cardList.push(cardContainer);
// });
// catalogView.render({catalog: cardList});


// const cardBasket = new CardBasketView(cloneTemplate("#card-basket"))

// console.log(cardBasket)
// cardBasket.render({
//   title: "akrhgiq",
//   price: 123,
//   index: 3
// })