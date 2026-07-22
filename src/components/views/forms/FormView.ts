import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export type FormState = {
  valid: boolean;
  error?: string;
};

export abstract class FormView<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsEl: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container,
    );
    this.errorsEl = ensureElement<HTMLElement>(".form__errors", this.container);
    const formName = this.container.getAttribute("name");

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.events.emit(`${formName}:change`, {
        name: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${formName}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set error(value: string) {
    this.errorsEl.textContent = value;
  }
}
