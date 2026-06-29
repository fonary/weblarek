import {
  IApi,
  OrderRequest,
  OrderResponse,
  Product,
  ProductsResponse,
} from "../../types/index";

export class ClientApi {
  constructor(private api: IApi) {}

  async getProducts(): Promise<Product[]> {
    try {
      const response = await this.api.get<ProductsResponse>("/product");
      return response.items;
    } catch (error) {
      console.error("Ошибка при загрузке товаров с сервера");
      console.error(error);
      return [];
    }
  }

  async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    try {
      return await this.api.post<OrderResponse>("/order/", order);
    } catch (error) {
      console.error("Ошибка при отправке заказа на сервер");
      console.error(error);
      return {
        id: "",
        total: 0,
      };
    }
  }
}
