import { Customer, CustomerErrors, Payment } from "../../types/index";
import { IEvents } from "../base/Events";

export class CustomerModel {
  #payment: Payment | null = null;
  #address: string = "";
  #email: string = "";
  #phone: string = "";

  constructor(protected events: IEvents) {}

  set payment(payment: Payment | null) {
    this.#payment = payment;
    this.events.emit("order:changed", this.validate());
  }

  set address(address: string) {
    this.#address = address;
    this.events.emit("order:changed", this.validate());
  }

  set email(email: string) {
    this.#email = email;
    this.events.emit("order:changed", this.validate());
  }

  set phone(phone: string) {
    this.#phone = phone;
    this.events.emit("order:changed", this.validate());
  }

  getCustomer(): Customer {
    return {
      payment: this.#payment,
      address: this.#address,
      email: this.#email,
      phone: this.#phone,
    };
  }

  clear(): void {
    this.#payment = null;
    this.#address = "";
    this.#email = "";
    this.#phone = "";
    this.events.emit("order:changed", this.validate());
  }

  validate(): CustomerErrors {
    const errors: CustomerErrors = {};

    if (this.#payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.#address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this.#email.trim()) {
      errors.email = "Укажите электронную почту";
    }

    if (!this.#phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
