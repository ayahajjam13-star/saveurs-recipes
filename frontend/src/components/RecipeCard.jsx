
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { Clock, Star, Heart, ArrowUpRight } from 'lucide-react';

function RecipeCard({ recipe }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    await toggleFavorite(recipe.id);
  };

  const imageUrl = recipe.image?.startsWith('http')
    ? recipe.image
    : recipe.image
      ? `/images/${recipe.image}`
      : null;

  const preparationTime = (recipe.steps?.length || 0) * 5;

  return (
    <article className="group relative overflow-hidden rounded-[26px] bg-[#FFFEFC] border border-[#EEE7DF] shadow-[0_5px_20px_rgba(40,34,30,0.04)] hover:shadow-[0_15px_35px_rgba(40,34,30,0.10)] hover:-translate-y-1.5 transition-all duration-300">

      {/* Recipe Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5D8C8]">
        <Link
          to={`/recipe/${recipe.id}`}
          className="block w-full h-full"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={recipe.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-5xl">
              🍽️
            </div>
          )}
        </Link>

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorite}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFEFC]/95 backdrop-blur-md shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Heart
            size={19}
            strokeWidth={2}
            className={
              favorite
                ? 'fill-[#E88FA5] text-[#E88FA5]'
                : 'text-[#8B8179] hover:text-[#E88FA5]'
            }
          />
        </button>

        {/* Recipe Label */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-[#FFFEFC]/90 backdrop-blur-sm text-[#718B68] text-[10px] font-bold tracking-[1.5px] uppercase">
          Chef's choice
        </div>
      </div>

      {/* Recipe Information */}
      <div className="p-5 sm:p-6">

        <Link
          to={`/recipe/${recipe.id}`}
          className="block"
        >
          <h3 className="font-serif text-[21px] font-bold leading-snug text-[#28221E] group-hover:text-[#D77F96] transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
            {recipe.name}
          </h3>
        </Link>

        {/* Recipe Details */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F0EAE3]">

          <div className="flex items-center gap-1.5 text-[#8B8179] text-xs font-medium">
            <Clock size={15} className="text-[#718B68]" />
            <span>{preparationTime} min</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#B88A42] text-xs font-semibold">
            <Star size={15} fill="currentColor" />
            <span>4.8</span>
          </div>

          <Link
            to={`/recipe/${recipe.id}`}
            aria-label={`View ${recipe.name}`}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F5D8C8]/50 text-[#A96F69] group-hover:bg-[#E88FA5] group-hover:text-white transition-all duration-300"
          >
            <ArrowUpRight size={18} />
          </Link>

        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
