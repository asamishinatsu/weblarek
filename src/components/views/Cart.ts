import { Component } from "../base/Component";
import { ICartData } from "../../types/views_interfaces";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

/**
 * Отображает список добавленных в корзину товаров и итоговую сумму.
 */
export class Cart extends Component<ICartData> {
  private cartListElement: HTMLUListElement;
  private cartButtonElement: HTMLButtonElement;
  private cartTotalElement: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.cartListElement = ensureElement<HTMLUListElement>('.cart__list', this.container);
    this.cartButtonElement = ensureElement<HTMLButtonElement>('.cart__button', this.container);
    this.cartButtonElement.disabled = true;
    this.cartTotalElement = ensureElement<HTMLElement>('.cart__price', this.container);

    this.cartButtonElement.addEventListener('click', () => {
      this.events.emit('checkout:start');
    });
  }

  /**
   * @param items массив DOM элементов, каждый из которых представляет товар в корзине
   */
  set cartItems(items: HTMLElement[]) {
    this.cartListElement.innerHTML = '';
    items.forEach(item => this.cartListElement.appendChild(item));
  }

  /**
   * @param value true, если корзина пуста, иначе false
   */
  set isEmpty(value: boolean) {
    this.cartButtonElement.disabled = value;
  }

  /**
   * @param val итоговая сумма товаров в корзине
   */
  set total(val: number) {
    this.cartTotalElement.textContent = `${val} синапсов`;
  }
}