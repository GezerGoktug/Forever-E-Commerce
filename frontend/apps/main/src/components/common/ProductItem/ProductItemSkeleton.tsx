import TshirtIcon from "@/icons/TshirtIcon";
import styles from "./ProductItemSkeleton.module.scss";

const ProductItemSkeleton = () => {
  return (
    <div className={styles.product_card_skeleton}>
      <div className={styles.product_skeleton_image}>
        <TshirtIcon />
      </div>
      <div className={styles.product_skeleton_content}>
        <div className={styles.product_skeleton_title} />
        <div className={styles.product_skeleton_price} />
      </div>
    </div>
  );
};

export default ProductItemSkeleton;
