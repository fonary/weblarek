import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface SuccessViewData {
  amount: number;
}

export class SuccessView extends Component<SuccessViewData> {
  private closeButton: HTMLButtonElement;
  private debitEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.debitEl = ensureElement(".order-success__description", this.container);
  }

  set amount(amount: number) {
    this.debitEl.textContent = `Списано ${amount} синапсов`
  }
}
