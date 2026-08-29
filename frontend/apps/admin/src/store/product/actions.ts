import productStore, { type ProductPagination } from "./productStore";

export const setPagination = (pagination: ProductPagination & { pageCount: number }) =>
  productStore.getState().__setPagination(pagination);
export const setMaxPrice = (price: number) =>
  productStore.getState().__setMaxPrice(price);
