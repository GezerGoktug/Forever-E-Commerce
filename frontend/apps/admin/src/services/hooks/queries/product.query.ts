import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import ProductService from "@/services/actions/product.service";
import { buildQuery } from "@forever/query-kit";
import type { ExtendedProduct } from "@/types/product.type";
import type { IError, IPaginationResult, IResponse } from "@forever/api";

const DEFAULT_ADMIN_PRODUCTS_PAGE_SIZE = 15;

const useGetProductsForAdminQuery = (
    searchQueries: { page: number; pageSize?: number },
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<ExtendedProduct, object>>, IError>, "queryKey">
) =>
    useQuery<IResponse<IPaginationResult<ExtendedProduct, object>>, IError>({
        queryKey: [
            "admin-products",
            searchQueries.page,
            searchQueries.pageSize
        ],
        queryFn: () => ProductService.getProductsForAdmin(
            buildQuery({
                page: searchQueries.page,
                pageSize: searchQueries.pageSize || DEFAULT_ADMIN_PRODUCTS_PAGE_SIZE
            })
        ),
        ...queryOptions,
    });

export {
    useGetProductsForAdminQuery,
};