import type { CartProduct } from "@/types/product.type";
import type { DeliveryInfo } from "@/types/order.type";

export interface CreateOrderVariables {
  products: CartProduct[];
  cargoFee: number;
  delivery_info: DeliveryInfo
}

export interface ConfirmOrderVariables {
  orderId: string
  isPayment: boolean,
  sessionId: string
}

export interface CreateOrderWithStripeResponse {
  sessionId: string
}
