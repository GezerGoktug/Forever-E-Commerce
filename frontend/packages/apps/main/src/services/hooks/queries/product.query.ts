import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import ProductService from "@/services/actions/product.service";
import { generateSortingType } from "@/helper/generateSortingType";
import { buildQuery } from "@forever/query-kit";
import type { IFavProductCountResponse, IIsProductInFavResponse, ProductDetailType, ProductSearchQueryType, ProductType } from "@/types/product.type";
import type { IResponse, IError, IPaginationResult } from "@forever/api"

const useGetProductsQuery = (
    searchQueries: ProductSearchQueryType,
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<Omit<ProductType, "isFav">, { maxPrice: number }>>, IError>, "queryKey">
) => {
    const { searchQuery, sorting, subCategories, categories, page, minPrice } = searchQueries;
    const sortProps = generateSortingType(sorting);

    return useQuery<IResponse<IPaginationResult<Omit<ProductType, "isFav">, { maxPrice: number }>>, IError>({
        queryKey: [
            "products",
            searchQuery,
            sorting,
            subCategories,
            categories,
            page,
            minPrice,
        ],
        queryFn: () => ProductService.getProducts(
            buildQuery({
                categories,
                subCategory: subCategories,
                ...(searchQuery && searchQuery.trim().length > 2 && { searchQuery }),
                ...(sortProps.field && { sortField: sortProps.field }),
                sortType: sortProps.type,
                page,
                pageSize: 15,
                minPrice,
            })
        ),
        ...queryOptions,
    });
};

const useGetFavProductsQuery = (
    searchQueries: Omit<ProductSearchQueryType, "minPrice">,
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<Omit<ProductType, "isFav">, object>>, IError>, "queryKey">
) => {
    const { categories, page, searchQuery, sorting, subCategories } = searchQueries;
    const sortProps = generateSortingType(sorting);
    return useQuery<IResponse<IPaginationResult<Omit<ProductType, "isFav">, object>>, IError>({
        queryKey: [
            "favProducts",
            searchQuery,
            page,
            categories,
            sorting,
            subCategories
        ],
        queryFn: () => ProductService.getFavProducts(
            buildQuery({
                categories,
                subCategory: subCategories,
                ...(searchQuery.trim().length > 2 && { searchQuery }),
                ...(sortProps.field && { sortField: sortProps.field }),
                sortType: sortProps.type,
                page,
                pageSize: 10
            })
        ),
        ...queryOptions
    });
}

const useGetFavProductsCountQuery = (
    extraKeys: string[] = [],
    queryOptions?: Omit<UseQueryOptions<IResponse<IFavProductCountResponse>, IError>, "queryKey">
) => useQuery({
    queryKey: ['favProductCount', ...extraKeys],
    queryFn: () => ProductService.getFavProductsCount(),
    ...queryOptions
})


const useGetLatestProductsQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<ProductType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<ProductType[]>, IError>({
        queryKey: ["latest_collections"],
        queryFn: () =>
            ProductService.getLatestProducts(),
        ...queryOptions
    });

const useGetBestSellerProductsQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<ProductType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<ProductType[]>, IError>({
        queryKey: ["best-seller-products"],
        queryFn: () =>
            ProductService.getBestSellerProducts(),
        ...queryOptions
    });

const useGetProductDetailQuery = (id: string, queryOptions?: Omit<UseQueryOptions<IResponse<Omit<ProductDetailType, "isFav">>, IError>, "queryKey">) =>
    useQuery<IResponse<Omit<ProductDetailType, "isFav">>, IError>({
        queryKey: ["product_detail", id],
        queryFn: () =>
            ProductService.getProductDetail(id),
        ...queryOptions
    });

const useIsProductsInFavQuery = (productsIds: string[], extraKeys: string[] = [], queryOptions?: Omit<UseQueryOptions<IResponse<IIsProductInFavResponse[]>, IError>, "queryKey">) =>
    useQuery<IResponse<IIsProductInFavResponse[]>, IError>({
        queryKey: ["is_fav_product_info", (productsIds || []).toString(), ...extraKeys],
        queryFn: () =>
            ProductService.isProductsInFav(productsIds),
        ...queryOptions
    });

const useIsFavouriteProductById = (id: string, queryOptions?: Omit<UseQueryOptions<IResponse<IIsProductInFavResponse>, IError>, "queryKey">) =>
    useQuery<IResponse<IIsProductInFavResponse>, IError>({
        queryKey: ["productDetailFav", id],
        queryFn: () =>
            ProductService.isFavProductById(id),
        ...queryOptions
    });


export {
    useIsProductsInFavQuery,
    useGetProductDetailQuery,
    useIsFavouriteProductById,
    useGetLatestProductsQuery,
    useGetBestSellerProductsQuery,
    useGetProductsQuery,
    useGetFavProductsQuery,
    useGetFavProductsCountQuery
};