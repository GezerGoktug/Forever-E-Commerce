import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import AdminService from "@/services/actions/admin.service";
import type { IError, IResponse } from "@forever/api";
import type { IAdminStatResponse } from "@/types/admin.type";

const useGetAdminStatisticsQuery = (
    queryOptions?: Omit<UseQueryOptions<IResponse<IAdminStatResponse>, IError>, "queryKey">
) => useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => AdminService.getAdminStatistics(),
    refetchInterval: 1000 * 60 * 10,
    ...queryOptions
});

export { useGetAdminStatisticsQuery };

