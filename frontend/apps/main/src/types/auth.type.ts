import type { ExtendedUser } from "./user.type";


export interface LoginVariables {
    email: string;
    password: string;
}

export interface RegisterVariables {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export interface GoogleOauthVariables {
    code: string;
    redirectUri: string;
    codeVerifier: string;
}

export interface AuthResponse {
    message: string;
    user: ExtendedUser,
    accessToken: string,
}
