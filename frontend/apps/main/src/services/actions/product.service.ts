import api from "@/utils/api";
import type { IDefaultResponse, IResponse, IPaginationResult } from "@forever/api";
import type { ICreateCommentVariables, IFavProductCountResponse, IIsProductInFavResponse, ProductDetailType, ProductType } from "@/types/product.type";

const getProductDetail = (id: string): Promise<IResponse<Omit<ProductDetailType, "isFav">>> => api.get(`/product/${id}`);

const getProducts = (q: string): Promise<IResponse<IPaginationResult<Omit<ProductType, "isFav">, { maxPrice: number }>>> => api.get(`/product/list?${q}`);

const getFavProducts = (q: string): Promise<IResponse<IPaginationResult<Omit<ProductType, "isFav">, object>>> => api.get(`/product/favourites/list?${q}`);

const getFavProductsCount = (): Promise<IResponse<IFavProductCountResponse>> => api.get(`/product/favourites/count`);

const getLatestProducts = (): Promise<IResponse<ProductType[]>> => api.get("/product/latest-products/list");

const getBestSellerProducts = (): Promise<IResponse<ProductType[]>> => api.get("/product/best-seller-products/list")

const updateComment = (id: string, body: ICreateCommentVariables): Promise<IResponse<IDefaultResponse>> => api.put(`/product/comment/${id}`, body);

const deleteComment = (commentId: string, productId: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/product/${productId}/comment/${commentId}`);

const createComment = (data: ICreateCommentVariables): Promise<IResponse<IDefaultResponse>> => api.post("/product/comment/add", data);

const isProductsInFav = (productIds: string[]): Promise<IResponse<IIsProductInFavResponse[]>> => api.post("/product/favourites/isProductInFav", { productIds })

const addFav = (id: string): Promise<IResponse<IDefaultResponse>> => api.post('/product/favourites/add', {
    productId: id
});

const removeFav = (id: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/product/favourites/${id}`);

const isFavProductById = (id: string): Promise<IResponse<IIsProductInFavResponse>> => api.get(`/product/favourites/${id}`)

const ProductService = {
    getProductDetail,
    getProducts,
    getFavProducts,
    getFavProductsCount,
    getLatestProducts,
    getBestSellerProducts,
    updateComment,
    deleteComment,
    createComment,
    isProductsInFav,
    isFavProductById,
    addFav,
    removeFav,
}

export default ProductService;

