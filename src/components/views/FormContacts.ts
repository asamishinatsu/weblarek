import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

/**
 * Отображает второй шаг оформления заказа (ввод Email и телефона).
 */
export class FormContacts extends Form {
  private emailElement: HTMLInputElement;
  private phoneElement: HTMLInputElement;
  private events: IEvents;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    
    this.emailElement.addEventListener('input', () => {
      this.events.emit('order:email', { email: this.emailElement.value });
    });

    this.phoneElement.addEventListener('input', () => {
      this.events.emit('order:phone', { phone: this.phoneElement.value });
    });

    (this.container as HTMLFormElement).addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });
  }

  /**
   * @param val значение email
   */
  set email(val: string) {
    this.emailElement.value = val;
  }

  /**
   * @param val значение телефона
   */
  set phone(val: string) {
    this.phoneElement.value = val;
  }
}