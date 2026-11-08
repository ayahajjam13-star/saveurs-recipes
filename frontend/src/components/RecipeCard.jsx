import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { Clock, Star, Heart } from 'lucide-react';

function RecipeCard({ recipe }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/login');
    await toggleFavorite(recipe.id);
  };

  // 🔥 هاد السطر كيتحقق واش الصورة رابط خارجي ولا محلية
  const imageUrl = recipe.image?.startsWith('http') 
    ? recipe.image 
    : `/images/${recipe.image}`;

  return (
    <div className="group bg-white dark:bg-dark-card rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/recipe/${recipe.id}`}>
          <img
            src={imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>
        
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10 shadow-sm"
        >
          <Heart size={16} className={favorite ? "fill-guava-pink text-guava-pink" : "text-gray-400"} />
        </button>
      </div>

      <div className="p-5">
        <Link to={`/recipe/${recipe.id}`}>
          <h3 className="font-serif text-xl font-bold text-warm-brown dark:text-white mb-3 group-hover:text-guava-pink transition-colors">
            {recipe.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Clock size={14}/> {recipe.steps.length * 5} min</span>
          <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> 4.8</span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;