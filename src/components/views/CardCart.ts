import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { ICardActions, ICardData } from "../../types/views_interfaces";

/**
 * Отвечает за компактное отображение товара в списке корзины.
 */
export class CardCart extends Card {
  private itemIndexElement: HTMLElement;
  private deleteButtonElement: HTMLButtonElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param actions объект для работы с событиями
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.itemIndexElement = ensureElement<HTMLElement>('.cart__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.cart__item-delete', this.container);

    if (actions?.onClick) {
      this.deleteButtonElement.addEventListener('click', actions.onClick);
    }
  }

  /**
   * @param val индекс товара в корзине
   */
  set index(val: number) {
    this.itemIndexElement.textContent = val.toString();
  }
}