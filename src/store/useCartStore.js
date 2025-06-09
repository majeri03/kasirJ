import { create } from 'zustand';
import * as ProductService from '../services/productService';

export const useCartStore = create((set, get) => ({
  items: [],

  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        // Item already in cart, increment quantity if stock is available
        if (existingItem.quantity < product.stock) {
          return {
            items: state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return state; // Do nothing if stock limit is reached
      }
      // Add new item to cart
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },
  
  addScannedItemToCart: async (code) => {
    const product = await ProductService.findProductByCode(code);
    if (product) {
      if (product.stock > 0) {
        get().addToCart(product);
        return { success: true, productName: product.name };
      } else {
        return { success: false, message: `Stok ${product.name} habis.` };
      }
    }
    return { success: false, message: `Produk dengan kode ${code} tidak ditemukan.` };
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, Math.min(quantity, item.stock));
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));