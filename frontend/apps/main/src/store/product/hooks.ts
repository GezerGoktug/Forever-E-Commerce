import useProductStore from "./productStore";

export const useMaxPrice = () => useProductStore((state) => state.maxPrice);
