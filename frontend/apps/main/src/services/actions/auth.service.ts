import api from "@/utils/api";
import type { IAuthResponse, IGoogleOauthVariables, ILoginVariables, IRegisterVariables } from "@/types/auth.type";
import type { IDefaultResponse, IResponse } from "@forever/api";

const logout = (): Promise<IResponse<IDefaultResponse>> => api.get("/auth/logout");

const login = (body: ILoginVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/login", body);

const register = (body: IRegisterVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/register", body);

const getSession = (): Promise<IResponse<Omit<IAuthResponse, "accessToken" | "message">>> => api.get("/auth/session");

const loginWithGoogleOAuth = (body: IGoogleOauthVariables): Promise<IResponse<IAuthResponse>> => api.post(`/auth/google`, body);

const AuthService = {
    logout,
    login,
    register,
    getSession,
    loginWithGoogleOAuth
}

export default AuthService;