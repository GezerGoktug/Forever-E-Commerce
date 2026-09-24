import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ExtendedUser } from "@/types/user.type";

type Store = {
  user: ExtendedUser | null;
  __setUser: (user: ExtendedUser) => void;
  __clearUser: () => void;
};

const authStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      __setUser: (user) =>
        set(() => {
          return {
            user: user,
          };
        }),
      __clearUser: () =>
        set(() => {
          return {
            user: null,
          };
        }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default authStore;
