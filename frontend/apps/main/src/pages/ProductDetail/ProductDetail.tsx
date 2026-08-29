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
import type { ProductDetailType } from "@/types/product.type";
import DetailSkeleton from "@/components/ProductDetail/DetailSkeleton/DetailSkeleton";

const ProductDetail = () => {
  const [tabChange, setTabChange] = useState(true);

  const params = useParams();

  const { data, error, isPending } = useGetProductDetailQuery(params.id as string);

  const { data: productFavData } = useIsFavouriteProductById(params.id as string, { enabled: useIsAccess() })

  if (error)
    return (
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

  const { comments = [], relatedProducts = [], ...otherProductProperties } =
    (data?.data as Omit<ProductDetailType, "isFav">) || {};
  const { image, subImages, ...productDetail } = otherProductProperties || {};

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
        {isPending ? (
          <DetailSkeleton />
        ) : (
          <>
            <DetailPictures images={{ image, subImages }} />
            <DetailContent productDetail={{ image, isFav: productFavData?.data.isFav as boolean, ...productDetail }} />
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
              className={clsx({ [styles.active]: tabChange })}
              onClick={() => setTabChange(true)}
            >
              Description
            </div>
            <div
              className={clsx({ [styles.active]: !tabChange })}
              onClick={() => setTabChange(false)}
            >
              Reviews ({productDetail.reviewsCount})
            </div>
          </div>
          <div className={styles.product_detail_tab_content}>
            {tabChange ? (
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
