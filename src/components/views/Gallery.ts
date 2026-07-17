import { Component } from "../base/Component";
import { IGalleryData } from "../../types/views_interfaces";

/**
 * Отображает сетку каталога товаров на главной странице.
 */
export class Gallery extends Component<IGalleryData> {

  /**
   * @param container ссылка на DOM элемент за отображение, которого он отвечает
   */
  constructor(container: HTMLElement) {
    super(container);
  }

  /**
   * @param items - массив DOM элементов карточек товаров
   */
  set catalog(items: HTMLElement[]) {
    this.container.innerHTML = '';
    this.container.append(...items);
  }
}
