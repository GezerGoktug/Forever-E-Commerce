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

export type Role = "ADMIN" | "USER";

export type BasicUser = {
    _id: string;
    email: string;
    name: string;
    image: string;
}

export type ExtendedUser = BasicUser & {
    role: Role,
    lastLoggedIn: string
} 
