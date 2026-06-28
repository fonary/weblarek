import { Customer, Payment } from "../../types/index";

export class CustomerModel {
  private _payment: Payment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  set payment(payment: Payment | null) {
    this._payment = payment;
  }

  set address(address: string) {
    this._address = address.trim();
  }

  set email(email: string) {
    this._email = email.trim();
  }

  set phone(phone: string) {
    this._phone = phone.trim();
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

  validate(): { [field: string]: string } {
    const errors: { [field: string]: string } = {};

    if (this._payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this._address) {
      errors.address = "Укажите адрес";
    }

    if (!this._email) {
      errors.email = "Укажите емэйл";
    }

    if (!this._phone) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
