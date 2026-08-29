import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import ProductService from "@/services/actions/product.service";
import { buildQuery } from "@forever/query-kit";
import type { ExtendedProductType } from "@/types/product.type";
import type { IError, IPaginationResult, IResponse } from "@forever/api";

const useGetProductsForAdminQuery = (
    searchQueries: { page: number },
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<ExtendedProductType, object>>, IError>, "queryKey">
) =>
    useQuery<IResponse<IPaginationResult<ExtendedProductType, object>>, IError>({
        queryKey: [
            "admin-products",
            searchQueries.page
        ],
        queryFn: () => ProductService.getProductsForAdmin(
            buildQuery({ page: searchQueries.page, pageSize: 15 })
        ),
        ...queryOptions,
    });

export {
    useGetProductsForAdminQuery,
};