import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICardPreviewData } from "../../types/views_interfaces";

/**
 * Отвечает за отображение детальной информации о товаре в модальном окне.
 */
export class CardPreview extends Card<ICardPreviewData> {
  private addToCartButtonElement: HTMLButtonElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.addToCartButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.addToCartButtonElement.addEventListener('click', () => {
      this.events.emit('cart:toggle', { id: this.getId() });
    });
  }

  /**
   * @param param0 объект с состоянием кнопки добавления в корзину
   */
  set buttonState({ inCart, available }: { inCart: boolean; available: boolean }) {
    if (!available) {
      this.addToCartButtonElement.textContent = 'Недоступно';
      this.addToCartButtonElement.disabled = true;
      return;
    }
    this.addToCartButtonElement.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
    this.addToCartButtonElement.disabled = false;
  }
}