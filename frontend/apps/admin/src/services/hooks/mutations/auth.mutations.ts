import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import AuthService from "@/services/actions/auth.service";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import type { LoginVariables, AuthResponse } from "@/types/auth.type";

const useLogoutMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError>) =>
    useMutation<IResponse<IDefaultResponse>, IError>({
        mutationKey: ["logout"],
        mutationFn: () => AuthService.logout(),
        ...mutationDetails
    })

const useLoginMutation = (mutationDetails?: UseMutationOptions<IResponse<AuthResponse>, IError, LoginVariables>) =>
    useMutation<IResponse<AuthResponse>, IError, LoginVariables>({
        mutationKey: ["login"],
        mutationFn: (body) => AuthService.login(body),
        ...mutationDetails
    })

export {
    useLogoutMutation,
    useLoginMutation
}