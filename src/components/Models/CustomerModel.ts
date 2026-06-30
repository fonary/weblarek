import { Customer, CustomerErrors, Payment } from "../../types/index";

export class CustomerModel {
  #payment: Payment | null = null;
  #address: string = "";
  #email: string = "";
  #phone: string = "";

  set payment(payment: Payment | null) {
    this.#payment = payment;
  }

  set address(address: string) {
    this.#address = address;
  }

  set email(email: string) {
    this.#email = email;
  }

  set phone(phone: string) {
    this.#phone = phone;
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
