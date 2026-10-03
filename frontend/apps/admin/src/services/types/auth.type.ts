import type { ExtendedUser } from "@/types/user.type";

export interface LoginVariables {
    email: string;
    password: string;
}

export interface AuthResponse {
  message: string;
  user: ExtendedUser,
  accessToken: string,
}
