import type { ExtendedUserType } from "@/types/user.type";
import authStore from "./authStore";

export const setUser = (user: ExtendedUserType) => authStore.getState().__setUser(user);
export const clearUser = () => authStore.getState().__clearUser();


