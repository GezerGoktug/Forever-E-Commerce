import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./ProductDetailWrapper.module.scss";
import ProductDetailContent from "@/components/ProductDetail/ProductDetailContent/ProductDetailContent";
import ProductDetailTabs from "@/components/ProductDetail/ProductDetailTabs/ProductDetailTabs";
import ProductNotFound from "./ProductNotFound/ProductNotFound";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts/RelatedProducts";
import { useGetProductDetailQuery } from "@/services/hooks/queries/product.query";

const ProductDetailWrapper = () => {
  const params = useParams();

  const { data, error, isPending } = useGetProductDetailQuery(params.id as string);

  const productDetail = data?.data;
  const comments = productDetail?.comments ?? [];
  const relatedProducts = productDetail?.relatedProducts ?? [];

  if (error)
    return <ProductNotFound />;

  return (
    <div className={styles.product_detail_wrapper}>
      <Helmet>
        <title>
          {isPending ? "Product Detail" : productDetail?.name} - Forever
        </title>
        <meta
          name="description"
          content={
            isPending
              ? "Discover detailed information about this digital product. Check features, reviews, pricing, and purchase securely on Forever."
              : `Shop ${productDetail?.name} - ${productDetail?.description}. Available in different sizes and colors at Forever. Order now!`
          }
        />
      </Helmet>
      <ProductDetailContent productDetail={productDetail} />
      <ProductDetailTabs
        isPending={isPending}
        reviews={comments}
        reviewsCount={productDetail?.reviewsCount}
      />
      <RelatedProducts isPending={isPending} products={relatedProducts} />
    </div>
  );
};

export default ProductDetailWrapper;
