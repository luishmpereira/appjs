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
  page: number;
  totalPages: number;
  fetchUsers: (page?: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: true,
  page: 1,
  totalPages: 1,
  fetchUsers: async (page = 1) => {
    try {
      const { data } = await api.get(`/users?page=${page}&limit=10`);
      set({ 
          users: data.data, 
          loading: false,
          page: data.meta.page,
          totalPages: data.meta.last_page
      });
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  },
  deleteUser: async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      get().fetchUsers(get().page);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  },
}));
