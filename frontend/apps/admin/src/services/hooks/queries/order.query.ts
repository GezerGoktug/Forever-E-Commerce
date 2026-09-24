import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import OrderService from "@/services/actions/order.service";
import type { IResponse, IError } from "@forever/api";
import type { Order } from "@/types/order.type";


const useAdminOrdersQuery = (
    queryOptions?: UseQueryOptions<IResponse<Order[]>, IError>
) =>
    useQuery<IResponse<Order[]>, IError>({
        queryKey: ["admin-orders"],
        queryFn: () => OrderService.getAdminOrders(),
        ...queryOptions,
    });


export { useAdminOrdersQuery };
