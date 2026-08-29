import useProductStore from "./productStore";

export const usePageCount = () => useProductStore((state) => state.pagination.pageCount);
export const useHasNextPage = () => useProductStore((state) => state.pagination.hasNext);
export const useHasPrevPage = () => useProductStore((state) => state.pagination.hasPrev);
export const useMaxPrice = () => useProductStore((state) => state.maxPrice);
