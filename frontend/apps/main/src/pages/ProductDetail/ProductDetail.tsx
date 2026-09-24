import { useState } from "react";
import Description from "@/components/ProductDetail/Description/Description";
import DetailContent from "@/components/ProductDetail/DetailContent/DetailContent";
import DetailPictures from "@/components/ProductDetail/DetailPictures/DetailPictures";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts/RelatedProducts";
import CreateReview from "@/components/ProductDetail/Reviews/CreateReview/CreateReview";
import Reviews from "@/components/ProductDetail/Reviews/Reviews/Reviews";
import styles from "./ProductDetail.module.scss";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { Helmet } from "react-helmet";
import { useIsAccess } from "@/store/auth/hooks";
import { useGetProductDetailQuery, useIsFavouriteProductById } from "@/services/hooks/queries/product.query";
import DetailSkeleton from "@/components/ProductDetail/DetailSkeleton/DetailSkeleton";

const ProductNotFound = () => (
  <div className={styles.error_product_detail_wrapper}>
    <div className={styles.error_product_detail}>
      <MdOutlineProductionQuantityLimits size={120} />
      <h6 className={styles.error_product_detail_title}>
        No product found
      </h6>
      <p className={styles.error_product_detail_content}>
        The product you want was not found. Maybe you can try another
        search.
      </p>
    </div>
  </div>
);

const ProductDetail = () => {
  const params = useParams();

  const isAccess = useIsAccess();

  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const { data, error, isPending } = useGetProductDetailQuery(params.id as string);

  const { data: productFavData } = useIsFavouriteProductById(params.id as string, { enabled: isAccess })

  const productDetail = data?.data;
  const comments = productDetail?.comments ?? [];
  const relatedProducts = productDetail?.relatedProducts ?? [];

  const showDescriptionTab = () => setActiveTab("description");
  const showReviewsTab = () => setActiveTab("reviews");

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
      <div className={styles.product_detail_top}>
        {isPending || !productDetail ? (
          <DetailSkeleton />
        ) : (
          <>
            <DetailPictures images={{ image: productDetail.image, subImages: productDetail.subImages }} />
            <DetailContent productDetail={{ ...productDetail, isFav: productFavData?.data.isFav ?? false }} />
          </>
        )}
      </div>
      {isPending ? (
        <>
          <div className={styles.skeleton_product_detail_tabs} />
          <div className={styles.skeleton_product_detail_tab_contents} />
        </>
      ) : (
        <div className={styles.product_detail_bottom}>
          <div className={styles.product_detail_tab}>
            <div
              className={clsx({ [styles.active]: activeTab === "description" })}
              onClick={showDescriptionTab}
            >
              Description
            </div>
            <div
              className={clsx({ [styles.active]: activeTab === "reviews" })}
              onClick={showReviewsTab}
            >
              Reviews ({productDetail?.reviewsCount})
            </div>
          </div>
          <div className={styles.product_detail_tab_content}>
            {activeTab === "description" ? (
              <Description />
            ) : (
              <div>
                <CreateReview />
                <Reviews reviews={comments} />
              </div>
            )}
          </div>
        </div>
      )}

      <RelatedProducts isPending={isPending} products={relatedProducts} />
    </div>
  );
};

export default ProductDetail;
