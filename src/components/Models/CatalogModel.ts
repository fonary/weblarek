import { Product } from "../../types/index";
import { IEvents } from "../base/Events";


export class CatalogModel {

  private productsList: Product[] = [];
  private chosenProduct: Product | null = null;

  constructor(private events: IEvents) {}

  set products(products: Product[]) {
    this.productsList = [...products];
    this.events.emit("items:changed");
  }

  get products(): Product[] {
    return [...this.productsList];
  }

  set selectedProduct(id: string) {
    const product = this.getProductById(id);
    if (product) {
      this.chosenProduct = product;
      this.events.emit("preview:changed");
    }
  }

  get selectedProduct(): Product | null {
    return this.chosenProduct;
  }

  getProductById(id: string): Product | null {
    return this.productsList.find((product) => product.id === id) ?? null;
  }
}