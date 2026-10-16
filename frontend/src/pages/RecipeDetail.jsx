import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import RatingForm from '../components/RatingForm';
import RatingList from '../components/RatingList';
import RatingStars from '../components/RatingStars';
import ShareButtons from '../components/ShareButtons';
import RecipeScaling from '../components/RecipeScaling';
import CookingMode from '../components/CookingMode';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function RecipeDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({ ratings: [], average: 0, count: 0 });
  const [cookingMode, setCookingMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRecipe(id)
      .then(res => { setRecipe(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/ratings/${id}`)
        .then(res => setRatings(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const refreshRatings = () => {
    axios.get(`${API_URL}/ratings/${id}`)
      .then(res => setRatings(res.data))
      .catch(err => console.error(err));
  };

  const favorite = recipe ? isFavorite(recipe.id) : false;

  const handleFavoriteClick = async () => {
    if (!user) { navigate('/login'); return; }
    await toggleFavorite(recipe.id);
  };

  if (loading) {
    return (
      <div className="text-center py-32 bg-cream dark:bg-dark-bg min-h-screen transition-colors">
        <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-warm-brown/60 dark:text-dark-text/60">{t('common.loading')}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-32 bg-cream dark:bg-dark-bg min-h-screen transition-colors">
        <p className="text-6xl mb-4">🍽️</p>
        <h2 className="font-serif text-3xl text-warm-brown dark:text-dark-text mb-4">Recipe not found</h2>
        <Link to="/" className="text-orange-accent hover:underline">← {t('recipe.backToRecipes')}</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      
      <SEO 
        title={recipe.name}
        description={`${recipe.cuisine} recipe from ${recipe.country}. ${recipe.ingredients.length} ingredients, ${recipe.steps.length} steps.`}
        image={recipe.image ? `https://saveurs-recipes.vercel.app/images/${recipe.image}` : null}
        url={`/recipe/${recipe.id}`}
        type="article"
      />
      
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[450px] overflow-hidden bg-warm-brown dark:bg-dark-bg">
        <img
          src={`/images/${recipe.image}`}
          alt={recipe.name}
          className="w-full h-full object-cover opacity-70"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-brown via-warm-brown/50 to-transparent dark:from-dark-bg dark:via-dark-bg/70 dark:to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/80 hover:text-cream mb-6 transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full no-print">
            ← {t('recipe.backToRecipes')}
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
            <span className="bg-white/20 backdrop-blur-sm text-cream px-4 py-2 rounded-full font-medium">
              {recipe.season === 'Autumn' && '🍂 '}
              {recipe.season === 'Winter' && '❄️ '}
              {recipe.season === 'Spring' && '🌸 '}
              {recipe.season === 'Summer' && '☀️ '}
              {t(`seasons.${recipe.season}`)}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-cream px-4 py-2 rounded-full font-medium">🌍 {recipe.country}</span>
            <span className="bg-white/20 backdrop-blur-sm text-cream px-4 py-2 rounded-full font-medium">🍴 {recipe.cuisine}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6">
            {recipe.name}
          </h1>

          {ratings.count > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <RatingStars rating={Math.round(ratings.average)} size="md" />
              <span className="text-cream/80 text-sm">
                {ratings.average} ({ratings.count} {ratings.count !== 1 ? t('recipe.reviewsCount') : t('recipe.reviewCount')})
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-center no-print">
            <button
              onClick={handleFavoriteClick}
              className={`px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                favorite 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white text-warm-brown hover:bg-cream'
              }`}
            >
              {favorite ? `❤️ ${t('recipe.saved')}` : `🤍 ${t('recipe.save')}`}
            </button>
            
            <button
              onClick={() => setCookingMode(true)}
              className="px-6 py-3 bg-fresh-green text-white rounded-2xl font-medium hover:bg-fresh-green/90 transition-all flex items-center gap-2 shadow-lg shadow-fresh-green/30"
            >
              👨‍🍳 Start Cooking
            </button>
            
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-cream rounded-2xl font-medium hover:bg-white/20 transition-all flex items-center gap-2"
            >
              🖨️ {t('recipe.print')}
            </button>
            
            <ShareButtons recipe={recipe} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="recipe-content" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 -mt-24 relative z-10">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-3xl mb-2">🧂</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 mb-1">{t('recipe.ingredients')}</p>
            <p className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text">{recipe.ingredients.length}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-3xl mb-2">👨‍🍳</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 mb-1">{t('recipe.steps')}</p>
            <p className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text">{recipe.steps.length}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-3xl mb-2">🌍</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 mb-1">{t('recipe.country')}</p>
            <p className="font-serif text-lg font-bold text-warm-brown dark:text-dark-text">{recipe.country}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-3xl mb-2">⭐</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 mb-1">{t('recipe.rating')}</p>
            <p className="font-serif text-lg font-bold text-warm-brown dark:text-dark-text">
              {ratings.average || '—'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 md:sticky md:top-24 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-accent/10 rounded-2xl flex items-center justify-center text-2xl">🧂</div>
                <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text">{t('recipe.ingredients')}</h2>
              </div>
              
              <RecipeScaling ingredients={recipe.ingredients} baseServings={4} />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-accent/10 rounded-2xl flex items-center justify-center text-2xl">👨‍🍳</div>
              <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text">{t('recipe.instructions')}</h2>
            </div>
            
            <div className="space-y-8">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-orange-accent text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-accent/20 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-warm-brown/80 dark:text-dark-text/80 leading-relaxed text-lg">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ratings */}
            <div className="mt-16 pt-16 border-t border-warm-brown/10 dark:border-dark-text/10 no-print">
              <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-8">
                ⭐ {t('recipe.reviews')}
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  {ratings.count > 0 ? (
                    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-warm-brown/5 dark:border-dark-text/5 transition-colors">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-5xl font-serif font-bold text-orange-accent">
                          {ratings.average}
                        </div>
                        <div>
                          <RatingStars rating={Math.round(ratings.average)} size="md" />
                          <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 mt-1">
                            {t('recipe.basedOn')} {ratings.count} {ratings.count !== 1 ? t('recipe.reviewsCount') : t('recipe.reviewCount')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
                      <p className="text-4xl mb-2">⭐</p>
                      <p className="text-warm-brown/60 dark:text-dark-text/60">
                        {t('recipe.noRatings')}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <RatingForm recipeId={parseInt(id)} onRatingChange={refreshRatings} />
                </div>
              </div>

              <RatingList ratings={ratings.ratings} />
            </div>

            <div className="mt-16 pt-8 border-t border-warm-brown/10 dark:border-dark-text/10 no-print">
              <Link to="/" className="inline-flex items-center gap-2 text-orange-accent font-medium hover:gap-3 transition-all">
                ← {t('recipe.exploreMore')}
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Cooking Mode */}
      {cookingMode && (
        <CookingMode recipe={recipe} onClose={() => setCookingMode(false)} />
      )}
    </div>
  );
}

export default RecipeDetail;