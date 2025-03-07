import { create } from "zustand";
import { useEffect } from "react";

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
  setProductCatalog: (products: Product[]) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  favorites: [],
  productCatalog: [],

  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== id),
    })),

  clearCart: () =>
    set(() => ({
      cart: [],
    })),

  toggleFavorite: (product) =>
    set((state) => {
      const isFavorite = state.favorites.some((fav) => fav.id === product.id);
      return {
        favorites: isFavorite
          ? state.favorites.filter((fav) => fav.id !== product.id)
          : [...state.favorites, product],
      };
    }),

  setProductCatalog: (products) =>
    set(() => ({
      productCatalog: products,
    })),

  addProduct: (product) =>
    set((state) => {
      const updatedProducts = [...state.productCatalog, product];
      if (typeof window !== "undefined") {
        localStorage.setItem("productCatalog", JSON.stringify(updatedProducts));
      }
      return { productCatalog: updatedProducts };
    }),

  removeProduct: (id) =>
    set((state) => {
      const updatedProducts = state.productCatalog.filter(
        (product) => product.id !== id
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("productCatalog", JSON.stringify(updatedProducts));
      }
      return { productCatalog: updatedProducts };
    }),
}));

// **Client-Side Loading für `productCatalog`**
export const useLoadProducts = () => {
  const setProductCatalog = useCartStore((state) => state.setProductCatalog);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = JSON.parse(
        localStorage.getItem("productCatalog") || "[]"
      );
      setProductCatalog(storedProducts);
    }
  }, [setProductCatalog]);
};
