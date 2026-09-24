import type { BasicUser } from "./user.type";

export type CategoriesType = "Kids" | "Men" | "Women";
export type SubCategoriesType = "Topwear" | "Bottomwear" | "Winterwear";
export type SizeType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "XXLARGE";

export type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export type CartProduct = Product & {
  size: SizeType;
  quantity: number;
}

export type Review = {
  _id: string;
  content: string;
  rating: number;
  createdAt: Date;
  user: BasicUser
};

export type ExtendedProduct = Product & {
  description: string;
  subImages: string[];
  sizes: Array<SizeType>;
  category: CategoriesType;
  subCategory: SubCategoriesType;
  isBestseller: boolean;
  comments: Omit<Review, "user">[];
}

export interface UpdateProductVariables {
  id: string,
  updatedProduct: FormData
}
