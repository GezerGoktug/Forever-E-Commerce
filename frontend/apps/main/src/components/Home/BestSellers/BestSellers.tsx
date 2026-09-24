import styles from "./BestSellers.module.scss";
import ProductCard from "@/components/common/ProductCard/ProductCard";
import ProductCardSkeleton from "@/components/common/ProductCard/ProductCardSkeleton";
import { useIsAccess } from "@/store/auth/hooks";
import { useGetBestSellerProductsQuery, useIsProductsInFavQuery } from "@/services/hooks/queries/product.query";

const BestSellers = () => {
  const isAccess = useIsAccess();

  const { data, isPending } = useGetBestSellerProductsQuery();

  const productIds = data?.data?.map((product) => product._id) ?? [];

  const { data: favProductInfo } = useIsProductsInFavQuery(
    productIds,
    ["isBestSellerProductInFavProduct"],
    {
      enabled: isAccess && productIds.length > 0
    }
  )

  const isFavProduct = (productId: string) => favProductInfo?.data.find(favInfo => favInfo._id === productId)?.isFav || false

  return (
    <div className={styles.best_sellers}>
      <div className={styles.best_sellers_top}>
        <h6 className={styles.best_sellers_title}>
          BEST
          <span> SELLERS</span>
        </h6>
        <p className={styles.best_sellers_description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>
      <div className={styles.best_sellers_products}>
        {isPending ? (
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <ProductCardSkeleton
                key={`best-sellers-collection-skeleton-${index}`}
              />
            ))}
          </>
        ) : (
          <>
            {data?.data.map((product, index) => (
              <ProductCard
                useWhileInView
                product={{ ...product, isFav: isFavProduct(product._id) }}
                customIndex={index}
                key={"best_sellers_collection_" + product._id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
