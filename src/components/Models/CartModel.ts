import { Product } from "../../types/index";
import { IEvents } from "../base/Events";

export class CartModel {
  #products: Product[] = [];

  constructor(protected events: IEvents) {}

  getProducts(): Product[] {
    return [...this.#products];
  }

  isProductInCart(id: string): boolean {
    return this.#products.some((product) => product.id === id);
  }

  addProduct(product: Product): void {
    if (this.isProductInCart(product.id)) {
      return;
    }
    this.#products.push(product);
    this.events.emit("basket:changed", { product, products: this.#products });    
  }

  deleteProduct(product: Product): void {
    this.#products = this.#products.filter((item) => item.id !== product.id);
    this.events.emit("basket:changed", { product, products: this.#products });    
  }

  deleteAll(): void {
    this.#products = [];
    this.events.emit("basket:changed", { products: this.#products });    
  }

  getTotalAmount(): number {
    return this.#products.reduce(
      (total, product) => (product.price ?? 0) + total,
      0
    );
  }

  getProductCount(): number {
    return this.#products.length;
  }
}
