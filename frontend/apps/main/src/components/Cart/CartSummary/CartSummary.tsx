import styles from "./CartSummary.module.scss";
import Cash from "@/components/Cart/Cash/Cash";

const CartSummary = () => {
  return (
    <div className={styles.cart_summary}>
      <Cash />
    </div>
  );
};

export default CartSummary;
