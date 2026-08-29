import type { IResponse } from "@forever/api";
import type { IOrder } from "@/types/order.type";
import api from "@/utils/api";

const getAdminOrders = (): Promise<IResponse<IOrder[]>> => api.get("/order/admin/list");;

const OrderService = {
    getAdminOrders,
}

export default OrderService