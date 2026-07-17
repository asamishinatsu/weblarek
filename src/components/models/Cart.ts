import type { IProduct } from '../../types';
import type { EventEmitter } from '../base/Events';

/**
 * Класс корзины покупок.
 * Отвечает за управление списком товаров, которые пользователь добавил к покупке.
**/
export class Cart {
  private items: IProduct[] = [];
  private events: EventEmitter;

  /**
   * @param events - брокер событий для обновления корзины.
   */
  constructor(events: EventEmitter) {
    this.events = events;
  }

  /**
   * Добавляет товар в корзину и инициирует событие обновления корзины.
   * @param item - объект товара для добавления.
   */
  add(item: IProduct): void {
    this.items.push(item);
    this.events.emit("cart:updated", this.getItems());
  }

  /**
   * Удаляет товар из корзины и инициирует событие обновления корзины.
   * @param id - идентификатор товара.
   */
  remove(id: string): void {
    this.items = this.items.filter((product) => product.id !== id);
    this.events.emit("cart:updated", this.getItems());
  }

  /**
   * @returns количество товаров в корзине.
   */
  getCount(): number {
    return this.items.length;
  }

  /**
   * @returns список товаров в корзине.
   */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * @returns общая стоимость товаров в корзине.
   */
  getTotal(): number {
    return this.items.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  /**
   * Проверяет, содержится ли товар в корзине.
   * @param id - идентификатор товара.
   * @returns true, если товар содержится в корзине, иначе false.
   */
  contains(id: string): boolean {
    return this.items.some((product) => product.id === id);
  }

  /**
   * Очищает корзину и инициирует событие обновления корзины.
   */
  clear(): void {
    this.items = [];
    this.events.emit("cart:updated", this.getItems());
  }
}