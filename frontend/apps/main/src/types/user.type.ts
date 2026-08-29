export interface IVerifyResetPasswordCodeVariables {
    resetPasswordEmail: string,
    resetPasswordCode: string
}

export interface IResetPasswordVariables {
    newPassword: string
    resetPasswordEmail: string
    resetPasswordToken: string
}

export interface IVerifyResetPasswordResponse {
    message: string,
    token: string
}

export type Role = "ADMIN" | "USER";

export type BasicUserType = {
    _id: string;
    email: string;
    name: string;
    image: string;
}

export type ExtendedUserType = BasicUserType & {
    role: Role,
    lastLoggedIn: string
} 
