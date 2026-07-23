import { Product } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { CardView } from "./CardView";

type CardPreviewData = Omit<Product, "id"> & {
  buttonText: string;
  buttonDisabled: boolean;
};

export class CardPreview extends CardView<CardPreviewData> {
  protected categoryEl: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected descriptionEl: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

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

  set category(name: string) {
    this.categoryEl.textContent = name;

    if (name in categoryMap) {
      this.categoryEl.classList.remove(...Object.values(categoryMap));
      this.categoryEl.classList.add(
        categoryMap[name as keyof typeof categoryMap],
      );
    }
  }

  set image(src: string) {
    this.setImage(this.cardImage, src);
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
