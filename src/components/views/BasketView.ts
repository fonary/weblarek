import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface BasketViewData {
  purchases: HTMLElement[];
  totalCost: number;
}

export class BasketView extends Component<BasketViewData> {
  private completeButton: HTMLButtonElement;
  private shoppingListEl: HTMLElement;
  private totalCostEl: HTMLElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);
    this.completeButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.shoppingListEl = ensureElement<HTMLElement>(
      ".basket-list",
      this.container,
    );
    this.totalCostEl = ensureElement<HTMLElement>(
      ".basket-price",
      this.container,
    );

    this.completeButton.addEventListener("click", () => {
      this.events.emit("order:edit");
    });
  }

  set purchases(purchases: HTMLElement[]) {
    this.shoppingListEl.replaceChildren(...purchases);
  }

  set totalCost(value: number) {
    this.totalCostEl.textContent = `${value ?? 0} синапсов`;
  }
}
