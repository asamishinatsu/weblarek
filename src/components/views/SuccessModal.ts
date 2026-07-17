import { Component } from "../base/Component"
import { ISuccessData } from "../../types/views_interfaces"
import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/Events"

/**
 * Отображает модальное окно с информацией об успешном оформлении заказа.
 */
export class SuccessModal extends Component<ISuccessData> {
  private descriptionElement: HTMLElement
  private closeButtonElement: HTMLButtonElement

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.closeButtonElement.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  /**
   * @param val значение суммы списанных синапсов
   */
  set total(val: number) {
    this.descriptionElement.textContent = `Списано ${val} синапсов`
  }
}