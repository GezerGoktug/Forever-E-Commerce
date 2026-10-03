import productStore from "./productStore";

export const setMaxPrice = (price: number) =>
  productStore.getState().__setMaxPrice(price);
