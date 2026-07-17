import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

/**
 * Отображает первый шаг оформления заказа (выбор оплаты и ввод адреса).
 */
export class FormOrder extends Form {
  private paymentButtonElements: HTMLButtonElement[];
  private addressElement: HTMLInputElement;
  private events: IEvents;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.paymentButtonElements = Array.from(this.container.querySelectorAll<HTMLButtonElement>('.order__buttons .button'));
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    
    this.paymentButtonElements.forEach((button) => {
      button.addEventListener('click', () => {
        const paymentType = button.getAttribute('name');
        this.events.emit('order:payment', { payment: paymentType });
      });
    });

    this.addressElement.addEventListener('input', () => {
      this.events.emit('order:address', { address: this.addressElement.value });
    });

    (this.container as HTMLFormElement).addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });
  }

  /**
   * @param val выбранный способ оплаты
   */
  set payment(val: string) {
    this.paymentButtonElements.forEach((button) => {
      button.classList.remove('button_alt-active');
    });
    const activeButton = this.paymentButtonElements.find((button) => button.getAttribute('name') === val);
    if (activeButton) {
      activeButton.classList.add('button_alt-active');
    }
  }

  /**
   * @param val значение адреса
   */
  set address(val: string) {
    this.addressElement.value = val;
  }
}