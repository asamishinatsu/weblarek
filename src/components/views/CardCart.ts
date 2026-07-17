import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

/**
 * Отвечает за компактное отображение товара в списке корзины.
 */
export class CardCart extends Card {
  private itemIndexElement: HTMLElement;
  private deleteButtonElement: HTMLButtonElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.itemIndexElement = ensureElement<HTMLElement>('.cart__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.cart__item-delete', this.container);

    this.deleteButtonElement.addEventListener('click', () => {
      this.events.emit('cart:remove', { id: this.getId() });
    });
  }

  /**
   * @param val индекс товара в корзине
   */
  set index(val: number) {
    this.itemIndexElement.textContent = val.toString();
  }
}