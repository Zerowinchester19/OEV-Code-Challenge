import { create } from "zustand";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

type CartState = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== id),
    })),
  clearCart: () => set({ cart: [] }),
}));
