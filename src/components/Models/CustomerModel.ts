import { Customer, CustomerErrors, Payment } from "../../types/index";

export class CustomerModel {
  private _payment: Payment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  set payment(payment: Payment | null) {
    this._payment = payment;
  }

  set address(address: string) {
    this._address = address;
  }

  set email(email: string) {
    this._email = email;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  getCustomer(): Customer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = "";
    this._email = "";
    this._phone = "";
  }

  validate(): CustomerErrors {
    const errors: CustomerErrors = {};

    if (this._payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this._address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this._email.trim()) {
      errors.email = "Укажите электронную почту";
    }

    if (!this._phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
