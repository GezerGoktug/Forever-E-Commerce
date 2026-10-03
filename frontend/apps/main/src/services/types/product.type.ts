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
