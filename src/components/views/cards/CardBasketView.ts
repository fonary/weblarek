import { Product } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CardView } from "./CardView";


type CardBasketData = Pick<Product, "title" | "price"> & {
  index: number;
};

export class CardBasketView extends CardView<CardBasketData> {
  private indexEl: HTMLElement;
  cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onClick: () => void,
  ) {
    super(container);
    this.indexEl = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.onClick();
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }
}