import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import type { IConfirmOrderVariables, ICreateOrderVariables } from "@/types/order.type";
import OrderService from "@/services/actions/order.service";
import { loadStripe } from "@stripe/stripe-js";

const useCreateOrderWithCashOnDeliveryPaymentMethodMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ICreateOrderVariables>
) => useMutation<IResponse<IDefaultResponse>, IError, ICreateOrderVariables>({
    mutationKey: ["create_order_with_cash_on_delivery"],
    mutationFn: (body) =>
        OrderService.createOrderWithCashOnDeliveryPaymentMethod(body),
    ...mutationDetails
});

const useCreateOrderWithStripePaymentMethodMutation = (
    mutationDetails?: UseMutationOptions<
        IDefaultResponse,
        IError | Error,
        ICreateOrderVariables
    >
) => {
    return useMutation<IDefaultResponse, IError | Error, ICreateOrderVariables>({
        mutationKey: ["create_order_with_stripe"],
        mutationFn: async (body) => {
            const data = await OrderService.createOrderWithStripePaymentMethod(body);
            const stripe = await loadStripe(import.meta.env.VITE_REACT_STRIPE_PUBLISHABLE_KEY);

            const result = await stripe?.redirectToCheckout({
                sessionId: data.data.sessionId,
            });

            if (result?.error) {
                throw new Error(result.error.message);
            }

            return { message: "Successfully create payment session" };
        },
        ...mutationDetails,
    });
};

const useDeleteOrderMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationFn: (orderId) => OrderService.deleteOrder(orderId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    })
}

const useConfirmOrderPaymentMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, IConfirmOrderVariables>) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, IConfirmOrderVariables>({
        mutationFn: ({ orderId, isPayment, sessionId }) => OrderService.confirmOrderPayment(orderId, isPayment, sessionId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    })
}


export {
    useCreateOrderWithCashOnDeliveryPaymentMethodMutation,
    useCreateOrderWithStripePaymentMethodMutation,
    useDeleteOrderMutation,
    useConfirmOrderPaymentMutation
}