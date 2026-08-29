import type { CartProductType } from "./product.type";
import type { BasicUserType } from "./user.type";


export interface DeliveryInfoType {
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
export interface ICreateOrderVariables {
  products: CartProductType[];
  cargoFee: number;
  delivery_info: DeliveryInfoType
}

export interface IConfirmOrderVariables {
  orderId: string
  isPayment: boolean,
  sessionId: string
}
export interface ICreateOrderWithStripeResponse {
  sessionId: string
}


export interface IOrder {
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
  user: BasicUserType,
  totalPrice: number;
  paymentMethod: "STRIPE" | "CASH_ON_DELIVERY";
  createdAt: Date;
  products: (CartProductType & { product: string })[];
  __v: number;
}
