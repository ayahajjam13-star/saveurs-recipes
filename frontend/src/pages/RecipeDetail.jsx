
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import RatingForm from '../components/RatingForm';
import RatingList from '../components/RatingList';
import RecipeScaling from '../components/RecipeScaling';
import CookingMode from '../components/CookingMode';
import SEO from '../components/SEO';
import CommentsSection from '../components/CommentsSection';
import {
  Heart,
  Play,
  ArrowLeft,
  BookOpen,
  Utensils,
  ChefHat,
  Star,
  MessageSquare,
  Clock,
  Users,
  Sparkles,
  Leaf,
  ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({
    ratings: [],
    average: 0,
    count: 0
  });
  const [cookingMode, setCookingMode] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);

    getRecipe(id)
      .then(res => {
        if (active) setRecipe(res.data);
      })
      .catch(err => {
        console.error('Recipe error:', err);
        if (active) setRecipe(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;

    axios.get(`${API_URL}/ratings/${id}`)
      .then(res => {
        if (active) setRatings(res.data);
      })
      .catch(err => console.error('Ratings error:', err));

    return () => {
      active = false;
    };
  }, [id]);

  const favorite = recipe ? isFavorite(recipe.id) : false;

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await toggleFavorite(recipe.id);
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  const handleRatingChange = async () => {
    try {
      const res = await axios.get(`${API_URL}/ratings/${id}`);
      setRatings(res.data);
    } catch (error) {
      console.error('Rating refresh error:', error);
    }
  };

  const imageUrl = recipe?.image?.startsWith('http')
    ? recipe.image
    : recipe?.image
      ? `/images/${recipe.image}`
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#1A1512] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E88FA5]/30 border-t-[#E88FA5] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#718B68] font-medium">
            Preparing your recipe...
          </p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#1A1512] flex flex-col items-center justify-center text-center px-6">
        <Utensils size={48} className="text-[#E88FA5] mb-5" />
        <h2 className="text-3xl font-bold text-[#1A1512] dark:text-white mb-3">
          Recipe not found
        </h2>
        <p className="text-[#718B68] mb-6">
          Sorry, we couldn't find this recipe.
        </p>
        <Link
          to="/"
          className="bg-[#E88FA5] text-white px-7 py-3 rounded-full font-bold hover:bg-[#718B68] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#1A1512] text-[#1A1512] dark:text-white font-serif pb-28">

      <SEO title={recipe.name} url={`/recipe/${recipe.id}`} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 dark:bg-[#1A1512]/95 backdrop-blur-md border-b border-[#718B68]/15 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-sans font-bold text-[#718B68] hover:text-[#E88FA5] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <Link to="/" className="hidden sm:flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#E88FA5] flex items-center justify-center text-white">
              <BookOpen size={19} />
            </div>
            <span className="font-bold tracking-widest text-sm">
              SAVEURS
            </span>
          </Link>

          <button
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="w-11 h-11 rounded-full bg-[#E88FA5]/10 flex items-center justify-center text-[#E88FA5] hover:bg-[#E88FA5] hover:text-white transition-all"
          >
            <Heart size={21} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 md:py-20">

          <div>
            <div className="inline-flex items-center gap-2 bg-[#E88FA5]/10 text-[#E88FA5] px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest mb-7">
              <Sparkles size={14} />
              Recipe No. {recipe.id}
            </div>

            <p className="text-[#718B68] font-sans text-sm font-bold uppercase tracking-[0.25em] mb-4">
              {recipe.cuisine || 'Special recipe'}
            </p>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-7">
              {recipe.name}
            </h1>

            <p className="text-lg leading-relaxed text-[#1A1512]/65 dark:text-gray-300 mb-9">
              Discover the flavors of {recipe.country || 'this delicious dish'}.
              A special recipe carefully selected for your table.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-9">
              <div className="bg-white dark:bg-[#28221E] rounded-2xl p-4 text-center shadow-sm">
                <Clock size={22} className="text-[#E88FA5] mx-auto mb-2" />
                <p className="text-xs text-[#718B68] font-sans mb-1">Prep time</p>
                <p className="font-bold text-sm">30 min</p>
              </div>

              <div className="bg-white dark:bg-[#28221E] rounded-2xl p-4 text-center shadow-sm">
                <Users size={22} className="text-[#E88FA5] mx-auto mb-2" />
                <p className="text-xs text-[#718B68] font-sans mb-1">Servings</p>
                <p className="font-bold text-sm">4 People</p>
              </div>

              <div className="bg-white dark:bg-[#28221E] rounded-2xl p-4 text-center shadow-sm">
                <Star size={22} className="text-[#E88FA5] mx-auto mb-2" />
                <p className="text-xs text-[#718B68] font-sans mb-1">Rating</p>
                <p className="font-bold text-sm">
                  {ratings.average || '—'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCookingMode(true)}
              className="inline-flex items-center gap-3 bg-[#E88FA5] hover:bg-[#718B68] text-white px-8 py-4 rounded-full font-sans font-bold transition-all shadow-lg shadow-[#E88FA5]/20 hover:-translate-y-1"
            >
              <Play size={19} fill="currentColor" />
              Start Cooking
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative">
            <div className="absolute -top-5 -right-5 w-28 h-28 bg-[#F5D8C8] rounded-full blur-2xl opacity-70" />
            <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-[#718B68]/20 rounded-full blur-2xl" />

            <div className="relative bg-white dark:bg-[#28221E] p-3 rounded-[2rem] shadow-xl border border-[#718B68]/10">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={recipe.name}
                  className="w-full h-[350px] md:h-[520px] object-cover rounded-[1.5rem]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-[350px] md:h-[520px] flex items-center justify-center rounded-[1.5rem] bg-[#F5D8C8]/30">
                  <Utensils size={60} className="text-[#E88FA5]" />
                </div>
              )}
            </div>

            <div className="absolute -bottom-5 right-5 md:right-10 bg-white dark:bg-[#28221E] rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
              <Leaf size={23} className="text-[#718B68]" />
              <span className="font-sans font-bold text-sm">
                Made with love
              </span>
            </div>
          </div>
        </section>

        {/* Ingredients and Method */}
        <section className="border-t border-[#718B68]/20 pt-14 grid lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-[#E88FA5]/10 flex items-center justify-center text-[#E88FA5]">
                <Utensils size={20} />
              </div>
              <h2 className="text-2xl font-bold">Ingredients</h2>
            </div>

            <div className="bg-white dark:bg-[#28221E] p-6 md:p-8 rounded-3xl shadow-sm border border-[#718B68]/10 lg:sticky lg:top-28">
              <RecipeScaling
                ingredients={recipe.ingredients || []}
                baseServings={4}
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#E88FA5]/10 flex items-center justify-center text-[#E88FA5]">
                <ChefHat size={20} />
              </div>
              <h2 className="text-2xl font-bold">Cooking Method</h2>
            </div>

            <div className="space-y-6">
              {(recipe.steps || []).map((step, index) => (
                <div
                  key={index}
                  className="flex gap-5 md:gap-7 bg-white dark:bg-[#28221E] p-6 rounded-2xl border border-[#718B68]/10 hover:shadow-md transition-shadow"
                >
                  <span className="shrink-0 w-12 h-12 rounded-full bg-[#E88FA5]/10 text-[#E88FA5] flex items-center justify-center text-lg font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="text-lg leading-relaxed text-[#1A1512]/80 dark:text-gray-300 pt-2">
                    {step}
                  </p>
                </div>
              ))}

              {(!recipe.steps || recipe.steps.length === 0) && (
                <p className="text-[#718B68]">
                  No cooking steps available.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Reviews and Comments */}
        <section className="mt-24 pt-14 border-t border-[#718B68]/20">
          <div className="text-center mb-12">
            <p className="text-[#E88FA5] text-xs font-sans font-bold uppercase tracking-[0.3em] mb-3">
              Your opinion matters
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Reviews & Comments
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            <div className="bg-white dark:bg-[#28221E] rounded-3xl p-6 md:p-8 border border-[#718B68]/10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <Star size={25} className="text-[#E88FA5]" />
                <h3 className="font-sans text-xl font-bold">
                  Rate this Recipe
                </h3>
              </div>

              <div className="font-sans">
                <RatingForm
                  recipeId={parseInt(id, 10)}
                  onRatingChange={handleRatingChange}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-[#718B68]/15">
                <RatingList ratings={ratings.ratings || []} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#28221E] rounded-3xl p-6 md:p-8 border border-[#718B68]/10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare size={25} className="text-[#E88FA5]" />
                <h3 className="font-sans text-xl font-bold">
                  Comments
                </h3>
              </div>

              <div className="font-sans">
                <CommentsSection recipeId={parseInt(id, 10)} />
              </div>
            </div>

          </div>
        </section>

        {/* Closing message */}
        <div className="mt-20 text-center bg-[#F5D8C8]/30 dark:bg-[#28221E] rounded-3xl p-10">
          <div className="w-12 h-12 bg-[#E88FA5]/15 text-[#E88FA5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={23} />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Good food brings people together
          </h3>
          <p className="text-[#718B68]">
            Cook, enjoy, and share your favorite moments with Saveurs.
          </p>
        </div>

      </main>

      {cookingMode && (
        <CookingMode
          recipe={recipe}
          onClose={() => setCookingMode(false)}
        />
      )}
    </div>
  );
}

export default RecipeDetail;
