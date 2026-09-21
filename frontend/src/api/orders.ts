import { apiClient } from "./client";

export type OrderItemInput = {
  productId: number;
  quantity?: number;
  sizeOption?: string;
};

export type PaymentMethod = "CASH" | "CARD" | "WALLET";

export type CreateOrderInput = {
  address: string;
  phone: string;
  paymentMethod?: PaymentMethod;
  items: OrderItemInput[];
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  sizeOption: string | null;
  price: number;
  product: {
    id: number;
    title: string;
    img: string | null;
  };
};

export type Order = {
  id: number;
  userId: number;
  subtotal: number;
  serviceCost: number;
  deliveryCost: number;
  total: number;
  status: string;
  paymentMethod: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export async function createOrder(
  data: CreateOrderInput,
): Promise<Order> {
  return apiClient<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyOrders(): Promise<Order[]> {
  return apiClient<Order[]>("/orders/my");
}

export async function getOrder(id: number): Promise<Order> {
  return apiClient<Order>(`/orders/${id}`);
}