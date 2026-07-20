import { Product } from "../../types/index";
import { IEvents } from "../base/Events";


export class CatalogModel {

  #products: Product[] = [];
  #selectedProduct: Product | null = null;

  constructor(private events: IEvents) {}

  set products(products: Product[]) {
    this.#products = [...products];
    this.events.emit("items:changed", { products: this.#products });
  }

  get products(): Product[] {
    return [...this.#products];
  }

  set selectedProduct(id: string) {
    const product = this.getProductById(id);
    if (product) {
      this.#selectedProduct = product;
      this.events.emit("preview:changed", { product: this.#selectedProduct });
    }
  }

  get selectedProduct(): Product | null {
    return this.#selectedProduct;
  }

  getProductById(id: string): Product | null {
    return this.#products.find((product) => product.id === id) ?? null;
  }
}