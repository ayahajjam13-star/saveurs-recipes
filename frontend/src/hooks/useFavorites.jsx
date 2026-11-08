
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, token } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [pendingIds, setPendingIds] = useState([]);

  // Load favorites from Laravel API
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchFavorites = async () => {
      if (!user || !token) {
        setFavorites([]);
        setFetching(false);
        return;
      }

      setFetching(true);

      try {
        const response = await axios.get(
          `${API_URL}/favorites`,
          { signal: controller.signal }
        );

        if (active) {
          const data = Array.isArray(response.data)
            ? response.data
            : [];

          setFavorites(data.map((recipe) => recipe.id));
        }
      } catch (error) {
        if (active && !axios.isCancel(error)) {
          console.error('Error loading favorites:', error);
          setFavorites([]);
        }
      } finally {
        if (active) {
          setFetching(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      active = false;
      controller.abort();
    };
  }, [user?.id, token]);

  // Check if a recipe is already a favorite
  const isFavorite = (recipeId) => {
    return favorites.some(
      (id) => String(id) === String(recipeId)
    );
  };

  // Add or remove a favorite
  const toggleFavorite = async (recipeId) => {
    if (!user || !token) {
      toast.error('Please login to manage your favorites.');
      return false;
    }

    if (pendingIds.some((id) => String(id) === String(recipeId))) {
      return false;
    }

    setPendingIds((previous) => [...previous, recipeId]);

    const alreadyFavorite = isFavorite(recipeId);

    try {
      if (alreadyFavorite) {
        await axios.delete(
          `${API_URL}/favorites/${recipeId}`
        );

        setFavorites((previous) =>
          previous.filter(
            (id) => String(id) !== String(recipeId)
          )
        );

        toast.success('Removed from favorites');
      } else {
        await axios.post(`${API_URL}/favorites`, {
          recipe_id: recipeId,
        });

        setFavorites((previous) => {
          const exists = previous.some(
            (id) => String(id) === String(recipeId)
          );

          return exists ? previous : [...previous, recipeId];
        });

        toast.success('Added to favorites! ❤️');
      }

      return true;

    } catch (error) {
      console.error('Favorite operation failed:', error);

      toast.error(
        error.response?.data?.message ||
        'Something went wrong. Please try again.'
      );

      return false;

    } finally {
      setPendingIds((previous) =>
        previous.filter(
          (id) => String(id) !== String(recipeId)
        )
      );
    }
  };

  // General loading state
  const loading = fetching || pendingIds.length > 0;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom Hook
export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavorites must be used inside FavoritesProvider'
    );
  }

  return context;
}
