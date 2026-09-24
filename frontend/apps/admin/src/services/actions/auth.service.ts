import type { IResponse, IDefaultResponse } from "@forever/api";
import api from "@/utils/api";
import type { AuthResponse, LoginVariables } from "@/types/auth.type";

const logout = (): Promise<IResponse<IDefaultResponse>> => api.get("/auth/logout");

const login = (body: LoginVariables): Promise<IResponse<AuthResponse>> => api.post("/auth/login", body);

const getSession = (): Promise<IResponse<Omit<AuthResponse, "accessToken" | "message">>> => api.get("/auth/session");

const AuthService = {
    logout,
    login,
    getSession
}

export default AuthService;
