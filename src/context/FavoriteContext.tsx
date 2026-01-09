// src/context/FavoriteContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
    console.log('Current token:', token);
    console.log('Is authenticated?', !!token);

    // Check if item is already in favorites
    const existingIndex = favorites.findIndex(fav => fav.id === item.id);
    if (existingIndex === -1) {
      console.log('Adding item to local favorites');
      setFavorites(prev => [...prev, item]);

      // If user is authenticated, sync with backend
      if (token) {
        console.log('Making API call to add to favorites');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/favorites/${item.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('Favorites API response:', response.status);
          if (!response.ok) {
            console.error('Error adding to favorites on backend:', response.statusText);
          } else {
            console.log('Successfully added to favorites on backend');
          }
        } catch (error) {
          console.error('Error adding to favorites on backend:', error);
        }
      } else {
        console.log('No token found, skipping backend sync');
      }
    } else {
      console.log('Item already exists in favorites');
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    console.log('removeFromFavorites called with itemId:', itemId);
    const token = getToken();
    console.log('Current token:', token);
    console.log('Is authenticated?', !!token);

    setFavorites(prev => prev.filter(item => item.id !== itemId));

    // If user is authenticated, sync with backend
    if (token) {
      console.log('Making API call to remove from favorites');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/favorites/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Remove favorites API response:', response.status);
        if (!response.ok) {
          console.error('Error removing from favorites on backend:', response.statusText);
        } else {
          console.log('Successfully removed from favorites on backend');
        }
      } catch (error) {
        console.error('Error removing from favorites on backend:', error);
      }
    } else {
      console.log('No token found, skipping backend sync');
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const backendData = await response.json();
          const backendItems: BackendFavoriteItem[] = backendData.items || [];

          // Convert backend items to local format
          const localItems = backendItems.map(backendItem => ({
            id: backendItem.product_id.toString(),
            name: backendItem.product.name,
            price: backendItem.product.price,
            image: backendItem.product.image,
          }));

          setFavorites(localItems);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from backend:', error);
    }
  };

  const clearFavoritesOnLogout = async () => {
    const token = getToken();
    try {
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/favorites`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error clearing favorites on logout:', error);
    }

    // Clear local storage
    setFavorites([]);
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