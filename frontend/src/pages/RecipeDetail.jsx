import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import RatingForm from '../components/RatingForm';
import RatingList from '../components/RatingList';
import RatingStars from '../components/RatingStars';
import RecipeScaling from '../components/RecipeScaling';
import CookingMode from '../components/CookingMode';
import SEO from '../components/SEO';
import CommentsSection from '../components/CommentsSection';
import { Heart, Play, ArrowLeft, BookOpen, Utensils, ChefHat, Star, MessageSquare } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function RecipeDetail() {
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

  const favorite = recipe ? isFavorite(recipe.id) : false;
  const handleFavoriteClick = async () => {
    if (!user) { navigate('/login'); return; }
    await toggleFavorite(recipe.id);
  };

  if (loading) return <div className="bg-[#FAF7F0] dark:bg-dark-bg min-h-screen"></div>;
  if (!recipe) return <div className="text-center py-32 text-warm-brown dark:text-white">Recipe not found</div>;

  // 🔥 هاد السطر كيتحقق واش الصورة رابط خارجي ولا محلية
  const imageUrl = recipe.image?.startsWith('http') 
    ? recipe.image 
    : `/images/${recipe.image}`;

  return (
    <div className="bg-[#FAF7F0] dark:bg-dark-bg min-h-screen text-warm-brown dark:text-white font-serif pb-20">
      <SEO title={recipe.name} url={`/recipe/${recipe.id}`} />

      {/* شريط علوي */}
      <div className="border-b border-warm-brown/10 dark:border-gray-800 py-4 px-6 flex justify-between items-center bg-[#FAF7F0] dark:bg-dark-bg sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-warm-brown/60 dark:text-gray-400 hover:text-warm-brown dark:hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex items-center gap-2 text-warm-brown/40 dark:text-gray-500">
           <BookOpen size={20} />
           <span className="font-sans text-xs font-bold tracking-widest uppercase">Saveurs Cookbook</span>
        </div>
        <button onClick={handleFavoriteClick} className="text-warm-brown/60 dark:text-gray-400 hover:text-guava-pink transition-colors">
          <Heart size={20} fill={favorite ? "#F16D7A" : "none"} className={favorite ? "text-guava-pink" : ""} />
        </button>
      </div>

      {/* المحتوى */}
      <div className="max-w-6xl mx-auto px-6 py-16 pb-32">
        
        {/* العنوان والصورة */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="w-full md:w-1/2">
            <p className="font-sans text-xs font-bold tracking-[0.3em] uppercase text-guava-pink mb-4">Recipe No. {recipe.id}</p>
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tighter mb-8">{recipe.name}</h1>
            <p className="font-sans text-lg text-warm-brown/60 dark:text-gray-400 font-light leading-relaxed mb-8">
              A classic {recipe.cuisine} dish from {recipe.country}. Carefully crafted for the {recipe.season} season.
            </p>
            <div className="flex gap-8 font-sans">
              <div>
                <p className="text-xs text-warm-brown/40 dark:text-gray-500 uppercase tracking-widest mb-1">Prep</p>
                <p className="font-bold">30 min</p>
              </div>
              <div>
                <p className="text-xs text-warm-brown/40 dark:text-gray-500 uppercase tracking-widest mb-1">Serves</p>
                <p className="font-bold">4 People</p>
              </div>
              <div>
                <p className="text-xs text-warm-brown/40 dark:text-gray-500 uppercase tracking-widest mb-1">Rating</p>
                <p className="font-bold text-guava-pink">{ratings.average || '—'}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-white dark:bg-dark-card p-4 rounded-3xl shadow-xl border border-transparent dark:border-gray-800">
              <img
                src={imageUrl}
                alt={recipe.name}
                className="w-full h-[450px] object-cover rounded-2xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>

        {/* المكونات والخطوات */}
        <div className="grid md:grid-cols-12 gap-12 border-t-2 border-warm-brown/10 dark:border-gray-800 pt-12">
          
          <div className="md:col-span-4">
            <h2 className="font-sans text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Utensils size={18} className="text-guava-pink" /> Ingredients
            </h2>
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-warm-brown/5 dark:border-gray-700 font-sans h-fit sticky top-24 text-warm-brown dark:text-white">
               <RecipeScaling ingredients={recipe.ingredients} baseServings={4} />
            </div>
          </div>

          <div className="md:col-span-8">
            <h2 className="font-sans text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-2">
              <ChefHat size={18} className="text-guava-pink" /> Method
            </h2>
            <div className="space-y-12">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-8">
                  <span className="text-4xl font-bold text-guava-pink/30 font-serif italic">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-2xl font-light text-warm-brown/80 dark:text-gray-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* التقييمات والتعليقات */}
        <div className="mt-32 pt-16 border-t-2 border-warm-brown/10 dark:border-gray-800">
          <h2 className="text-4xl font-bold mb-12 text-center">Reviews & Comments</h2>
          
          <div className="grid md:grid-cols-2 gap-16">
             <div className="bg-white dark:bg-dark-card rounded-3xl p-8 border border-warm-brown/5 dark:border-gray-700 shadow-sm text-warm-brown dark:text-white">
                <div className="flex items-center gap-3 mb-8">
                   <Star size={24} className="text-guava-pink" />
                   <h3 className="font-sans text-xl font-bold uppercase tracking-widest">Rate this Recipe</h3>
                </div>
                <div className="font-sans">
                   <RatingForm recipeId={parseInt(id)} onRatingChange={() => window.location.reload()} />
                </div>
                <div className="mt-8">
                   <RatingList ratings={ratings.ratings} />
                </div>
             </div>

             <div className="bg-white dark:bg-dark-card rounded-3xl p-8 border border-warm-brown/5 dark:border-gray-700 shadow-sm text-warm-brown dark:text-white">
                <div className="flex items-center gap-3 mb-8">
                   <MessageSquare size={24} className="text-guava-pink" />
                   <h3 className="font-sans text-xl font-bold uppercase tracking-widest">Comments</h3>
                </div>
                <div className="font-sans">
                   <CommentsSection recipeId={parseInt(id)} />
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* زر الطبخ العائم */}
      <div className="fixed bottom-4 right-24 z-50">
        <button
          onClick={() => setCookingMode(true)}
          className="bg-warm-brown dark:bg-white text-[#FAF7F0] dark:text-warm-brown px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-sm hover:bg-guava-pink dark:hover:bg-guava-pink hover:text-white transition-all shadow-2xl flex items-center gap-3"
        >
          <Play size={18} fill="currentColor" /> Start Cooking
        </button>
      </div>

      {cookingMode && (
        <CookingMode recipe={recipe} onClose={() => setCookingMode(false)} />
      )}
    </div>
  );
}

export default RecipeDetail;