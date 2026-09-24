import styles from "./LatestCollections.module.scss";
import ProductCardSkeleton from "@/components/common/ProductCard/ProductCardSkeleton";
import ProductCard from "@/components/common/ProductCard/ProductCard";
import { useIsAccess } from "@/store/auth/hooks";
import { useGetLatestProductsQuery, useIsProductsInFavQuery } from "@/services/hooks/queries/product.query";

const LatestCollections = () => {
  const isAccess = useIsAccess();

  const { data, isPending } = useGetLatestProductsQuery();

  const productIds = data?.data?.map((product) => product._id) ?? [];

  const { data: favProductInfo } = useIsProductsInFavQuery(
    productIds,
    ["isLatestProductInFavProduct"],
    {
      enabled: isAccess && productIds.length > 0
    }
  )

  const isFavProduct = (productId: string) => favProductInfo?.data.find(favInfo => favInfo._id === productId)?.isFav || false

  return (
    <div className={styles.latest_collections}>
      <div className={styles.latest_collections_top}>
        <h6 className={styles.latest_collections_title}>
          LATEST
          <span> COLLECTIONS</span>
        </h6>
        <p className={styles.latest_collections_description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>
      <div className={styles.latest_collections_products}>
        {isPending ? (
          <>
            {Array.from({ length: 10 }, (_, index) => (
              <ProductCardSkeleton
                key={`latest-collection-skeleton-${index}`}
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
                key={"latest_collection_" + product._id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LatestCollections;
