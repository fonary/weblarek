import { Product } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { CardView } from "./CardView";

type CardCatalogData = Pick<
  Product,
  "title" | "price" | "category" | "image"
>;

export class CardCatalogView extends CardView<CardCatalogData> {
  protected categoryEl: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onClick: () => void,

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
    this.cardButton = this.container as HTMLButtonElement;

    this.cardButton.addEventListener("click", () => {
      this.onClick();
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