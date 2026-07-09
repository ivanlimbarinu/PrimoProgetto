import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

interface FavoritesContextProps {
  favorites: string[];
  toggleFavorite: (idMeal: string) => Promise<void>;
  isFavorite: (idMeal: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const favs = await StorageService.getFavorites();
      setFavorites(favs);
    })();
  }, []);

  const toggleFavorite = async (idMeal: string) => {
    let updated: string[];
    if (favorites.includes(idMeal)) {
      updated = favorites.filter(id => id !== idMeal);
    } else {
      updated = [...favorites, idMeal];
    }
    setFavorites(updated);
    await StorageService.saveFavorites(updated);
  };

  const isFavorite = (idMeal: string) => favorites.includes(idMeal);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites deve essere usato dentro FavoritesProvider');
  return context;
};