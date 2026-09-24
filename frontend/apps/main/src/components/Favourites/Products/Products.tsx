import styles from './Products.module.scss'
import ProductCardSkeleton from '@/components/common/ProductCard/ProductCardSkeleton'
import { RiMenuSearchLine } from 'react-icons/ri'
import { GrPowerReset } from 'react-icons/gr'
import ProductCard from '@/components/common/ProductCard/ProductCard'
import type { ProductSearchQuery } from '@/types/product.type'
import { useQueryParams } from '@forever/query-kit'
import { useEffect } from 'react'
import { setPagination } from '@/store/product/actions'
import { DataStateHandler } from '@forever/common-utils'
import { FaCircleXmark } from 'react-icons/fa6'
import { useGetFavProductsQuery } from '@/services/hooks/queries/product.query'
import { Button } from '@forever/ui-kit'

const Products = () => {
    const { queryState, clearQuery } = useQueryParams<Pick<ProductSearchQuery, 'page' | 'categories' | 'searchQuery' | 'subCategories' | 'sorting'>>({
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
    })

    useEffect(() => {
        if (data) {
            setPagination({
                pageCount: data?.data.totalPage,
                hasNext: data.data.hasNext,
                hasPrev: data.data.hasPrev
            });
        }
    }, [data]);

    return (
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
    )
}

export default Products
