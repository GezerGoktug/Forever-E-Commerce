import type { CartProductType, SizeType } from "@/types/product.type";
import cartStore from "./cartStore";

export const addProductOfCart = (product: Omit<CartProductType, "quantity">) =>
  cartStore.getState().__addProductOfCart(product);

export const removeProductOfCart = (id: string, size: SizeType) =>
  cartStore.getState().__removeProductOfCart(id, size);

export const clearCart = () => cartStore.getState().__clearCart();

export const applyQuantityToProduct = (
  quantity: number,
  id: string,
  size: SizeType
) => cartStore.getState().__applyQuantityToProduct(quantity, id, size);
