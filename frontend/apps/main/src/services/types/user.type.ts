export interface VerifyResetPasswordCodeVariables {
    resetPasswordEmail: string,
    resetPasswordCode: string
}

export interface ResetPasswordVariables {
    newPassword: string
    resetPasswordEmail: string
    resetPasswordToken: string
}

export interface VerifyResetPasswordResponse {
    message: string,
    token: string
}
