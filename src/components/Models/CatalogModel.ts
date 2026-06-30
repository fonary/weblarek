import { Product } from "../../types/index";

export class CatalogModel {

  #products: Product[] = [];
  #selectedProduct: Product | null = null;

  set products(products: Product[]) {
    this.#products = [...products];
  }

  get products(): Product[] {
    return [...this.#products];
  }

  set selectedProduct(id: string) {
    const product = this.getProductById(id);
    if (product) {
      this.#selectedProduct = product;
    }
  }

  get selectedProduct(): Product | null {
    return this.#selectedProduct;
  }

  getProductById(id: string): Product | null {
    return this.#products.find((product) => product.id === id) ?? null;
  }
}