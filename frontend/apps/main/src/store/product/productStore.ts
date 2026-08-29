import { create } from "zustand";

export interface ProductPagination {
  pageCount: number | null;
  hasNext: boolean;
  hasPrev: boolean;
}

type Store = {
  pagination: ProductPagination,
  maxPrice: number;
  __setPagination: (pagination: ProductPagination & { pageCount: number }) => void;
  __setMaxPrice: (price: number) => void;
};

const productStore = create<Store>()((set) => ({
  pagination: {
    pageCount: null,
    hasNext: false,
    hasPrev: false
  },
  maxPrice: 2000,
  __setPagination: (pagination) =>
    set((state) => {
      return {
        ...state,
        pagination: pagination,
      };
    }),

  __setMaxPrice: (price) =>
    set((state) => {
      return {
        ...state,
        maxPrice: price,
      };
    }),
}));

export default productStore;
