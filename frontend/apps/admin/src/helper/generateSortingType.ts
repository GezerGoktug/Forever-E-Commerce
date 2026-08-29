export type SortType = "DEFAULT" | "LOW_TO_HIGH" | "HIGH_TO_LOW";

export const generateSortingType = (sort: SortType) => {
  switch (sort) {
    case "DEFAULT":
      return { type: "default", field: null };
    case "HIGH_TO_LOW":
      return { type: "desc", field: "price" };
    case "LOW_TO_HIGH":
      return { type: "asc", field: "price" };
    default:
      return { type: "default", field: null };
  }
};