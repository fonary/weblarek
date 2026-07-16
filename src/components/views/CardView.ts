import { Product } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

type CardCatalogData = Pick<Product, "title" | "price" | "category" | "image">;
type CardPreviewData = Omit<Product, "id">;
type CardBasketData = Pick<Product, "title" | "price"> & { index: number };

abstract class CardView<T> extends Component<T> {
  protected abstract titleEl: HTMLElement;
  protected abstract priceEl: HTMLElement;
  // protected abstract cardButton: HTMLButtonElement;

  abstract set price(value: number | null);
  abstract set title(value: string);
}

export class CardCatalogView extends CardView<CardCatalogData> {
  titleEl: HTMLElement;
  priceEl: HTMLElement;
  categoryEl: HTMLElement;
  cardImage: HTMLImageElement;
  // cardButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceEl = ensureElement<HTMLElement>(".card__price", this.container);
    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);

  }

  set price(value: number | null) {
    if (value) {
      this.priceEl.textContent = `${value} синапсов`;
    } else {
      this.priceEl.textContent = "Бесценно";
    }
  }

  set title(title: string) {
    this.titleEl.textContent = title;
  }

  set category(name: string) {
    this.categoryEl.textContent = name;
  }

  set image(src: string) {
    this.setImage(this.cardImage, src);
  }
}
