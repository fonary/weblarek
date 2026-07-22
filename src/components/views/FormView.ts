import { Customer, CustomerErrors, Payment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type FormState = {
  valid: boolean;
  error?: CustomerErrors;
};
type OrderFormData = Pick<Customer, "payment" | "address"> & FormState;
type ContactsFormData = Pick<Customer, "email" | "phone"> & FormState;

abstract class FormView<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsEl: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
    protected submitEventName: string = "form:submit",
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container,
    );
    this.errorsEl = ensureElement<HTMLElement>(".form__errors", this.container);

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.events.emit("form:change", {
        name: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(this.submitEventName);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set error(value: CustomerErrors) {
    if (value) {
      const errorsText = Object.values(value).join(" ");
      this.errorsEl.textContent = errorsText;
    } else {
      this.errorsEl.textContent = "";
    }
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
    super(container, events, "order:submit");

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
        this.events.emit("payment:change", {
          value: this.paymentMap[btn.name],
        });
      });
    });
  }

  set payment(value: Payment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", this.paymentMap[btn.name] === value);
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
    super(container, events, "contacts:submit");

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
