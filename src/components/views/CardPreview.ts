import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { ICardActions, ICardPreviewData } from "../../types/views_interfaces";
import { categoryMap } from "../../utils/constants";

/**
 * Отвечает за отображение детальной информации о товаре в модальном окне.
 */
export class CardPreview extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  private addToCartButtonElement: HTMLButtonElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param actions объект для работы с событиями
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.addToCartButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.addToCartButtonElement.addEventListener('click', actions.onClick);
    }
  }

  /**
   * @param path путь к изображению
   */
  set image(path: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, path);
    }
  }

  /**
   * @param cat категория карточки
   */
  set category(cat: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = cat;
      const modifier = categoryMap[cat as keyof typeof categoryMap];
      this.categoryElement.className = modifier ? `card__category ${modifier}` : 'card__category';
    }
  }

  /**
   * @param text описание карточки
   */
  set description(text: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = text;
    }
  }

  /**
   * @param text текст кнопки
   */
  set buttonText(text: string) {
    this.addToCartButtonElement.textContent = text;
  }

  /**
   * @param isDisabled состояние кнопки
   */
  set buttonDisabled(isDisabled: boolean) {
    this.addToCartButtonElement.disabled = isDisabled;
  }
}