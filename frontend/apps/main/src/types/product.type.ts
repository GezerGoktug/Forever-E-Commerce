import type { BasicUser } from "./user.type";

export type CategoriesType = "Kids" | "Men" | "Women";
export type SubCategoriesType = "Topwear" | "Bottomwear" | "Winterwear";
export type SizeType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "XXLARGE";
export type SortType = "DEFAULT" | "LOW_TO_HIGH" | "HIGH_TO_LOW";

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

export type ProductDetailContent = {
  _id: string;
  name: string;
  price: number;
  image: string;
  sizes: SizeType[];
  description: string;
  reviewsCount: number;
  category: CategoriesType;
  subCategory: SubCategoriesType;
  totalRating: number;
};

export type ProductSearchQuery = {
  categories: CategoriesType[];
  subCategories: SubCategoriesType[];
  page: number;
  minPrice: number;
  searchQuery: string;
  sorting: SortType
}

export type ProductDetail = ProductDetailContent & {
  comments: Review[];
  relatedProducts: Product[];
  subImages: string[];
};

export interface IsProductInFavResponse {
  _id: string,
  isFav: boolean
}

export interface FavProductCountResponse {
  count: number
}

export interface CreateCommentVariables {
  rating: number;
  content: string;
  productId: string;
}

export interface UpdateCommentVariables {
  commentId: string;
  body: CreateCommentVariables;
}

export interface DeleteCommentVariables {
  commentId: string;
  productId: string;
}

export interface HandleFavouriteVariables {
  isFav: boolean;
  productId: string;
}