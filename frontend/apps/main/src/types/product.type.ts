import { type SortType } from "@/helper/generateSortingType";
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



export type ProductDetailContentType = {
  _id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  description: string;
  reviewsCount: number;
  category: CategoriesType;
  subCategory: SubCategoriesType;
  __v: number;
  totalRating: number;
};

export type ProductSearchQueryType = {
  categories: CategoriesType[];
  subCategories: SubCategoriesType[];
  page: number;
  minPrice: number;
  searchQuery: string;
  sorting: SortType
}

export type ProductDetailType = ProductDetailContentType & {
  comments: ReviewType[];
  relatedProducts: ProductType[];
  subImages: string[];
};

export interface IIsProductInFavResponse {
  _id: string,
  isFav: boolean
}

export interface IFavProductCountResponse {
  count: number
}

export interface ICreateCommentVariables {
  rating: number;
  content: string;
  productId: string;
}

export interface UpdateCommentVariables {
  commentId: string;
  body: ICreateCommentVariables;
}

export interface DeleteCommentVariables {
  commentId: string;
  productId: string;
}

export interface HandleFavouriteVariables {
  isFav: boolean;
  productId: string;
}