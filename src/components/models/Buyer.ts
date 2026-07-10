import type { TPayment, IBuyer, ValidationErrors } from '../../types';
import type { EventEmitter } from '../base/Events';

/**
 * Класс покупателя.
 * Отвечает за хранение, управление и валидацию данных пользователя в процессе оформления заказа.
 **/
export class Buyer {
  private payment: TPayment | '' = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';
  private events: EventEmitter;

  /**
   * @param events - брокер событий для обновления данных покупателя.
   */
  constructor(events: EventEmitter) {
    this.events = events;
  }
  
  /**
   * Устанавливает значение поля данных покупателя и инициирует событие обновления данных.
   * @param field - имя поля данных покупателя.
   * @param value - значение для установки.
   */
  setInfo(field: keyof IBuyer, value: string): void {
    switch (field) {
      case 'payment':
        this.payment = value as TPayment;
        break;
      case 'address':
        this.address = value;
        break;
      case 'email':
        this.email = value;
        break;
      case 'phone':
        this.phone = value;
        break;
    }
    this.events.emit('buyer:updated', this.getInfo());
  }
  /**
   * @returns объект с данными покупателя.
   */
  getInfo(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  /**
   * Валидирует данные покупателя.
   * @returns объект с ошибками.
   */
  validate(): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this.address) {
      errors.address = 'Введите адрес доставки';
    }
    if (!this.email) {
      errors.email = 'Введите email';
    }
    if (!this.phone) {
      errors.phone = 'Введите телефон';
    }
    return errors;
  }

  /**
   * Очищает данные покупателя.
   */
  clear(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }
}
