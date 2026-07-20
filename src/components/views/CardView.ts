import { Product } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

type CardCatalogData = Pick<Product, "title" | "price" | "category" | "image">;
type CardPreviewData = Omit<Product, "id">;
type CardBasketData = Pick<Product, "title" | "price"> & { index: number };

abstract class CardView<T> extends Component<T> {
  protected  titleEl: HTMLElement;
  protected  priceEl: HTMLElement;
  protected abstract cardButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container)
    this.titleEl = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceEl = ensureElement<HTMLElement>(".card__price", this.container);
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
}

export class CardCatalogView<
  T extends CardCatalogData | CardPreviewData,
> extends CardView<T> {
  protected categoryEl: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.cardButton = this.container as HTMLButtonElement;
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
}

export class CardPreview extends CardCatalogView<CardPreviewData> {
  private descriptionEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.descriptionEl = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
  }

  set description(text: string) {
    this.descriptionEl.textContent = text;
  }
}

export class CardBasketView extends CardView<CardBasketData> {
  private indexEl: HTMLElement;
  cardButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.indexEl = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.cardButton = this.container as HTMLButtonElement;
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }
}
