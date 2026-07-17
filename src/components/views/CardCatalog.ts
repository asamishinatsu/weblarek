import { Card } from "./Card";
import { ICardActions, ICardCatalogData } from "../../types/views_interfaces";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

/**
 * Отвечает за отображение карточки товара на главной странице.
 */
export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   * @param actions объект для работы с событиями
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  /**
   * @param path - путь к изображению
   */
  set image(path: string) {
    this.setImage(this.imageElement, path);
  }

  /**
   * @param cat категория карточки
   */
  set category(cat: string) {
    this.categoryElement.textContent = cat;
    const modifier = categoryMap[cat as keyof typeof categoryMap];
    this.categoryElement.className = modifier ? `card__category ${modifier}` : 'card__category';
  }
}