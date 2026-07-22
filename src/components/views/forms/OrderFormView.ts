import { Customer, Payment } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { FormState, FormView } from "./FormView";

type OrderFormData = Pick<Customer, "payment" | "address"> & FormState;

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