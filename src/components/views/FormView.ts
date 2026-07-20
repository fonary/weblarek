
import { Customer, CustomerErrors, Payment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

type OrderFormData = Omit<Customer, "payment" | "address">
type ContactsFormData = Omit<Customer, "email" | "phone">

export class FormView<T> extends Component<T> {
  protected submit: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this.submit = ensureElement<HTMLButtonElement>(
      'button[type=submit]',
      this.container
    );
    this.errors = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );
  }

  set valid(value: boolean) {
    this.submit.disabled = !value;
  }

  set error(value: CustomerErrors) {
    if(value) {
      const errorsText = Object.values(value).join(' ');
      this.errors.textContent = errorsText;
    } else {
      this.errors.textContent = '';
    }
  }
}

export class OrderForm extends FormView<OrderFormData> {
  private addressInputEl: HTMLInputElement;
  private paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement) {
    super(container);


    this.addressInputEl = ensureElement<HTMLInputElement>(
      'input[name=address]',
      this.container
    );
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      'button[name=payment]',
      this.container
    );
  }

  set payment(value: Payment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', btn.name === value);
    });
  }

  set address(value: string) {
    this.addressInputEl.value = value;
  }
}

export class ContactsForm extends FormView<ContactsFormData> {
  private emailInputEl: HTMLInputElement;
  private phoneInputEl: HTMLInputElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this.emailInputEl = ensureElement<HTMLInputElement>(
      'input[name=email]',
      this.container
    );
    this.phoneInputEl = ensureElement<HTMLInputElement>(
      'input[name=phone]',
      this.container
    );
  }

  set email(value: string) {
    this.emailInputEl.value = value;
  }

  set phone(value: string) {
    this.phoneInputEl.value = value;
  }
}