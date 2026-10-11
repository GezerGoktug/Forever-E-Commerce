import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import styles from "./ProductNotFound.module.scss";

const ProductNotFound = () => (
  <div className={styles.product_not_found_wrapper}>
    <div className={styles.product_not_found}>
      <MdOutlineProductionQuantityLimits size={120} />
      <h6 className={styles.product_not_found_title}>
        No product found
      </h6>
      <p className={styles.product_not_found_content}>
        The product you want was not found. Maybe you can try another
        search.
      </p>
    </div>
  </div>
);

export default ProductNotFound;
