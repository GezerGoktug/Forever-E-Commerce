import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import ProductService from "@/services/actions/product.service";
import { buildQuery } from "@forever/query-kit";
import type { FavProductCountResponse, IsProductInFavResponse, ProductDetail, ProductSearchQuery, Product, SortType } from "@/types/product.type";
import type { IResponse, IError, IPaginationResult } from "@forever/api"

const DEFAULT_PRODUCTS_PAGE_SIZE = 15;
const DEFAULT_FAV_PRODUCTS_PAGE_SIZE = 10;

type SortParams = {
    type: "default" | "asc" | "desc";
    field: "price" | null;
};

const generateSortingType = (sort: SortType): SortParams => {
    switch (sort) {
        case "HIGH_TO_LOW":
            return { type: "desc", field: "price" };
        case "LOW_TO_HIGH":
            return { type: "asc", field: "price" };
        case "DEFAULT":
            return { type: "default", field: null };
    }
};

const useGetProductsQuery = (
    searchQueries: ProductSearchQuery,
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<Omit<Product, "isFav">, { maxPrice: number }>>, IError>, "queryKey">
) => {
    const { searchQuery, sorting, subCategories, categories, page, minPrice, pageSize } = searchQueries;
    const sortProps = generateSortingType(sorting);

    return useQuery<IResponse<IPaginationResult<Omit<Product, "isFav">, { maxPrice: number }>>, IError>({
        queryKey: [
            "products",
            searchQuery,
            sorting,
            subCategories,
            categories,
            page,
            pageSize,
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
                pageSize: pageSize || DEFAULT_PRODUCTS_PAGE_SIZE,
                minPrice,
            })
        ),
        ...queryOptions,
    });
};

const useGetFavProductsQuery = (
    searchQueries: Omit<ProductSearchQuery, "minPrice">,
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<Omit<Product, "isFav">, object>>, IError>, "queryKey">
) => {
    const { categories, page, searchQuery, sorting, subCategories, pageSize } = searchQueries;
    const sortProps = generateSortingType(sorting);
    return useQuery<IResponse<IPaginationResult<Omit<Product, "isFav">, object>>, IError>({
        queryKey: [
            "favProducts",
            searchQuery,
            page,
            pageSize,
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
                pageSize: pageSize || DEFAULT_FAV_PRODUCTS_PAGE_SIZE
            })
        ),
        ...queryOptions
    });
}

const useGetFavProductsCountQuery = (
    extraKeys: string[] = [],
    queryOptions?: Omit<UseQueryOptions<IResponse<FavProductCountResponse>, IError>, "queryKey">
) => useQuery({
    queryKey: ['favProductCount', ...extraKeys],
    queryFn: () => ProductService.getFavProductsCount(),
    ...queryOptions
})


const useGetLatestProductsQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<Product[]>, IError>, "queryKey">) =>
    useQuery<IResponse<Product[]>, IError>({
        queryKey: ["latest_collections"],
        queryFn: () =>
            ProductService.getLatestProducts(),
        ...queryOptions
    });

const useGetBestSellerProductsQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<Product[]>, IError>, "queryKey">) =>
    useQuery<IResponse<Product[]>, IError>({
        queryKey: ["best-seller-products"],
        queryFn: () =>
            ProductService.getBestSellerProducts(),
        ...queryOptions
    });

const useGetProductDetailQuery = (id: string, queryOptions?: Omit<UseQueryOptions<IResponse<Omit<ProductDetail, "isFav">>, IError>, "queryKey">) =>
    useQuery<IResponse<Omit<ProductDetail, "isFav">>, IError>({
        queryKey: ["product_detail", id],
        queryFn: () =>
            ProductService.getProductDetail(id),
        ...queryOptions
    });

const useIsProductsInFavQuery = (productsIds: string[], extraKeys: string[] = [], queryOptions?: Omit<UseQueryOptions<IResponse<IsProductInFavResponse[]>, IError>, "queryKey">) =>
    useQuery<IResponse<IsProductInFavResponse[]>, IError>({
        queryKey: ["is_fav_product_info", (productsIds || []).toString(), ...extraKeys],
        queryFn: () =>
            ProductService.isProductsInFav(productsIds),
        ...queryOptions
    });

const useIsFavouriteProductById = (id: string, queryOptions?: Omit<UseQueryOptions<IResponse<IsProductInFavResponse>, IError>, "queryKey">) =>
    useQuery<IResponse<IsProductInFavResponse>, IError>({
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