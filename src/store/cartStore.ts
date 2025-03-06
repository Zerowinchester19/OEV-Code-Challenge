import { create } from "zustand";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  isCustom?: boolean;
};

type CartState = {
  cart: Product[];
  favorites: Product[];
  productCatalog: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  setInitialProducts: (products: Product[]) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  favorites: [],
  productCatalog: JSON.parse(localStorage.getItem("productCatalog") || "[]"), // Produkte aus `localStorage` laden

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

  setInitialProducts: (apiProducts) =>
    set(() => {
      const storedProducts = JSON.parse(
        localStorage.getItem("productCatalog") || "[]"
      );

      return {
        productCatalog:
          storedProducts.length > 0 ? storedProducts : apiProducts,
      };
    }),

  addProduct: (product) =>
    set((state) => {
      const updatedProducts = [...state.productCatalog, product];
      localStorage.setItem("productCatalog", JSON.stringify(updatedProducts)); // Speichern in localStorage
      return { productCatalog: updatedProducts };
    }),

  removeProduct: (id) =>
    set((state) => {
      const updatedProducts = state.productCatalog.filter(
        (product) => product.id !== id
      );
      localStorage.setItem("productCatalog", JSON.stringify(updatedProducts)); // Aktualisieren in localStorage
      return { productCatalog: updatedProducts };
    }),
}));
