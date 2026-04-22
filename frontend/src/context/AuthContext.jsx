import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || null
  );
  const [favorites, setFavorites] = useState(userInfo?.favorites || []);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, favorites }));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo, favorites]);

  const login = (data) => {
    setUserInfo(data);
    setFavorites(data.favorites || []);
  };

  const logout = () => {
    setUserInfo(null);
    setFavorites([]);
  };

  const toggleFavorite = async (propertyId) => {
    if (!userInfo) {
       console.error('[Frontend] Auth Error: No userInfo found in context');
       return;
    }

    // Optimistic Update: Reflect in UI immediately
    const isCurrentlyFav = favorites.includes(propertyId);
    let newFavorites;
    if (isCurrentlyFav) {
      newFavorites = favorites.filter(id => id !== propertyId);
    } else {
      newFavorites = [...favorites, propertyId];
    }
    
    setFavorites(newFavorites);

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/favorites/${propertyId}`, {}, config);
      
      if (data.success) {
        setFavorites(data.favorites); // Sync with actual server response
      }
    } catch (error) {
      setFavorites(favorites); // Revert on failure
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, favorites, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
