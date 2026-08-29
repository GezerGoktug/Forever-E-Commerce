import useCartStore from "./cartStore";

export const useCart = () => useCartStore((state) => state.cart);

export const usePrice = () => {
  const cart = useCartStore((state) => state.cart);
  const price = cart.reduce((acc, item) => item.price * item.quantity + acc, 0);
  return price;
};

export const useTotalCartQuantities = () => {
  const cart = useCartStore((state) => state.cart);
  const totalQuantity = cart.reduce((acc, item) => item.quantity + acc, 0);
  return totalQuantity;
};
