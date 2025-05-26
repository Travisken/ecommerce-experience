/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '../types/ProductType';

type CartContextType = {
  cartItems: CartItem[];
  totalItems: number;
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateCartItemAttributes: (productId: number, attributes: Partial<Product>) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cartItems';
const WISHLIST_STORAGE_KEY = 'wishlist';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Sync cartItems to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateCartItemAttributes = (productId: number, attributes: Partial<Product>) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? {
              ...item,
              product: {
                ...item.product,
                ...attributes,
              },
            }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev; // already in wishlist
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartItemAttributes,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
