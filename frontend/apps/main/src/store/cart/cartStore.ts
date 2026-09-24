import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartProduct, SizeType } from "@/types/product.type";

type Store = {
  cart: CartProduct[];
  __addProductToCart: (product: Omit<CartProduct, "quantity">) => void;
  __removeProductFromCart: (id: string, size: SizeType) => void;
  __clearCart: () => void;
  __setProductQuantity: (
    quantity: number,
    id: string,
    size: SizeType
  ) => void;
};

const cartStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      __addProductToCart: (product) =>
        set((state) => {
          if (
            state.cart.find(
              (item) => item._id === product._id && item.size === product.size
            )
          ) {
            return {
              cart: state.cart.map((item) => {
                if (item._id === product._id && item.size === product.size) {
                  return { ...item, quantity: item.quantity + 1 };
                }
                return item;
              }),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        }),
      __removeProductFromCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item._id !== id || item.size !== size
          ),
        })),
      __clearCart: () => set(() => ({ cart: [] })),
      __setProductQuantity: (quantity, id, size) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item._id === id && item.size === size) {
              return {
                ...item,
                quantity: quantity > 0 ? quantity : item.quantity,
              };
            }
            return item;
          }),
        })),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default cartStore;
