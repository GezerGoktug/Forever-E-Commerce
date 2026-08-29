import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartProductType, SizeType } from "@/types/product.type";

type Store = {
  cart: CartProductType[];
  __addProductOfCart: (product: Omit<CartProductType, "quantity">) => void;
  __removeProductOfCart: (id: string, size: SizeType) => void;
  __clearCart: () => void;
  __applyQuantityToProduct: (
    quantity: number,
    id: string,
    size: SizeType
  ) => void;
};

const cartStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      __addProductOfCart: (product) =>
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
      __removeProductOfCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item._id !== id || item.size !== size
          ),
        })),
      __clearCart: () => set(() => ({ cart: [] })),
      __applyQuantityToProduct: (quantity, id, size) =>
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
