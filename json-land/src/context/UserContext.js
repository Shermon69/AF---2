import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser, addFavoriteCountry, removeFavoriteCountry } from '../components/Auth';

// Create UserContext
export const UserContext = createContext();

// UserContext Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Migrate cca3 to cca2 favorites in LocalStorage
  const migrateFavorites = async (currentUser) => {
    if (!currentUser || !currentUser.favorites || !Array.isArray(currentUser.favorites)) {
      return currentUser;
    }

    // Check if favorites contain cca3 codes (3 letters)
    const hasCca3 = currentUser.favorites.some((code) => code.length === 3);
    if (!hasCca3) {
      return currentUser; // Already using cca2, no migration needed
    }

    try {
      // Fetch all countries to map cca3 to cca2
      const response = await axios.get(
        'https://restcountries.com/v3.1/all?fields=cca2,cca3'
      );
      const countryMap = response.data.reduce((map, country) => {
        map[country.cca3] = country.cca2;
        return map;
      }, {});

      // Convert cca3 to cca2
      const updatedFavorites = currentUser.favorites.map((code) => {
        const cca2 = countryMap[code];
        if (!cca2) {
          console.warn(`No cca2 found for cca3 code: ${code}`);
          return null;
        }
        return cca2;
      }).filter((code) => code !== null); // Remove invalid codes

      const updatedUser = { ...currentUser, favorites: updatedFavorites };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Migrated favorites from cca3 to cca2:', updatedFavorites);
      return updatedUser;
    } catch (error) {
      console.error('Error migrating favorites:', error);
      return currentUser; // Fallback to original user if migration fails
    }
  };

  // Load current user from localStorage on mount and migrate favorites
  useEffect(() => {
    const loadUser = async () => {
      setLoadingUser(true);
      const currentUser = getCurrentUser();
      if (currentUser) {
        const migratedUser = await migrateFavorites(currentUser);
        setUser(migratedUser);
      }
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  // Update user state when favorites change
  const handleAddFavorite = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) {
      console.warn('Invalid cca2 code:', countryCode);
      return;
    }
    const updatedUser = addFavoriteCountry(countryCode);
    setUser(updatedUser);
  };

  const handleRemoveFavorite = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) {
      console.warn('Invalid cca2 code:', countryCode);
      return;
    }
    const updatedUser = removeFavoriteCountry(countryCode);
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, handleAddFavorite, handleRemoveFavorite }}>
      {children}
    </UserContext.Provider>
  );
};