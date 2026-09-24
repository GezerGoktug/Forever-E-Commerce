import api from "@/utils/api";
import type { AuthResponse, GoogleOauthVariables, LoginVariables, RegisterVariables } from "@/types/auth.type";
import type { IDefaultResponse, IResponse } from "@forever/api";

const logout = (): Promise<IResponse<IDefaultResponse>> => api.get("/auth/logout");

const login = (body: LoginVariables): Promise<IResponse<AuthResponse>> => api.post("/auth/login", body);

const register = (body: RegisterVariables): Promise<IResponse<AuthResponse>> => api.post("/auth/register", body);

const getSession = (): Promise<IResponse<Omit<AuthResponse, "accessToken" | "message">>> => api.get("/auth/session");

const loginWithGoogleOAuth = (body: GoogleOauthVariables): Promise<IResponse<AuthResponse>> => api.post(`/auth/google`, body);

const AuthService = {
    logout,
    login,
    register,
    getSession,
    loginWithGoogleOAuth
}

export default AuthService;