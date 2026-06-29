import { Product } from "../../types/index";

export class CatalogModel {
  private _products: Product[] = [];
  private _selectedProduct: Product | null = null;

  set products(products: Product[]) {
    this._products = [...products];
  }

  get products(): Product[] {
    return [...this._products];
  }

  set selectedProduct(id: string) {
    const product = this.getProductById(id);
    if (product) {
      this._selectedProduct = product;
    }
  }

  get selectedProduct(): Product | null {
    return this._selectedProduct;
  }

  getProductById(id: string): Product | null {
    return this.products.find((product) => product.id === id) ?? null;
  }
}
