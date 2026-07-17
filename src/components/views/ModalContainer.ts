import { Component } from "../base/Component";
import { IModalData } from "../../types/views_interfaces";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

/**
 * Контейнер для модального окна.
 */
export class ModalContainer extends Component<IModalData> {
  private closeButtonElement: HTMLButtonElement;
  private contentElement: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param events объект для работы с событиями
   */
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButtonElement.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  /**
   * @param content содержимое модального окна
   */
  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  /**
   * Открывает модальное окно.
   */
  open() {
    this.container.classList.add('modal_active');
  }

  /**
   * Закрывает модальное окно.
   */
  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  /**
   * Очищает содержимое модального окна.
   */
  clear() {
    this.contentElement.innerHTML = '';
  }
}