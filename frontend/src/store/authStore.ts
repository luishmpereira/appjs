import { create } from "zustand";
import { api } from "@/lib/axios";

interface AuthState {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      set({ user: data });
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem("token");
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      set({ user: data.user });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
