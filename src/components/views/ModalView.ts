import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ModalData {
  hidden: boolean;
  content: HTMLElement;
}

export class ModalView extends Component<ModalData> {
  private modalContentEl: HTMLElement;
  private modalButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalContentEl = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.modalButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
  }

  set hidden(value: boolean){
    this.container.classList.toggle(".modal_active", value);
  }

  set content(child: HTMLElement) {
    this.modalContentEl.replaceChildren(child)
  }

}
