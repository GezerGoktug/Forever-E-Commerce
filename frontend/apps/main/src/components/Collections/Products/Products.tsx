import type { ProductSearchQuery, SortType } from "@/types/product.type";
import styles from "./Products.module.scss";
import { useEffect } from "react";
import { setMaxPrice, setPagination } from "@/store/product/actions";
import ProductCard from "@/components/common/ProductCard/ProductCard";
import ProductCardSkeleton from "@/components/common/ProductCard/ProductCardSkeleton";
import { useQueryParams } from "@forever/query-kit";
import { RiMenuSearchLine } from "react-icons/ri";
import { GrPowerReset } from "react-icons/gr";
import { useIsAccess } from "@/store/auth/hooks";
import { DataStateHandler } from "@forever/common-utils";
import { FaCircleXmark } from "react-icons/fa6";
import { useGetProductsQuery, useIsProductsInFavQuery } from "@/services/hooks/queries/product.query";
import { Button } from "@forever/ui-kit";

const Products = () => {
  const { queryState, clearQuery, querySetters: { setSorting } } = useQueryParams<Pick<ProductSearchQuery, 'page' | 'categories' | 'minPrice' | 'searchQuery' | 'subCategories' | 'sorting'>>({
    page: 0,
    categories: [],
    subCategories: [],
    searchQuery: '',
    minPrice: 0,
    sorting: 'DEFAULT'
  })

  const { searchQuery, minPrice, page, categories, subCategories, sorting } = queryState;

  const isAccess = useIsAccess();

  const { data, isPending, isError, refetch } = useGetProductsQuery({
    page,
    sorting,
    subCategories,
    categories,
    minPrice,
    searchQuery
  })

  const productIds = data?.data.content.map((product) => product._id) ?? [];

  const { data: favProductInfo } = useIsProductsInFavQuery(
    productIds,
    ["isProductInFavProduct"],
    {
      enabled: isAccess && productIds.length > 0
    }
  )

  useEffect(() => {
    if (data?.data?.otherData) {
      setPagination({
        pageCount: data?.data.totalPage,
        hasNext: data.data.hasNext,
        hasPrev: data.data.hasPrev,
      });
      setMaxPrice(data.data.otherData?.maxPrice);
    }
  }, [data]);

  const isFavProduct = (productId: string) => favProductInfo?.data.find(favInfo => favInfo._id === productId)?.isFav || false

  return (
    <div className={styles.product_wrapper}>
      <div className={styles.product_header}>
        <h5>
          ALL <span>COLLECTIONS</span>
        </h5>
        <select
          onChange={(e) => setSorting(e.target.value as SortType)}
          value={sorting}
          className={styles.product_sort_select}
          name="sorting_products"
        >
          <option value="DEFAULT">Sort by: Relevant</option>
          <option value="LOW_TO_HIGH">Sort by: Low to High</option>
          <option value="HIGH_TO_LOW">Sort by: High to Low</option>
        </select>
      </div>
      <div className={styles.products}>
        <DataStateHandler
          data={data?.data.content}
          isError={isError}
          isLoading={isPending}
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
          loadingFallback={
            <>
              {Array.from({ length: 12 }, (_, index) => (
                <ProductCardSkeleton key={`product-skeleton-${index}`} />
              ))}
            </>
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
        >
          {
            (products) => products.map((product) => (
              <ProductCard
                key={"product" + product._id}
                product={{ ...product, isFav: isFavProduct(product._id) }}
              />
            ))
          }
        </DataStateHandler>
      </div>
    </div>
  );
};

export default Products;
