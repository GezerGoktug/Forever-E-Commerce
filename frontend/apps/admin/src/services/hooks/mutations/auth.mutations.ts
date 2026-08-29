import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import AuthService from "@/services/actions/auth.service";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import type { ILoginVariables, IAuthResponse, IRegisterVariables } from "@/types/auth.type";

const useLogoutMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError>) =>
    useMutation<IResponse<IDefaultResponse>, IError>({
        mutationKey: ["logout"],
        mutationFn: () => AuthService.logout(),
        ...mutationDetails
    })

const useLoginMutation = (mutationDetails?: UseMutationOptions<IResponse<IAuthResponse>, IError, ILoginVariables>) =>
    useMutation<IResponse<IAuthResponse>, IError, ILoginVariables>({
        mutationKey: ["login"],
        mutationFn: (body) => AuthService.login(body),
        ...mutationDetails
    })

const useRegisterMutation = (mutationDetails?: UseMutationOptions<IResponse<IAuthResponse>, IError, IRegisterVariables>) =>
    useMutation<IResponse<IAuthResponse>, IError, IRegisterVariables>({
        mutationKey: ["register"],
        mutationFn: (body) => AuthService.register(body),
        ...mutationDetails
    })

export {
    useLogoutMutation,
    useLoginMutation,
    useRegisterMutation
}