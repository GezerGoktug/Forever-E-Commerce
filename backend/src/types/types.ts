import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  user?: JwtPayload;
  browserId?: string
}

export interface IError<T> {
  path: string;
  hostName: string;
  createdAt: Date;
  errorMessage: T;
}

export type SizeType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "XXLARGE";

export type Role = "ADMIN" | "USER";

export interface CartProductType {
  _id: string;
  size: SizeType;
  price: number;
  quantity: number;
  name: string;
  image: string;
}


interface IComment {
  content: string;
  rating: number;
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  subImages: string[];
  sizes: SizeType[];
  category: "Kids" | "Men" | "Women";
  subCategory: "Topwear" | "Bottomwear" | "Winterwear";
  comments: IComment[];
}