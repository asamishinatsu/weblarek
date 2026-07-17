import { Component } from "../base/Component";
import { IFormData } from "../../types/views_interfaces";
import { ensureElement } from "../../utils/utils";

/**
 * Родительский класс для всех форм в приложении. Обрабатывает общий функционал: вывод ошибок валидации и блокировку кнопки сабмита.
 */
export class Form extends Component<IFormData> {
  protected formButtonElement: HTMLButtonElement;
  private formErrorsElement: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   */
  constructor(container: HTMLElement) {
    super(container);
    this.formButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  /**
   * @param value - состояние валидности формы
   */
  set valid(value: boolean) {
    this.formButtonElement.disabled = !value;
  }

  /**
   * @param errors - массив ошибок валидации
   */
  set errors(errors: string[]) {
    this.formErrorsElement.textContent = errors.join(', ');
  }
}