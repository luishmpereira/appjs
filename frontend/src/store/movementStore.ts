import { create } from "zustand";
import { api } from "@/lib/axios";

interface MovementStore {
    movements: Movement[];
    loading: boolean;
    error: string | null;
    fetchMovements: () => Promise<void>;
    getMovement: (movementId: number) => Promise<Movement | undefined>;
    saveMovement: (movement: Movement) => Promise<void>;
    deleteMovement: (movementId: number) => Promise<void>;
}

export const useMovementStore = create<MovementStore>((set, get) => ({
    movements: [],
    loading: false,
    error: null,
    fetchMovements: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await api.get<{data: Movement[]}>("/movements");
            set({ movements: data.data, loading: false});
        } catch (error) {
            set({ loading: false, error: `${error}` });
        }
    },
    getMovement: async (movementId: number) => {
        try {
            const { data } = await api.get<{data: Movement}>(`/movements/${movementId}`);
            return data.data;
        } catch (error) {
            set({ loading: false, error: `${error}` });
        }
    },
    saveMovement: async (movement: Movement) => {
        try {
            set({ loading: true, error: null });
            const method = movement.id ? "put" : "post";
            const url = movement.id ? `/movements/${movement.id}` : "/movements";
            await api[method](url, movement);
            get().fetchMovements();
        } catch (error) {
            set({ loading: false, error: `${error}` });
        }
    },
    deleteMovement: async (movementId: number) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`/movements/${movementId}`);
            get().fetchMovements();
        } catch (error) {
            set({ loading: false, error: `${error}` });
        }
    }
}));
