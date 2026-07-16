import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface HeaderData {
  counter: number;
}

export class HeaderView extends Component<HeaderData> {
  protected basketButton: HTMLButtonElement;
  protected counterEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.counterEl = ensureElement(".header__basket-counter", this.container);
  }

  set counter(value: number) {
    this.counterEl.textContent = String(value);
  }
}
