import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IHeaderData } from "../../types/views_interfaces";
import { ensureElement } from "../../utils/utils";

/**
 * Отображает шапку сайта и счетчик товаров на иконке корзины.
 */
export class Header extends Component<IHeaderData> {
  private cartButtonElement: HTMLButtonElement;
  private counterElement: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.cartButtonElement = ensureElement<HTMLButtonElement>('.header__cart', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__cart-counter', this.container);
    
    this.cartButtonElement.addEventListener('click', () => {
      this.events.emit('cart:show');
    });
  }

  /**
   * @param val значение счетчика товаров в корзине
   */
  set counter(val: number) {
    this.counterElement.textContent = val.toString();
  }
}