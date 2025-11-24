import { create } from "zustand";
import { api } from "@/lib/axios";

interface Role {
  id: number;
  name: string;
  permissions: any[];
}

interface RoleStore {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  fetchRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleStore>((set) => ({
  roles: [],
  setRoles: (roles) => set({ roles }),
  fetchRoles: async () => {
    try {
      const { data } = await api.get("/roles");
      set({ roles: data });
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  },
}));
