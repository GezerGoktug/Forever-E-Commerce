import type { CartProduct, SizeType } from "@/types/product.type";
import cartStore from "./cartStore";

export const addProductToCart = (product: Omit<CartProduct, "quantity">) =>
  cartStore.getState().__addProductToCart(product);

export const removeProductFromCart = (id: string, size: SizeType) =>
  cartStore.getState().__removeProductFromCart(id, size);

export const clearCart = () => cartStore.getState().__clearCart();

export const setProductQuantity = (
  quantity: number,
  id: string,
  size: SizeType
) => cartStore.getState().__setProductQuantity(quantity, id, size);
