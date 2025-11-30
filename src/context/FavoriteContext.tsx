// src/context/FavoriteContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Define the type for a favorite item
interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  // Add other properties as needed
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoritesCount: () => number;
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

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (item: FavoriteItem) => {
    // Check if item is already in favorites
    const existingIndex = favorites.findIndex(fav => fav.id === item.id);
    if (existingIndex === -1) {
      setFavorites(prev => [...prev, item]);
    }
  };

  const removeFromFavorites = (itemId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
  };

  const isFavorite = (itemId: string) => {
    return favorites.some(item => item.id === itemId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
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