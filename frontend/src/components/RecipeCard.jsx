import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';

function RecipeCard({ recipe }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) { navigate('/login'); return; }
    await toggleFavorite(recipe.id);
  };

  return (
    <div className="group relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-warm-brown/5 dark:border-dark-text/5 flex flex-col h-full animate-fade-in">
      
      <Link to={`/recipe/${recipe.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream dark:bg-dark-bg">
          <img
            src={`/images/${recipe.image}`}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <span className="text-xs font-semibold text-warm-brown dark:text-dark-text tracking-wide">
              {recipe.season === 'Autumn' && '🍂 '}
              {recipe.season === 'Winter' && '❄️ '}
              {recipe.season === 'Spring' && '🌸 '}
              {recipe.season === 'Summer' && '☀️ '}
              {t(`seasons.${recipe.season}`)}
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform flex items-center justify-center text-lg z-10"
      >
        {favorite ? '❤️' : '🤍'}
      </button>

      <Link to={`/recipe/${recipe.id}`} className="block flex-1 flex flex-col">
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2 text-xs">
            <span className="flex items-center gap-1 text-fresh-green dark:text-green-400 font-medium">
              🌍 {recipe.country}
            </span>
            <span className="w-1 h-1 rounded-full bg-warm-brown/30 dark:bg-dark-text/30"></span>
            <span className="flex items-center gap-1 text-warm-brown/70 dark:text-dark-text/70">
              🍴 {recipe.cuisine}
            </span>
          </div>

          <h3 className="font-serif text-xl font-bold text-warm-brown dark:text-dark-text group-hover:text-orange-accent transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
            {recipe.name}
          </h3>

          <div className="mt-auto pt-4 border-t border-warm-brown/10 dark:border-dark-text/10 flex items-center justify-between">
            <span className="text-xs text-warm-brown/60 dark:text-dark-text/60">
              {recipe.ingredients.length} {t('recipe.ingredients').toLowerCase()}
            </span>
            <span className="text-orange-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
              View →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default RecipeCard;