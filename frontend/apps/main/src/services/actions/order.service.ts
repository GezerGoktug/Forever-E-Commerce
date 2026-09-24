import api from "@/utils/api";
import type { IDefaultResponse, IResponse } from "@forever/api";
import type { CreateOrderVariables, CreateOrderWithStripeResponse, Order } from "@/types/order.type";

const getMyOrders = (): Promise<IResponse<Order[]>> => api.get("/order/my-order");

const createOrderWithCashOnDeliveryPaymentMethod = (body: CreateOrderVariables): Promise<IResponse<IDefaultResponse>> => api.post("/order/add", body)

const createOrderWithStripePaymentMethod = (body: CreateOrderVariables): Promise<IResponse<CreateOrderWithStripeResponse>> => api.post("/payment", body)

const confirmOrderPayment = (orderId: string, isPayment: boolean, sessionId: string): Promise<IResponse<IDefaultResponse>> => api.put(`/order/confirm-order-payment/${orderId}`, { payment: isPayment, sessionId });

const deleteOrder = (orderId: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/order/${orderId}`);

const OrderService = {
    getMyOrders,
    createOrderWithCashOnDeliveryPaymentMethod,
    createOrderWithStripePaymentMethod,
    deleteOrder,
    confirmOrderPayment
}

export default OrderService