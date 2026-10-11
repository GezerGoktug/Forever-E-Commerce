import { Helmet } from "react-helmet";
import CartProducts from "@/components/Cart/CartProducts/CartProducts";
import CartSummary from "@/components/Cart/CartSummary/CartSummary";

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
      <CartSummary />
    </div>
  );
};

export default Cart;
