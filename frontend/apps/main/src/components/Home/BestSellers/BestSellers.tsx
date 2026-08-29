import type { ProductType } from "@/types/product.type";
import styles from "./BestSellers.module.scss";
import ProductCard from "@/components/common/ProductItem/ProductItem";
import ProductItemSkeleton from "@/components/common/ProductItem/ProductItemSkeleton";
import { useIsAccess } from "@/store/auth/hooks";
import { useGetBestSellerProductsQuery, useIsProductsInFavQuery } from "@/services/hooks/queries/product.query";

const BestSellers = () => {
  const { data, isPending } = useGetBestSellerProductsQuery();

  const { data: favProductInfo } = useIsProductsInFavQuery(
    data?.data?.map(p => p._id) || [],
    ["isBestSellerProductInFavProduct"],
    {
      enabled: (useIsAccess() && !!data?.data?.length)
    }
  )

  const isFavProduct = (_id: string) => favProductInfo?.data.find(dt => dt._id === _id)?.isFav || false

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
            {[0, 1, 2, 3, 4].map((item) => (
              <ProductItemSkeleton
                key={"best_sellers_collection_skeleton_" + item}
              />
            ))}
          </>
        ) : (
          <>
            {data?.data.map((item: ProductType, i: number) => (
              <ProductCard
                useWhileInView
                product={{ ...item, isFav: isFavProduct(item._id) }}
                customIndex={i}
                key={"best_sellers_collection_" + item._id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
