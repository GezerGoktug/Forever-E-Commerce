import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { IAuthResponse } from "@/types/auth.type";
import AuthService from "@/services/actions/auth.service";

const useCheckAuthSessionQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<Omit<IAuthResponse, "message" | "accessToken">>, IError>, "queryKey">) => useQuery({
    queryKey: ["check-auth-session"],
    queryFn: () => AuthService.getSession(),
    ...queryOptions,
});

export {
    useCheckAuthSessionQuery
}