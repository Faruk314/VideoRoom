import { create } from "zustand";
import type { IUser } from "../types/user";

interface UserState {
  user: IUser | null;
  isLogged: boolean;

  setUser: (user: IUser | null) => void;
  setLoginStatus: (status: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLogged: false,

  setUser: (user) => set({ user: user }),

  setLoginStatus: (status) => set({ isLogged: status }),
}));
