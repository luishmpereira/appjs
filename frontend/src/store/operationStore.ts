import { create } from "zustand";
import { api } from "@/lib/axios";

interface OpertationState {
    operations: Operation[];
    fetchOperations: (page: number) => Promise<void>;
    saveOperation: (operation: Operation) => Promise<void>;
    deleteOperation: (id: number) => Promise<void>;
}

export const useOperationStore = create<OpertationState>((set) => ({
    operations: [],
    fetchOperations: async (page = 1) => {
        const { data } = await api.get<{ data: Operation[] }>(`/operations?page=${page}&limit=10`);
        set({ operations: data.data });
    },
    saveOperation: async (operation: Operation) => {
        const method = operation.id ? "put" : "post";
        const url = operation.id ? `/operations/${operation.id}` : "/operations";
        await api[method](url, operation);
        set((state) => ({ operations: [...state.operations, operation] }));
    },
    deleteOperation: async (id: number) => {
        await api.delete(`/operations/${id}`);
        set((state) => ({ operations: state.operations.filter(operation => operation.id !== id) }));
    }
}));
