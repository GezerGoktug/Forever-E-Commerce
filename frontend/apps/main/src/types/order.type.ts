import type { CartProduct } from "./product.type";
import type { BasicUser } from "./user.type";


export interface DeliveryInfo {
  firstName: string,
  lastName: string,
  email: string,
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  phoneNumber: string,
  paymentMethod: "CASH_ON_DELIVERY" | "STRIPE",
}
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


export interface Order {
  locationInfo: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  payment: boolean;
  user: BasicUser,
  totalPrice: number;
  paymentMethod: "STRIPE" | "CASH_ON_DELIVERY";
  createdAt: Date;
  products: (CartProduct & { product: string })[];
}
