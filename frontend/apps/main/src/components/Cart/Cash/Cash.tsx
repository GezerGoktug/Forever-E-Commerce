import { Link } from "react-router-dom";
import { usePrice } from "@/store/cart/hooks";
import styles from "./Cash.module.scss";
import { Button } from "@forever/ui-kit";

const Cash = ({ isCheckoutButton = true }: { isCheckoutButton?: boolean }) => {
  const price = usePrice();

  return (
    <div className={styles.cash_wrapper}>
      <h5>
        CART <span>TOTALS</span>
      </h5>
      <ul className={styles.cash_infos}>
        <li>
          <span>Subtotal</span>
          <span>$ {price.toFixed(2)}</span>
        </li>
        <li>
          <span>Shipping Fee</span>
          <span>$ 10.00</span>
        </li>
        <li>
          <span>Total</span>
          <span>$ {(price + 10.0).toFixed(2)}</span>
        </li>
      </ul>
      {isCheckoutButton && (
        <Link to="/place-order">
          <Button className={styles.cash_button}>PROCEED TO CHECKOUT</Button>
        </Link>
      )}
    </div>
  );
};

export default Cash;
