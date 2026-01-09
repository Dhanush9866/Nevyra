import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

interface WishlistMapping {
  [productId: string]: string; // productId -> wishlistItemId (_id)
}

export const [WishlistProvider, useWishlist] = createContextHook(() => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [mapping, setMapping] = useState<WishlistMapping>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      loadLocalWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getWishlist();
      if (response.success) {
        const products = response.data.map((item: any) => item.productId);
        const newMapping: WishlistMapping = {};
        response.data.forEach((item: any) => {
          newMapping[item.productId.id] = item._id || item.id;
        });
        setItems(products);
        setMapping(newMapping);
        await AsyncStorage.setItem('wishlist', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalWishlist = async () => {
    try {
      const wishlistData = await AsyncStorage.getItem('wishlist');
      if (wishlistData) {
        setItems(JSON.parse(wishlistData));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load local wishlist:', error);
    }
  };

  const syncLocalWishlistToBackend = async () => {
    if (!isAuthenticated || items.length === 0) return;
    try {
      for (const product of items) {
        await apiService.addToWishlist(product.id);
      }
      fetchWishlist();
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncLocalWishlistToBackend();
    }
  }, [isAuthenticated]);

  const addToWishlist = async (product: Product) => {
    if (isAuthenticated) {
      try {
        const response = await apiService.addToWishlist(product.id);
        if (response.success) {
          fetchWishlist();
        }
      } catch (error) {
        console.error('Add to wishlist failed:', error);
      }
    }

    setItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      const newItems = [...prev, product];
      AsyncStorage.setItem('wishlist', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromWishlist = async (productId: string) => {
    if (isAuthenticated) {
      try {
        const itemId = mapping[productId];
        if (itemId) {
          const response = await apiService.removeFromWishlist(itemId);
          if (response.success) {
            fetchWishlist();
          }
        }
      } catch (error) {
        console.error('Remove from wishlist failed:', error);
      }
    }

    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== productId);
      AsyncStorage.setItem('wishlist', JSON.stringify(newItems));
      return newItems;
    });
  };

  const toggleWishlist = async (product: Product) => {
    if (isWishlisted(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isWishlisted = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return {
    items,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
    refreshWishlist: fetchWishlist,
  };
});
