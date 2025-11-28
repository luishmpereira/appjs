import { create } from "zustand";
import { api } from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  page: number;
  totalPages: number;
  fetchProducts: (page?: number) => Promise<void>;
  saveProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: true,
  page: 1,
  totalPages: 1,
  fetchProducts: async (page = 1) => {
    try {
      const { data } = await api.get(`/products?page=${page}&limit=10`);
      set({ 
          products: data.data, 
          loading: false,
          page: data.meta.page,
          totalPages: data.meta.last_page
      });
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  },
  saveProduct: async (product: Partial<Product>) => {
    try {
      const url = product.id ? `/products/${product.id}` : "/products";
      const method = product.id ? "PUT" : "POST";
      await api.request({ url, method, data: product });
      get().fetchProducts(get().page);
    } catch (error) {
      console.error("Failed to save product", error);
    }
  },
  deleteProduct: async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      get().fetchProducts(get().page);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  },
}));
