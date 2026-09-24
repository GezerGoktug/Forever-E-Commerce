import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import AuthService from "@/services/actions/auth.service";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import type { LoginVariables, AuthResponse, RegisterVariables, GoogleOauthVariables } from "@/types/auth.type";

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

const useRegisterMutation = (mutationDetails?: UseMutationOptions<IResponse<AuthResponse>, IError, RegisterVariables>) =>
    useMutation<IResponse<AuthResponse>, IError, RegisterVariables>({
        mutationKey: ["register"],
        mutationFn: (body) => AuthService.register(body),
        ...mutationDetails
    })

const useLoginGoogleOauthMutation = (mutationDetails?: UseMutationOptions<IResponse<AuthResponse>, IError, GoogleOauthVariables>) =>
    useMutation<IResponse<AuthResponse>, IError, GoogleOauthVariables>({
        mutationKey: ["google-oauth"],
        mutationFn: (body) => AuthService.loginWithGoogleOAuth(body),
        ...mutationDetails
    });

export {
    useLogoutMutation,
    useLoginMutation,
    useRegisterMutation,
    useLoginGoogleOauthMutation
}