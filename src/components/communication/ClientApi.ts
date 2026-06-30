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
    const response = await this.api.get<ProductsResponse>("/product");
    return response.items;
  }

  async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    return await this.api.post<OrderResponse>("/order/", order);
  }
}
