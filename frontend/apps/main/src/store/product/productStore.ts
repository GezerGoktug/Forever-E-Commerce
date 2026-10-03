import { create } from "zustand";

type Store = {
  maxPrice: number;
  __setMaxPrice: (price: number) => void;
};

const productStore = create<Store>()((set) => ({
  maxPrice: 2000,
  __setMaxPrice: (price) =>
    set((state) => {
      return {
        ...state,
        maxPrice: price,
      };
    }),
}));

export default productStore;
