import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { CartItem, Product } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

export const [CartProvider, useCart] = createContextHook(() => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getCart();
      if (response.success) {
        const mappedItems: CartItem[] = response.data.map((item: any) => ({
          id: item._id || item.id,
          product: item.productId,
          quantity: item.quantity,
        }));
        setItems(mappedItems);
        // Do NOT save backend items to local 'guest' cart storage to avoid duplication loops
        // await AsyncStorage.setItem('cart', JSON.stringify(mappedItems));
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLocalCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setItems(JSON.parse(cartData));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load local cart:', error);
    }
  };

  const syncLocalCartToBackend = async () => {
    if (!isAuthenticated || items.length === 0) return;
    try {
      // Simplistic sync: add each local item to backend
      for (const item of items) {
        await apiService.addToCart(item.product.id, item.quantity);
      }
      // Clear guest cart after syncing to prevent duplicate syncs
      await AsyncStorage.removeItem('cart');
      fetchCart(); // Refresh with backend data
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncLocalCartToBackend();
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        const response = await apiService.addToCart(product.id, quantity);
        if (response.success) {
          fetchCart();
          return { success: true };
        }
      } catch (error: any) {
        console.error('Add to cart failed:', error);
        return { success: false, message: error.message };
      }
    }

    // Fallback/Local logic
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev, { id: Date.now().toString(), product, quantity }];
      }
      AsyncStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
    return { success: true };
  }, [isAuthenticated, fetchCart]);

  const removeFromCart = useCallback(async (id: string) => {
    if (isAuthenticated) {
      try {
        const response = await apiService.removeFromCart(id);
        if (response.success) {
          fetchCart();
          return;
        }
      } catch (error) {
        console.error('Remove from cart failed:', error);
      }
    }

    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      AsyncStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  }, [isAuthenticated, fetchCart]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(id);
    }

    if (isAuthenticated) {
      try {
        const response = await apiService.updateCartQuantity(id, quantity);
        if (response.success) {
          fetchCart();
          return;
        }
      } catch (error) {
        console.error('Update quantity failed:', error);
      }
    }

    setItems((prev) => {
      const newItems = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      AsyncStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  }, [isAuthenticated, fetchCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    setItems([]);
    await AsyncStorage.removeItem('cart');
    // Note: Backend might need a clear cart endpoint or multiple removals
  }, []);

  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

  return useMemo(() => ({
    items,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
    refreshCart: fetchCart,
  }), [items, isLoading, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount, fetchCart]);
});
