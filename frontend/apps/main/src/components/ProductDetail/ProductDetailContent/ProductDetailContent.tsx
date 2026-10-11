import { useParams } from "react-router-dom";
import styles from "./ProductDetailContent.module.scss";
import DetailPictures from "./DetailPictures/DetailPictures";
import DetailContent from "./DetailContent/DetailContent";
import TshirtIcon from "@/icons/TshirtIcon";
import { useIsAccess } from "@/store/auth/hooks";
import { useIsFavouriteProductById } from "@/services/hooks/queries/product.query";
import type { ProductDetail } from "@/types/product.type";

const DetailSkeleton = () => (
  <>
    <div className={styles.detail_pictures_skeleton_section}>
      <div className={styles.detail_pictures_skeleton_section_left}>
        <div>
          <TshirtIcon />
        </div>
        <div>
          <TshirtIcon />
        </div>
        <div>
          <TshirtIcon />
        </div>
        <div>
          <TshirtIcon />
        </div>
      </div>
      <div className={styles.detail_pictures_skeleton_section_right}>
        <TshirtIcon />
      </div>
    </div>
    <div className={styles.product_detail_skeleton}>
      <div className={styles.product_detail_skeleton_title} />
      <div className={styles.product_detail_skeleton_rating} />
      <div className={styles.product_detail_skeleton_price} />
      <div className={styles.product_detail_skeleton_desc} />
      <div className={styles.product_detail_skeleton_select_size}>
        <div className={styles.product_detail_skeleton_select_size_title} />
        <div className={styles.product_detail_skeleton_sizes}>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`skeleton-product-detail-size-${index}`} />
          ))}
        </div>
      </div>
      <div className={styles.product_detail_skeleton_short_features}>
        <div />
        <div />
        <div />
      </div>
    </div>
  </>
);

const ProductDetailContent = ({ productDetail }: { productDetail?: ProductDetail }) => {
  const params = useParams();

  const isAccess = useIsAccess();

  const { data: productFavData } = useIsFavouriteProductById(params.id as string, { enabled: isAccess });

  return (
    <div className={styles.product_detail_content}>
      {!productDetail ? (
        <DetailSkeleton />
      ) : (
        <>
          <DetailPictures images={{ image: productDetail.image, subImages: productDetail.subImages }} />
          <DetailContent productDetail={{ ...productDetail, isFav: productFavData?.data.isFav ?? false }} />
        </>
      )}
    </div>
  );
};

export default ProductDetailContent;
