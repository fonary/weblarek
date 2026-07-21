import { Product } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type CardCatalogData = Pick<
  Product,
  "id" | "title" | "price" | "category" | "image"
>;
type CardPreviewData = Product;
type CardBasketData = Pick<Product, "id" | "title" | "price"> & {
  index: number;
};

abstract class CardView<T> extends Component<T> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;
  abstract cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events?: IEvents,
  ) {
    super(container);
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

  set id(value: string) {
    this.container.dataset.id = value;
  }
}

export class CardCatalogView<
  T extends CardCatalogData | CardPreviewData,
> extends CardView<T> {
  protected categoryEl: HTMLElement;
  protected cardImage: HTMLImageElement;
  cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events?: IEvents,
  ) {
    super(container, events);

    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.cardButton = this.container as HTMLButtonElement;

    this.cardButton.addEventListener("click", () => {
      this.events?.emit("card:select", { id: this.container.dataset.id });
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
}

export class CardPreview extends CardCatalogView<CardPreviewData> {
  private descriptionEl: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events?: IEvents,
  ) {
    super(container, events);
    this.descriptionEl = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events?.emit("card:order");
    });
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
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events?.emit("basket:delete", { id: this.container.dataset.id });
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }
}
