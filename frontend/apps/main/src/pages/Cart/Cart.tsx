import { Helmet } from "react-helmet";
import CartProducts from "@/components/Cart/CartProducts/CartProducts";
import Cash from "@/components/Cart/Cash/Cash";
import styles from "./Cart.module.scss";

const Cart = () => {
  return (
    <div>
      <Helmet>
        <title>My Cart - Forever</title>
        <meta
          name="description"
          content="Review your selected digital products before checkout. Secure your purchase and complete your order with Forever."
        />
      </Helmet>
      <CartProducts />
      <div className={styles.cash}>
        <Cash />
      </div>
    </div>
  );
};

export default Cart;
