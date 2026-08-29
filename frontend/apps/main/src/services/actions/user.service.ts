import api from "@/utils/api";
import type { IDefaultResponse, IResponse } from "@forever/api";
import type { IResetPasswordVariables, IVerifyResetPasswordResponse } from "@/types/user.type";

const resetPasswordRequest = (resetPasswordEmail: string): Promise<IResponse<IDefaultResponse>> => api.get(`/user/reset-password-req?resetPasswordEmail=${resetPasswordEmail}`);

const evalResetPasswordCode = (q: string): Promise<IResponse<IVerifyResetPasswordResponse>> => api.get(`/user/eval-reset-password-code?${q}`);

const resetPassword = (body: IResetPasswordVariables): Promise<IResponse<IDefaultResponse>> => api.post(`/user/reset-password`, {
    newPassword: body.newPassword,
    resetPasswordEmail: body.resetPasswordEmail
}, {
    headers: {
        Authorization: `Bearer ${body.resetPasswordToken}`
    }
});

const UserService = {
    resetPasswordRequest,
    evalResetPasswordCode,
    resetPassword
}

export default UserService;