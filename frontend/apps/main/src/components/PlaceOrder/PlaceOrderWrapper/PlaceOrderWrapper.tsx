import { FormProvider, useForm } from "react-hook-form";
import styles from "./PlaceOrderWrapper.module.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/store/cart/hooks";
import { useCreateOrderWithCashOnDeliveryPaymentMethodMutation, useCreateOrderWithStripePaymentMethodMutation } from "@/services/hooks/mutations/order.mutations";
import { clearCart } from "@/store/cart/actions";
import { useIsAccess } from "@/store/auth/hooks";
import DeliveryInfoForm from "@/components/PlaceOrder/DeliveryInfoForm/DeliveryInfoForm";
import OrdersDetail from "@/components/PlaceOrder/OrdersDetail/OrdersDetail";

const schema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long"),
  email: z.string().email("İnvalid email"),
  street: z.string().min(3, "Street must be at least 3 characters long"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .regex(
      /^0 \(\d{3}\) \d{3} \d{2} \d{2}$/,
      "Phone number must be '0 (999) 999 99 99' format."
    ),
  paymentMethod: z
    .enum(["CASH_ON_DELIVERY", "STRIPE"], {
      errorMap: () => ({ message: "Please select a valid payment method." }),
    })
    .default("CASH_ON_DELIVERY"),
});

const PlaceOrderWrapper = () => {
  const cart = useCart();
  const navigate = useNavigate();
  const isAccess = useIsAccess();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      paymentMethod: "CASH_ON_DELIVERY",
    },
  });

  const { mutateAsync: createOrderWithCashOnDeliveryMutation } = useCreateOrderWithCashOnDeliveryPaymentMethodMutation({
    onSuccess(data) {
      toast.success(data.data.message);
      form.reset();
      clearCart();
      navigate("/profile");
    },
  });

  const { mutateAsync: createOrderWithStripeMutation } = useCreateOrderWithStripePaymentMethodMutation()

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!isAccess) {
      toast.error("You must log in to make payment.");
      return;
    }
    if (cart.length === 0) {
      toast.error(
        "You must add a few product to your cart ,before go to payment."
      );
      return;
    }

    const body = {
      products: cart,
      cargoFee: 10,
      delivery_info: data,
    };

    try {
      if (data.paymentMethod === "CASH_ON_DELIVERY") {
        await createOrderWithCashOnDeliveryMutation(body);
      }
      else {
        await createOrderWithStripeMutation(body);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error?.response?.data?.error.errorMessage;
        if (typeof apiError === "string") toast.error(apiError);
        if (apiError && typeof apiError === "object") {
          Object.entries(apiError).forEach(([key, value]) => {
            (value as string[]).forEach((val) => {
              toast.error(`${key} : ${val}`);
            });
          });
        }

      }
      else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.place_order_wrapper}>
          <DeliveryInfoForm />
          <OrdersDetail />
        </div>
      </form>
    </FormProvider>
  );
};

export default PlaceOrderWrapper;
