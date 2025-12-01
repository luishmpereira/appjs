import { create } from "zustand";
import { api } from "@/lib/axios";

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    sellerId: number;
    seller?: {
        id: number;
        name: string;
        email: string;
    };
}

interface ContactState {
    contacts: Contact[];
    loading: boolean;
    page: number;
    totalPages: number;
    fetchContacts: (page?: number) => Promise<void>;
    createContact: (data: Partial<Contact>) => Promise<void>;
    updateContact: (id: number, data: Partial<Contact>) => Promise<void>;
    deleteContact: (id: number) => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
    contacts: [],
    loading: true,
    page: 1,
    totalPages: 1,
    fetchContacts: async (page = 1) => {
        try {
            set({ loading: true });
            const { data } = await api.get(`/contacts?page=${page}&limit=10`);
            set({
                contacts: data.data,
                loading: false,
                page: data.meta.page,
                totalPages: data.meta.last_page
            });
        } catch (error) {
            console.error("Failed to fetch contacts", error);
            set({ loading: false });
        }
    },
    createContact: async (data) => {
        try {
            await api.post("/contacts", data);
            get().fetchContacts(get().page);
        } catch (error) {
            console.error("Failed to create contact", error);
            throw error;
        }
    },
    updateContact: async (id, data) => {
        try {
            await api.put(`/contacts/${id}`, data);
            get().fetchContacts(get().page);
        } catch (error) {
            console.error("Failed to update contact", error);
            throw error;
        }
    },
    deleteContact: async (id) => {
        try {
            await api.delete(`/contacts/${id}`);
            get().fetchContacts(get().page);
        } catch (error) {
            console.error("Failed to delete contact", error);
            throw error;
        }
    },
}));
