import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Product } from '@/types';

export const [WishlistProvider, useWishlist] = createContextHook(() => {
  const [items, setItems] = useState<Product[]>([]);

  const saveWishlist = useCallback(async () => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, [items]);

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    saveWishlist();
  }, [saveWishlist]);

  const loadWishlist = async () => {
    try {
      const wishlistData = await AsyncStorage.getItem('wishlist');
      if (wishlistData) {
        setItems(JSON.parse(wishlistData));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const addToWishlist = (product: Product) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    if (items.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isWishlisted = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
  };
});
