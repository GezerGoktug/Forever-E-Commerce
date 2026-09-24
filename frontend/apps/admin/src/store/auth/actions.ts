import type { ExtendedUser } from "@/types/user.type";
import authStore from "./authStore";

export const setUser = (user: ExtendedUser) => authStore.getState().__setUser(user);
export const clearUser = () => authStore.getState().__clearUser();


