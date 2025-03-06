import { create } from "zustand";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  favorite?: boolean; // Neu: Favoritenstatus
};

type CartState = {
  cart: Product[];
  favorites: Product[]; // Neu: Favoriten-Liste
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  favorites: [],

  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== id),
    })),

  clearCart: () => set({ cart: [] }),

  toggleFavorite: (product) =>
    set((state) => {
      const isFavorite = state.favorites.some((fav) => fav.id === product.id);
      return {
        favorites: isFavorite
          ? state.favorites.filter((fav) => fav.id !== product.id)
          : [...state.favorites, product],
      };
    }),
}));
