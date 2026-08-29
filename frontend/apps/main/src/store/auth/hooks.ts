import useAuthStore from "./authStore";

export const useAccount = () => useAuthStore((state) => state.user);

export const useIsAccess = () => useAuthStore((state) => state.user !== null);

export const useIsAdmin = () => useAuthStore((state) => state.user?.role === "ADMIN");
