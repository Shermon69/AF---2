import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, addFavoriteCountry, removeFavoriteCountry } from '../components/Auth';

// Create UserContext
export const UserContext = createContext();

// UserContext Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load current user from localStorage on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoadingUser(false);
  }, []);

  // Update user state when favorites change
  const handleAddFavorite = (countryCode) => {
    const updatedUser = addFavoriteCountry(countryCode);
    setUser(updatedUser);
  };

  const handleRemoveFavorite = (countryCode) => {
    const updatedUser = removeFavoriteCountry(countryCode);
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, handleAddFavorite, handleRemoveFavorite }}>
      {children}
    </UserContext.Provider>
  );
};