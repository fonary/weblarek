import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface SuccessViewData {
  amount: number;
}

export class SuccessView extends Component<SuccessViewData> {
  private closeButton: HTMLButtonElement;
  private debitEl: HTMLElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.debitEl = ensureElement(".order-success__description", this.container);

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });
  }

  set amount(amount: number) {
    this.debitEl.textContent = `Списано ${amount} синапсов`;
  }
}
