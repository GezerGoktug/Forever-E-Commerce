import type { IResponse } from "@forever/api";
import type { Order } from "@/types/order.type";
import api from "@/utils/api";

const getAdminOrders = (): Promise<IResponse<Order[]>> => api.get("/order/admin/list");;

const OrderService = {
    getAdminOrders,
}

export default OrderService