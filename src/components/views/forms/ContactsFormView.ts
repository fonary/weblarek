import { Customer } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { FormState, FormView } from "./FormView";

type ContactsFormData = Pick<Customer, "email" | "phone"> & FormState;

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