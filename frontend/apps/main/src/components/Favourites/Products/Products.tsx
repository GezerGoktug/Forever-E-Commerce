import styles from './Products.module.scss'
import ProductCardSkeleton from '@/components/common/ProductCard/ProductCardSkeleton'
import { RiMenuSearchLine } from 'react-icons/ri'
import { GrPowerReset } from 'react-icons/gr'
import ProductCard from '@/components/common/ProductCard/ProductCard'
import type { ProductSearchQuery } from '@/types/product.type'
import { useQueryParams } from '@forever/query-kit'
import { DataStateHandler } from '@forever/common-utils'
import { FaCircleXmark } from 'react-icons/fa6'
import { useGetFavProductsQuery } from '@/services/hooks/queries/product.query'
import { Button } from '@forever/ui-kit'
import ScrollTopByPageChange from '@/components/common/ScrollTopByPageChange/ScrollTopByPageChange'
import Pagination from '@/components/common/Pagination/Pagination'

const FAV_PRODUCT_PAGINATION_PAGE_SIZE = 10;

const Products = () => {
    const { queryState, clearQuery, querySetters: { setPage } } = useQueryParams<Pick<ProductSearchQuery, 'page' | 'categories' | 'searchQuery' | 'subCategories' | 'sorting'>>({
        page: 0,
        categories: [],
        subCategories: [],
        searchQuery: '',
        sorting: 'DEFAULT'
    })

    const { searchQuery, page, categories, subCategories, sorting } = queryState;

    const { data, isPending, isError, refetch } = useGetFavProductsQuery({
        sorting,
        page,
        categories,
        subCategories,
        searchQuery,
        pageSize: FAV_PRODUCT_PAGINATION_PAGE_SIZE
    })

    return (
        <>
            <ScrollTopByPageChange />
            <div className={styles.products}>
                <DataStateHandler
                    data={data?.data.content}
                    isLoading={isPending}
                    isError={isError}
                    errorFallback={
                        <div className={styles.products_error}>
                            <FaCircleXmark className={styles.products_error_icon} />
                            <div className={styles.products_error_text}>
                                <h6>Error</h6>
                                <p>
                                    We couldn't load products with those filters. Please try again.
                                </p>
                                <Button
                                    className={styles.products_error_btn}
                                    variant="secondary"
                                    onClick={() => refetch()}
                                >
                                    RETRY
                                    <GrPowerReset size={20} />
                                </Button>
                            </div>
                        </div>
                    }
                    noContentFallback={
                        <div className={styles.products_no_content}>
                            <RiMenuSearchLine className={styles.products_no_content_icon} />
                            <div className={styles.products_no_content_text}>
                                <h6>No products found</h6>
                                <p>
                                    No products match your search. Try a different query.
                                </p>
                                <Button
                                    className={styles.products_no_content_btn}
                                    variant="secondary"
                                    onClick={clearQuery}
                                >
                                    RESET FILTERS
                                    <GrPowerReset size={20} />
                                </Button>
                            </div>
                        </div>
                    }
                    loadingFallback={
                        <>
                            {Array.from({ length: 12 }, (_, index) => (
                                <ProductCardSkeleton key={`product-skeleton-${index}`} />
                            ))}
                        </>
                    }
                >
                    {
                        (products) => products.map((product) => (
                            <ProductCard
                                key={"fav_product" + product._id}
                                product={{ ...product, isFav: true }}
                            />
                        ))
                    }
                </DataStateHandler>
            </div>
            <div className={styles.products_pagination}>
                <Pagination
                    page={page}
                    onPageChange={setPage}
                    pageSize={FAV_PRODUCT_PAGINATION_PAGE_SIZE}
                    totalPage={data?.data.totalPage ?? 0}
                    totalItems={data?.data.totalItems ?? 0}
                    title='Showing products'
                />
            </div>
        </>
    )
}

export default Products
