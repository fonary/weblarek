import { Customer, CustomerErrors, Payment } from "../../types/index";
import { IEvents } from "../base/Events";

export class CustomerModel {
  private paymentType: Payment | null = null;
  private addressDelivery: string = "";
  private emailCustomer: string = "";
  private phoneCustomer: string = "";

  constructor(protected events: IEvents) {}

  set payment(payment: Payment | null) {
    this.paymentType = payment;
    this.events.emit("order:changed");
  }

  set address(address: string) {
    this.addressDelivery = address;
    this.events.emit("order:changed");
  }

  set email(email: string) {
    this.emailCustomer = email;
    this.events.emit("order:changed");
  }

  set phone(phone: string) {
    this.phoneCustomer = phone;
    this.events.emit("order:changed");
  }

  getCustomer(): Customer {
    return {
      payment: this.paymentType,
      address: this.addressDelivery,
      email: this.emailCustomer,
      phone: this.phoneCustomer,
    };
  }

  clear(): void {
    this.paymentType = null;
    this.addressDelivery = "";
    this.emailCustomer = "";
    this.phoneCustomer = "";
    this.events.emit("order:changed");
  }

  validate(): CustomerErrors {
    const errors: CustomerErrors = {};

    if (this.paymentType === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.addressDelivery.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this.emailCustomer.trim()) {
      errors.email = "Укажите электронную почту";
    }

    if (!this.phoneCustomer.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
