import { IApi, IOrder, IOrderResult, IProductList } from '../../types/index';

/**
 * Класс api приложения.
 * Отвечает за взаимодействие с backend-частью приложения.
 */
export class LarekApi {
    private api: IApi;

    /**
     * @param api - готовый экземпляр класса для работы с сетью.
     */
    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Выполняет GET-запрос на эндпоинт `/product/`.
     * @returns промис с объектом, содержащим общее количество товаров (`total`) и массив самих товаров (`items`).
     */
    getProductsList(): Promise<IProductList> {
        return this.api.get('/product/') as Promise<IProductList>;
    }

    /**
     * Выполняет POST-запрос на эндпоинт `/order/`.
     * @param order - объект заказа.
     * @returns промис с объектом ответа от сервера, содержащим ID созданного заказа и списанную сумму.
     */
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post('/order/', order) as Promise<IOrderResult>;
    }
}