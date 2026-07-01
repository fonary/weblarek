import {
  IApi,
  OrderRequest,
  OrderResponse,
  ProductsResponse,
} from "../../types/index";

export class ClientApi {
  constructor(private api: IApi) {}

  async getProducts(): Promise<ProductsResponse> {
    return await this.api.get<ProductsResponse>("/product");
  }

  async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    return await this.api.post<OrderResponse>("/order/", order);
  }
}
