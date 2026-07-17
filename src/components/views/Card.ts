import { Component } from "../base/Component";
import { ICardData } from "../../types/views_interfaces";
import { ensureElement, setElementData, getElementData } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

/**
 * Родительский класс, содержащий общий функционал для отображения карточек товара.
 */
export class Card<T extends ICardData = ICardData> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected categoryElement?: HTMLElement;
  protected descriptionElement?: HTMLElement;

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   */
  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement || undefined;
    this.categoryElement = this.container.querySelector('.card__category') as HTMLElement || undefined;
    this.descriptionElement = this.container.querySelector('.card__text') as HTMLElement || undefined;
  }

  /**
   * Cохраняет `id` карточки в `dataset`
   * @param value - уникальный идентификатор карточки
   */
  set id(value: string) {
    setElementData(this.container, { id: value });
  }

  /**
   * @returns сохраненный `id`
   */
  protected getId(): string {
    return getElementData<{ id: string }>(this.container, { id: String }).id;
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

  /**
   * @param path - путь к изображению
   */
  set image(path: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, path);
    }
  }

  /**
   * @param cat - категория карточки
   */
  set category(cat: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = cat;
      const modifier = categoryMap[cat as keyof typeof categoryMap];
      this.categoryElement.className = modifier ? `card__category ${modifier}` : 'card__category';
    }
  }

  /**
   * @param text - описание карточки
   */
  set description(text: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = text;
    }
  }
}