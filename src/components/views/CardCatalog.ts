import { Card } from "./Card";
import { IEvents } from "../base/Events";

/**
 * Отвечает за отображение карточки товара на главной странице.
 */
export class CardCatalog extends Card {
  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.container.addEventListener('click', () => {
      this.events.emit('preview:select', { id: this.getId() });
    });
  }
}