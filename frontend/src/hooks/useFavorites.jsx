import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://127.0.0.1:8000/api';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      axios.get(`${API_URL}/favorites`)
        .then(res => setFavorites(res.data.map(r => r.id)))
        .catch(err => console.error(err));
    } else {
      setFavorites([]);
    }
  }, [user, token]);

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const toggleFavorite = async (recipeId) => {
    if (!user) return false;

    setLoading(true);
    try {
      if (isFavorite(recipeId)) {
        await axios.delete(`${API_URL}/favorites/${recipeId}`);
        setFavorites(prev => prev.filter(id => id !== recipeId));
        toast.success('Removed from favorites');
      } else {
        await axios.post(`${API_URL}/favorites`, { recipe_id: recipeId });
        setFavorites(prev => [...prev, recipeId]);
        toast.success('Added to favorites! ❤️');
      }
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}