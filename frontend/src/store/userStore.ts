import { create } from "zustand";
import { api } from "@/lib/axios";


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: true,
  fetchUsers: async () => {
    try {
      const { data } = await api.get("/users");
      set({ users: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  },
  deleteUser: async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      get().fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  },
}));
