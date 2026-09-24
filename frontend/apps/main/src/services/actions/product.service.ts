import api from "@/utils/api";
import type { IDefaultResponse, IResponse, IPaginationResult } from "@forever/api";
import type { CreateCommentVariables, FavProductCountResponse, IsProductInFavResponse, ProductDetail, Product } from "@/types/product.type";

const getProductDetail = (id: string): Promise<IResponse<Omit<ProductDetail, "isFav">>> => api.get(`/product/${id}`);

const getProducts = (q: string): Promise<IResponse<IPaginationResult<Omit<Product, "isFav">, { maxPrice: number }>>> => api.get(`/product/list?${q}`);

const getFavProducts = (q: string): Promise<IResponse<IPaginationResult<Omit<Product, "isFav">, object>>> => api.get(`/product/favourites/list?${q}`);

const getFavProductsCount = (): Promise<IResponse<FavProductCountResponse>> => api.get(`/product/favourites/count`);

const getLatestProducts = (): Promise<IResponse<Product[]>> => api.get("/product/latest-products/list");

const getBestSellerProducts = (): Promise<IResponse<Product[]>> => api.get("/product/best-seller-products/list")

const updateComment = (id: string, body: CreateCommentVariables): Promise<IResponse<IDefaultResponse>> => api.put(`/product/comment/${id}`, body);

const deleteComment = (commentId: string, productId: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/product/${productId}/comment/${commentId}`);

const createComment = (data: CreateCommentVariables): Promise<IResponse<IDefaultResponse>> => api.post("/product/comment/add", data);

const isProductsInFav = (productIds: string[]): Promise<IResponse<IsProductInFavResponse[]>> => api.post("/product/favourites/isProductInFav", { productIds })

const addFav = (id: string): Promise<IResponse<IDefaultResponse>> => api.post('/product/favourites/add', {
    productId: id
});

const removeFav = (id: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/product/favourites/${id}`);

const isFavProductById = (id: string): Promise<IResponse<IsProductInFavResponse>> => api.get(`/product/favourites/${id}`)

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

