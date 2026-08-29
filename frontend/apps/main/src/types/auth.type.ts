import type { ExtendedUserType } from "./user.type";


export interface ILoginVariables {
    email: string;
    password: string;
}

export interface IRegisterVariables {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export interface IGoogleOauthVariables {
    code: string;
    redirectUri: string;
    codeVerifier: string;
}

export interface IAuthResponse {
    message: string;
    user: ExtendedUserType,
    accessToken: string,
}
