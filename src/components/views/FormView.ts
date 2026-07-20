import { Customer, CustomerErrors, Payment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type OrderFormData = Omit<Customer, "payment" | "address">;
type ContactsFormData = Omit<Customer, "email" | "phone">;

export class FormView<T> extends Component<T> {
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

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.events.emit("form:change", {
        name: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit("form:submit");
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

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInputEl = ensureElement<HTMLInputElement>(
      "input[name=address]",
      this.container,
    );
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      "button[name=payment]",
      this.container,
    );

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.events.emit("form:change", {
          name: "payment",
          value: btn.name,
        });
      });
    });
  }

  set payment(value: Payment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === value);
    });
  }

  set address(value: string) {
    this.addressInputEl.value = value;
  }
}

export class ContactsForm extends FormView<ContactsFormData> {
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
