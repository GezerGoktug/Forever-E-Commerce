import styles from "./RelatedProducts.module.scss";
import type { Product } from "@/types/product.type";
import ProductCardSkeleton from "@/components/common/ProductCard/ProductCardSkeleton";
import ProductCard from "@/components/common/ProductCard/ProductCard";
import { useIsAccess } from "@/store/auth/hooks";
import { useIsProductsInFavQuery } from "@/services/hooks/queries/product.query";

const RelatedProducts = ({
  products = [],
  isPending,
}: {
  products: Product[];
  isPending: boolean;
}) => {
  const isAccess = useIsAccess();

  const productIds = products.map((product) => product._id);

  const { data: favProductInfo } = useIsProductsInFavQuery(
    productIds,
    ["isRelatedProductInFavProduct"],
    {
      enabled: isAccess && productIds.length > 0
    }
  )

  const isFavProduct = (productId: string) => favProductInfo?.data.find(favInfo => favInfo._id === productId)?.isFav || false

  return (
    <div className={styles.related_products}>
      <div className={styles.related_products_top}>
        <h6 className={styles.related_products_title}>
          RELATED
          <span> PRODUCTS</span>
        </h6>
      </div>
      <div className={styles.related_products_products}>
        {isPending ? (
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <ProductCardSkeleton key={`related-product-skeleton-${index}`} />
            ))}
          </>
        ) : (
          <>
            {products.map((product) => (
              <ProductCard
                key={"product" + product._id}
                product={{ ...product, isFav: isFavProduct(product._id) }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
