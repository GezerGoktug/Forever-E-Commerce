import styles from "./RelatedProducts.module.scss";
import type { ProductType } from "@/types/product.type";
import ProductItemSkeleton from "@/components/common/ProductItem/ProductItemSkeleton";
import ProductCard from "@/components/common/ProductItem/ProductItem";
import { useIsAccess } from "@/store/auth/hooks";
import { useIsProductsInFavQuery } from "@/services/hooks/queries/product.query";

const RelatedProducts = ({
  products = [],
  isPending,
}: {
  products: ProductType[];
  isPending: boolean;
}) => {
  const { data: favProductInfo } = useIsProductsInFavQuery(
    products.map(item => item._id),
    ["isRelatedProductInFavProduct"],
    {
      enabled: (useIsAccess() && !!products.length)
    }
  )

  const isFavProduct = (_id: string) => favProductInfo?.data.find(dt => dt._id === _id)?.isFav || false
  
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
            {[0, 1, 2, 3, 4].map((item) => (
              <ProductItemSkeleton key={'related_product_skeleton_' + item} />
            ))}
          </>
        ) : (
          <>
            {products.map((item, i) => (
              <ProductCard
                key={"product" + i}
                product={{ ...item, isFav: isFavProduct(item._id) }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
