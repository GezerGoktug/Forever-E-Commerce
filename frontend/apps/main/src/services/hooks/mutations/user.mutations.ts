import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import UserService from "@/services/actions/user.service";
import type { ResetPasswordVariables, VerifyResetPasswordCodeVariables, VerifyResetPasswordResponse } from "@/types/user.type";

const useResetPasswordRequestMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>) =>
    useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationKey: ["reset-password-request"],
        mutationFn: (resetPasswordEmail) => UserService.resetPasswordRequest(resetPasswordEmail),
        ...mutationDetails
    })


const useVerifyResetPasswordCodeMutation = (mutationDetails?: UseMutationOptions<IResponse<VerifyResetPasswordResponse>, IError, VerifyResetPasswordCodeVariables>) =>
    useMutation<IResponse<VerifyResetPasswordResponse>, IError, VerifyResetPasswordCodeVariables>({
        mutationKey: ["verify-reset-password-code"],
        mutationFn: ({ resetPasswordEmail, resetPasswordCode }) => {
            const searchParams = new URLSearchParams({
                resetPasswordEmail,
                resetPasswordCode
            })
            return UserService.evalResetPasswordCode(searchParams.toString())
        },
        ...mutationDetails
    })

const useResetPasswordMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ResetPasswordVariables>) =>
    useMutation<IResponse<IDefaultResponse>, IError, ResetPasswordVariables>({
        mutationKey: ["reset-password"],
        mutationFn: (body) => UserService.resetPassword(body),
        ...mutationDetails
    })

export {
    useResetPasswordRequestMutation,
    useVerifyResetPasswordCodeMutation,
    useResetPasswordMutation
}    