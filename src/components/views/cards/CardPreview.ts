import { Product } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { CardMediaView } from "./CardMediaView";

type CardPreviewData = Omit<Product, "id"> & {
  buttonText: string;
  buttonDisabled: boolean;
};

export class CardPreview extends CardMediaView<CardPreviewData> {
  protected descriptionEl: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.descriptionEl = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("card:order");
    });
  }

  set description(text: string) {
    this.descriptionEl.textContent = text;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
