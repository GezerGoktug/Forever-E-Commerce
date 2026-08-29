import { Helmet } from "react-helmet";
import PlaceOrderWrapper from "@/components/PlaceOrder/PlaceOrderWrapper/PlaceOrderWrapper";


const PlaceOrder = () => {
  return (
    <>
      <Helmet>
        <title>Place Order - Forever</title>
        <meta
          name="description"
          content="Complete your order securely on Forever. Buy digital products, software, and AI tools with confidence."
        />
      </Helmet>
      <PlaceOrderWrapper />
    </>
  );
};

export default PlaceOrder;
