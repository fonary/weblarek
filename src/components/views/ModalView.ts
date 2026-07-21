import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ModalData {
  hidden: boolean;
  content: HTMLElement;
}

export class ModalView extends Component<ModalData> {
  private modalContentEl: HTMLElement;
  private modalButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);
    this.modalContentEl = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.modalButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.modalButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (e: MouseEvent) => {
      if (e.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  set hidden(value: boolean) {
    this.container.classList.toggle("modal_active", !value);
  }

  set content(child: HTMLElement) {
    this.modalContentEl.replaceChildren(child);
  }
}
