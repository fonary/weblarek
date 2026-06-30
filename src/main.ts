import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { CustomerModel } from "./components/Models/CustomerModel";
import { apiProducts } from "./utils/data";
import { Product } from "./types";
import { Api } from "./components/base/Api";
import { ClientApi } from "./components/communication/ClientApi";
import { API_URL } from "./utils/constants";

const data = apiProducts;
console.log("Локальные тестовые данные - ", data);

const catalog = new CatalogModel();
console.log("Созданный новый каталог - ", catalog);
catalog.products = data.items;
const catalogCopy: Product[] = catalog.products;
console.log("Каталог заполненный данными", catalogCopy);
console.log("Не установленный выбранный товар - ", catalog.selectedProduct);
catalog.selectedProduct = catalog.products[1].id;
console.log("Установленный выбранный товар - ", catalog.selectedProduct);
console.log(
  "Получение товара из каталога по несуществующему id - ",
  catalog.getProductById("1"),
);
console.log(
  "Выбор товара из каталога по существующему id - ",
  catalog.getProductById(catalog.products[0].id),
);

const cart = new CartModel();
console.log("-".repeat(25), "\nСозданная новая корзина - ", cart);
console.log("Получение списка товаров из корзины - ", cart.getProducts());
cart.addProduct(catalog.products[0]);
console.log("Добавили товар в корзину - ", cart.getProducts());
console.log(
  "Проверка наличия товара в корзине по ID - ",
  cart.isProductInCart("100"),
);
console.log(
  "Проверка наличия товара в корзине по ID - ",
  cart.isProductInCart(catalog.products[0].id),
);
cart.deleteProduct(cart.getProducts()[0]);
console.log("Удалили товар из корзины - ", cart.getProducts());
cart.addProduct(catalog.products[0]);
cart.addProduct(catalog.products[1]);
console.log("Добавили два товара в корзину - ", cart.getProducts());
console.log(
  "Получение количество товаров в корзине - ",
  cart.getProductCount(),
);
console.log(
  "Получение общей стоимости товаров в корзине - ",
  cart.getTotalAmount(),
);
cart.addProduct(catalog.products[2]);
console.log("Добавили товар без стоимости в корзину - ", cart.getProducts());
console.log(
  "Получение общей стоимости товаров в корзине - ",
  cart.getTotalAmount(),
);
cart.deleteAll();
console.log("Удалили все товары из корзины - ", cart.getProducts());

const customer = new CustomerModel();
console.log("-".repeat(25), "\nСоздан покупатель - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());
customer.payment = "online";
console.log("Добавлен способ оплаты - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());
customer.payment = null;
console.log("Способ оплаты сброшен - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());
customer.payment = "online";
customer.phone = "+79999999999";
console.log("Добавлен способ оплаты и телефон - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());
customer.email = "test@test.ru";
console.log("Добавлен email - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());
customer.address = "Москва";
console.log("Добавлен адрес - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());
customer.clear();
console.log("Очищены все поля методом clear() - ", customer.getCustomer());
console.log("Валидация полей - ", customer.validate());

const api = new Api(API_URL);
const clientApi = new ClientApi(api);

try {
  const products: Product[] = await clientApi.getProducts();
  catalog.products = products;
  console.log(catalog.products);
} catch (error) {
  console.error("Не удалось загрузить данные с сервера из-за ошибки: ", error);
}
