import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface HeaderData {
  counter: number;
}

export class HeaderView extends Component<HeaderData> {
  private basketButton: HTMLButtonElement;
  private counterEl: HTMLElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.counterEl = ensureElement(".header__basket-counter", this.container);

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterEl.textContent = String(value);
  }
}
