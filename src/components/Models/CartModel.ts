import { Product } from "../../types/index";

export class CartModel {
  #products: Product[] = [];

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
  }

  deleteProduct(product: Product): void {
    this.#products = this.#products.filter((item) => item.id !== product.id);
  }

  deleteAll(): void {
    this.#products = [];
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
