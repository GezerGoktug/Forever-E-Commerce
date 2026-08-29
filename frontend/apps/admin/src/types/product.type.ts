import type { BasicUserType } from "./user.type";

export type CategoriesType = "Kids" | "Men" | "Women";
export type SubCategoriesType = "Topwear" | "Bottomwear" | "Winterwear";
export type SizeType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "XXLARGE";

export type ProductType = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export type CartProductType = ProductType & {
  size: SizeType;
  quantity: number;
}

export type ReviewType = {
  _id: string;
  content: string;
  rating: number;
  createdAt: Date;
  user: BasicUserType
};

export type ExtendedProductType = ProductType & {
  description: string;
  subImages: string[];
  sizes: Array<SizeType>;
  category: CategoriesType;
  subCategory: SubCategoriesType;
  isBestseller: boolean;
  comments: Omit<ReviewType, "user">[];
}

export interface IUpdateProductVariables {
  id: string,
  updatedProduct: FormData
}
