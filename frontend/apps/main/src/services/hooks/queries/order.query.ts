import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import OrderService from "@/services/actions/order.service";
import type { IResponse, IError } from "@forever/api";
import type { IOrder } from "@/types/order.type";

const useMyOrdersQuery = (
    queryOptions?: UseQueryOptions<IResponse<IOrder[]>, IError>
) =>
    useQuery<IResponse<IOrder[]>, IError>({
        queryKey: ["my-orders"],
        queryFn: () => OrderService.getMyOrders(),
        ...queryOptions,
    });



export { useMyOrdersQuery };
