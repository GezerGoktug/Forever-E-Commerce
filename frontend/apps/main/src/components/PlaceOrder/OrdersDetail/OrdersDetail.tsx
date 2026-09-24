import { GoDot, GoDotFill } from "react-icons/go";
import Cash from "@/components/Cart/Cash/Cash";
import styles from "./OrdersDetail.module.scss";
import { useFormContext } from "react-hook-form";
import { BaseImage, Button } from "@forever/ui-kit";

const OrdersDetail = () => {
  const form = useFormContext();

  const selectedPaymentMethod = form.watch("paymentMethod");

  const selectStripePayment = () => form.setValue("paymentMethod", "STRIPE");

  const selectCashOnDeliveryPayment = () => form.setValue("paymentMethod", "CASH_ON_DELIVERY");

  return (
    <div className={styles.order_detail}>
      <Cash isCheckoutButton={false} />
      <div className={styles.payment_method}>
        <h6>
          PAYMENT
          <span>METHOD</span>
        </h6>
        <div className={styles.payment_method_select}>
          <div
            onClick={selectStripePayment}
            className={styles.payment_method_option}
          >
            {selectedPaymentMethod === "STRIPE" ? (
              <GoDotFill fill="green" size={25} />
            ) : (
              <GoDot size={25} />
            )}

            <BaseImage src="/stripe.png" alt="" />
          </div>
          <div
            onClick={selectCashOnDeliveryPayment}
            className={styles.payment_method_option}
          >
            {selectedPaymentMethod === "CASH_ON_DELIVERY" ? (
              <GoDotFill fill="green" size={25} />
            ) : (
              <GoDot size={25} />
            )}
            <span>CASH ON DELIVERY</span>
          </div>
        </div>
      </div>
      <Button
        loading={form.formState.isSubmitting}
        type="submit"
        className={styles.payment_method_btn}
      >
        PLACE ORDER
      </Button>
    </div>
  );
};

export default OrdersDetail;
