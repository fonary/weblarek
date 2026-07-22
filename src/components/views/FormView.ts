import { Customer, CustomerErrors, Payment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type FormState = {
  valid: boolean;
  error?: string;
};
type OrderFormData = Pick<Customer, "payment" | "address"> & FormState;
type ContactsFormData = Pick<Customer, "email" | "phone"> & FormState;

abstract class FormView<T> extends Component<T> {
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

export class OrderFormView extends FormView<OrderFormData> {
  private addressInputEl: HTMLInputElement;
  private paymentButtons: HTMLButtonElement[];
  private paymentMap: Record<string, Payment> = {
    card: "online",
    cash: "cash",
  };

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInputEl = ensureElement<HTMLInputElement>(
      "input[name=address]",
      this.container,
    );
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      this.container,
    );

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const formName = this.container.getAttribute("name");
        this.events.emit(`${formName}:change`, {
          name: "payment",
          value: this.paymentMap[btn.name],
        });
      });
    });
  }

  set payment(value: Payment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle(
        "button_alt-active",
        this.paymentMap[btn.name] === value,
      );
    });
  }

  set address(value: string) {
    this.addressInputEl.value = value;
  }
}

export class ContactsFormView extends FormView<ContactsFormData> {
  private emailInputEl: HTMLInputElement;
  private phoneInputEl: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInputEl = ensureElement<HTMLInputElement>(
      "input[name=email]",
      this.container,
    );
    this.phoneInputEl = ensureElement<HTMLInputElement>(
      "input[name=phone]",
      this.container,
    );
  }

  set email(value: string) {
    this.emailInputEl.value = value;
  }

  set phone(value: string) {
    this.phoneInputEl.value = value;
  }
}
