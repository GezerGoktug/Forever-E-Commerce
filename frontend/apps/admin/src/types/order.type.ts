import type { CartProduct } from "./product.type";
import type { BasicUser } from "./user.type";


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
