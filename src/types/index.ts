export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type Payment = "cash" | "card" | "online";

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface Customer {
  payment: Payment | null;
  address: string;
  email: string;
  phone: string;
}

export interface OrderRequest extends Customer {
  payment: Payment;
  total: number;
  items: string[];
}

export interface ProductsResponse {
  total: number;
  items: Product[];
}

export interface OrderResponse {
  id: string;
  total: number;
  error?: string;
}
