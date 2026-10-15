import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Favorites() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/favorites`)
        .then(res => { setFavorites(res.data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-cream dark:bg-dark-bg transition-colors">
        <EmptyState
          icon="🔒"
          title={t('favorites.signIn')}
          description={t('favorites.signInText')}
          actionLabel={t('nav.signIn')}
          actionLink="/login"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      
      <div className="mb-12">
        <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-3">
          {t('favorites.collection')}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-warm-brown dark:text-dark-text mb-4">
          ❤️ {t('favorites.title')}
        </h1>
        <p className="text-warm-brown/60 dark:text-dark-text/60 text-lg">
          {favorites.length} {favorites.length === 1 ? t('favorites.recipe') : t('favorites.recipes')} {t('favorites.saved')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-warm-brown/60 dark:text-dark-text/60">{t('favorites.loading')}</p>
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon="🤍"
          title={t('favorites.noFavorites')}
          description={t('favorites.noFavoritesText')}
          actionLabel={t('favorites.browseRecipes')}
          actionLink="/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;