// src/context/FavoriteContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { resolveImageUrl } from '@/lib/imageUrl';
import { apiService } from '@/services/apiService';

// Define the type for a favorite item
interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  // Add other properties as needed
}

interface BackendFavoriteItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: any; // Product type from backend
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoritesCount: () => number;
  loadFavoritesFromBackend: () => Promise<void>;
  clearFavoritesOnLogout: () => Promise<void>;
  clearFavoritesFromServer: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // Load favorites from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    return [];
  });

  const { getToken } = useAuth();

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Load favorites from backend when user logs in
  useEffect(() => {
    const token = getToken();
    if (token) {
      loadFavoritesFromBackend();
    } else {
      // When user logs out, clear local favorites
      setFavorites([]);
    }
  }, [getToken]);

  const addToFavorites = async (item: FavoriteItem) => {
    console.log('addToFavorites called with item:', item);
    const token = getToken();

    // Check if item is already in favorites
    const existingIndex = favorites.findIndex(fav => fav.id === item.id);
    if (existingIndex === -1) {
      setFavorites(prev => [...prev, item]);

      // If user is authenticated, sync with backend
      if (token) {
        console.log('Making API call to add to favorites');
        try {
          await apiService.post(`/favorites/${item.id}`, {});
          console.log('Successfully added to favorites on backend');
        } catch (error) {
          console.error('Error adding to favorites on backend:', error);
        }
      }
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    console.log('removeFromFavorites called with itemId:', itemId);
    const token = getToken();

    setFavorites(prev => prev.filter(item => item.id !== itemId));

    // If user is authenticated, sync with backend
    if (token) {
      console.log('Making API call to remove from favorites');
      try {
        await apiService.delete(`/favorites/${itemId}`);
        console.log('Successfully removed from favorites on backend');
      } catch (error) {
        console.error('Error removing from favorites on backend:', error);
      }
    }
  };

  const isFavorite = (itemId: string) => {
    return favorites.some(item => item.id === itemId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  const loadFavoritesFromBackend = async () => {
    const token = getToken();
    try {
      if (token) {
        const backendData = await apiService.get('/favorites');
        const backendItems: BackendFavoriteItem[] = backendData.items || [];

        // Convert backend items to local format
        const localItems = backendItems.map(backendItem => ({
          id: backendItem.product_id.toString(),
          name: backendItem.product.name,
          price: backendItem.product.price,
          image: resolveImageUrl(backendItem.product.image) || '',
        }));

        setFavorites(localItems);
      }
    } catch (error) {
      console.error('Error loading favorites from backend:', error);
    }
  };

  const clearFavoritesFromServer = async () => {
    const token = getToken();
    try {
      if (token) {
        await apiService.delete('/favorites');
      }
    } catch (error) {
      console.error('Error clearing favorites from server:', error);
    }

    setFavorites([]);
  };

  const clearFavoritesOnLogout = async () => {
    await clearFavoritesFromServer();
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
        loadFavoritesFromBackend,
        clearFavoritesOnLogout,
        clearFavoritesFromServer,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};