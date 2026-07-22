import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export abstract class CardView<T> extends Component<T> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected abstract cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
  ) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceEl = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set price(value: number | null) {
    if (value !== null) {
      this.priceEl.textContent = `${value} синапсов`;
    } else {
      this.priceEl.textContent = "Бесценно";
    }
  }

  set title(title: string) {
    this.titleEl.textContent = title;
  }
}
