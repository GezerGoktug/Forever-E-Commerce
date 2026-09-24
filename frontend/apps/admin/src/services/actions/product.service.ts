import api from "@/utils/api";
import type { IDefaultResponse, IPaginationResult, IResponse } from "@forever/api";
import type { ExtendedProduct } from "@/types/product.type";

const getProductsForAdmin = (q: string): Promise<IResponse<IPaginationResult<ExtendedProduct, object>>> => api.get(`/product/admin/list?${q}`);

const deleteProduct = (id: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/product/${id}`);

const updateProduct = (id: string, body: FormData): Promise<IResponse<IDefaultResponse>> => api.put(`/product/${id}`, body);

const addProduct = (body: FormData): Promise<IResponse<IDefaultResponse>> => api.post("/product/add", body);

const ProductService = {
    getProductsForAdmin,
    deleteProduct,
    updateProduct,
    addProduct,
}

export default ProductService;

