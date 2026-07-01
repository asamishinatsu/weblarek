import type { IProduct } from '../../types';
import type { EventEmitter } from '../base/Events';

/**
 * Класс каталога товаров.
 * Отвечает за хранение массива товаров и выбранного товара для просмотра.
 */
export class Catalog {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;
  private events: EventEmitter;

  /**
   * @param events - брокер событий для обновления каталога и открытия превью.
   */
  constructor(events: EventEmitter) {
    this.events = events;
  }

  /**
   * Сохраняет массив товаров и инициирует событие обновления каталога.
   * @param items - массив товаров для сохранения.
   */
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:updated', this.items);
  }


  /**
   * @returns массив всех товаров.
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Сохраняет товар для детального просмотра и инициирует событие открытия превью.
   * @param item - объект товара для сохранения.
   */
  set setPreview(item: IProduct) {
    this.preview = item;
    this.events.emit('catalog:preview', this.preview);
  }

  /**
   * Возвращает выбранный товар для просмотра.
   * @returns объект товара для просмотра или null, если ничего не выбрано.
   */
  get getPreview(): IProduct | null {
    return this.preview;
  }

  /**
   * Находит товар по идентификатору.
   * @param id - идентификатор товара.
   * @returns объект товара или undefined, если товар не найден.
   */
  getProduct(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }
}
