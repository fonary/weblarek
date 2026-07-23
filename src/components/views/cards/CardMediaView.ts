import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { CardView } from "./CardView";


export abstract class CardMediaView<T> extends CardView<T> {
  protected categoryEl: HTMLElement;
  protected cardImage: HTMLImageElement;

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