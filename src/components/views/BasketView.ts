import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface BasketViewData {
  purchases: HTMLElement[];
  totalCost: number;
}

export class BasketView extends Component<BasketViewData> {
  
  private completeButton: HTMLButtonElement;
  private shoppingListEl: HTMLElement;
  private totalCostEl: HTMLElement;
  
  constructor(container: HTMLElement) {
    super(container);
    this.completeButton = ensureElement<HTMLButtonElement>('.basket__button', this.container)
    this.shoppingListEl = ensureElement<HTMLElement>('.basket-list', this.container)
    this.totalCostEl = ensureElement<HTMLElement>('.basket-price', this.container)
  }

  set purchases(purchases: HTMLElement[]) {
    this.shoppingListEl.append(...purchases)
  }

  set totalCost(value: number) {
    this.totalCostEl.textContent = `${value ?? 0} синапсов`
  }
}