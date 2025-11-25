import { create } from "zustand";
import { api } from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  saveProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: true,
  fetchProducts: async () => {
    try {
      const { data } = await api.get("/products");
      set({ products: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  },
  saveProduct: async (product: Partial<Product>) => {
    try {
      const url = product.id ? `/products/${product.id}` : "/products";
      const method = product.id ? "PUT" : "POST";
      await api.request({ url, method, data: product });
      get().fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  },
  deleteProduct: async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      get().fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  },
}));
