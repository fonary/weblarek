import { Product } from "../../../types";
import { CardMediaView } from "./CardMediaView";

type CardCatalogData = Pick<
  Product,
  "title" | "price" | "category" | "image"
>;

export class CardCatalogView extends CardMediaView<CardCatalogData> {
  protected cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onClick: () => void,

  ) {
    super(container);
    this.cardButton = this.container as HTMLButtonElement;
    this.cardButton.addEventListener("click", () => {
      this.onClick();
    });
  }
}