import { Component } from "../base/Component";
import { ICardData } from "../../types/views_interfaces";
import { ensureElement } from "../../utils/utils";

/**
 * Родительский класс, содержащий общий функционал для отображения карточек товара.
 */
export class Card<T extends ICardData = ICardData> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   */
  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  /**
   * @param title - заголовок карточки
   */
  set title(title: string) {
    this.titleElement.textContent = title;
  }

  /**
   * @param price - цена карточки
   */
  set price(price: number | null) {
    this.priceElement.textContent = price === null ? 'Бесценно' : `${price} синапсов`;
  }

}