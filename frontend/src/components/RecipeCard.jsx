
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
    <article className="group relative overflow-hidden rounded-[30px] bg-white dark:bg-[#28221E] border border-[#E8F1EF] dark:border-white/10 shadow-[0_8px_28px_rgba(50,100,100,0.07)] hover:shadow-[0_18px_40px_rgba(80,170,175,0.17)] hover:-translate-y-2 transition-all duration-500">

      {/* Large Food Photography */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E5F5F1]">

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
            <div className="flex items-center justify-center w-full h-full text-7xl bg-gradient-to-br from-[#B8E8EE] via-[#F2C7DB] to-[#BFE8C8]">
              🍓
            </div>
          )}
        </Link>

        {/* Image Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10 pointer-events-none" />

        {/* Favorite */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorite}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/95 shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Heart
            size={20}
            strokeWidth={2}
            className={
              favorite
                ? 'fill-[#E88FAF] text-[#E88FAF]'
                : 'text-[#8C8997] hover:text-[#E88FAF]'
            }
          />
        </button>

        {/* Chef Label */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#BFE8C8]/95 text-[#386B50] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
          <Star size={12} fill="currentColor" />
          Chef's choice
        </div>

        {/* Recipe Name on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 pointer-events-none">
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-[2px] mb-2">
            Discover the taste
          </p>

          <h3 className="font-bold text-[22px] sm:text-[24px] leading-tight text-white line-clamp-2 drop-shadow-md">
            {recipe.name}
          </h3>

          <div className="mt-3 flex items-center gap-2 text-white/90 text-xs font-medium">
            <Clock size={14} />
            <span>{preparationTime} min preparation</span>
          </div>
        </div>
      </div>

      {/* Card Bottom */}
      <div className="px-5 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F2C7DB]/35 text-[#C77F9D]">
            <Star size={16} fill="currentColor" />
          </span>

          <div>
            <p className="text-sm font-bold text-[#465B5D] dark:text-white">
              4.8
            </p>
            <p className="text-[10px] text-[#9BA9A7]">
              Food lovers
            </p>
          </div>
        </div>

        <Link
          to={`/recipe/${recipe.id}`}
          aria-label={`View ${recipe.name}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B8E8EE]/45 text-[#398C98] hover:bg-[#7ADDF2] hover:text-[#285E68] transition-all duration-300 text-xs font-bold"
        >
          View recipe
          <ArrowUpRight size={16} />
        </Link>

      </div>
    </article>
  );
}

export default RecipeCard;
