import { create } from 'zustand';
import * as ProductService from '../services/productService';

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: true,
  
  fetchProducts: async (searchQuery = '') => {
    set({ isLoading: true });
    try {
      const products = await ProductService.getAllProducts(searchQuery);
      set({ products, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      set({ isLoading: false });
    }
  },
  
  addProduct: async (product) => {
    try {
      await ProductService.addProduct(product);
      get().fetchProducts(); // Re-fetch all products to update the list
    } catch (error) {
      console.error("Failed to add product:", error);
      // Optionally, set an error state
    }
  },
  
  updateProduct: async (product) => {
    try {
      await ProductService.updateProduct(product);
      get().fetchProducts(); // Re-fetch
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await ProductService.deleteProduct(id);
      get().fetchProducts(); // Re-fetch
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  },
}));