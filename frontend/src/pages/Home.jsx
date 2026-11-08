import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBySeason, getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Clock, Users, ChefHat, Utensils, Coffee, Moon, CakeSlice, Salad, Zap, 
  Leaf, Snowflake, Flower, Sun 
} from 'lucide-react';

function Home() {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [season, setSeason] = useState('Autumn');
  const [loading, setLoading] = useState(true);
  const [recipeOfDay, setRecipeOfDay] = useState(null);

  const categories = [
    { name: 'All Recipes', icon: <Utensils size={16} />, keyword: '' },
    { name: 'Breakfast', icon: <Coffee size={16} />, keyword: 'pancake' },
    { name: 'Lunch', icon: <Utensils size={16} />, keyword: 'salad, sandwich' },
    { name: 'Dinner', icon: <Moon size={16} />, keyword: 'chicken, beef' },
    { name: 'Desserts', icon: <CakeSlice size={16} />, keyword: 'cake, pie, sweet' },
    { name: 'Healthy', icon: <Salad size={16} />, keyword: 'salad, vegetable' },
    { name: 'Vegan', icon: <Salad size={16} />, keyword: 'vegetable, tofu' },
    { name: 'Quick & Easy', icon: <Zap size={16} />, keyword: 'quick' },
  ];

  const seasons = [
    { name: 'Autumn', icon: <Leaf size={16} /> },
    { name: 'Winter', icon: <Snowflake size={16} /> },
    { name: 'Spring', icon: <Flower size={16} /> },
    { name: 'Summer', icon: <Sun size={16} /> },
  ];

  useEffect(() => {
    setLoading(true);
    getBySeason(season)
      .then(res => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [season]);

  useEffect(() => {
    getRecipes().then(res => {
      const day = new Date().getDate();
      if (res.data.length > 0) {
        setRecipeOfDay(res.data[day % res.data.length]);
      }
    }).catch(err => console.error(err));
  }, []);

  // 🔥 هاد السطر كيتحقق واش صورة Recipe of the Day رابط خارجي ولا محلية
  const recipeOfDayImage = recipeOfDay?.image?.startsWith('http') 
    ? recipeOfDay.image 
    : `/images/${recipeOfDay?.image}`;

  return (
    <div className="bg-[#FAF7F0] dark:bg-dark-bg transition-colors min-h-screen pb-20">
      <SEO title="Saveurs | Recipes by Season" url="/" />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2000&auto=format&fit=crop"
            alt="Food background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0]/95 via-[#FAF7F0]/70 to-transparent dark:from-dark-bg/95 dark:via-dark-bg/70"></div>
        </div>
        
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-12 w-full pb-24 flex flex-col md:flex-row justify-between items-center gap-12">
          
          <div className="w-full md:w-3/5">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-[2px] bg-guava-pink"></span>
              <span className="text-guava-pink text-xs font-bold tracking-[0.3em] uppercase">Cook • Eat • Be Happy</span>
            </div>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[7.5rem] font-bold text-warm-brown dark:text-white leading-[0.95] tracking-tighter mb-6">
              Delicious Recipes <br/>
              for <span className="italic font-light text-guava-pink">Every</span> Season
            </h1>
            <p className="text-lg text-warm-brown/70 dark:text-gray-300 mb-10 max-w-lg font-light leading-relaxed">
              Discover, cook and share amazing recipes from around the world with Saveurs Recipes.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a href="#recipes" className="px-8 py-4 bg-guava-pink text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-guava-soft transition-all shadow-lg shadow-guava-pink/30">
                Explore Recipes →
              </a>
            </div>
          </div>

          {recipeOfDay && (
            <div className="w-full md:w-2/5 max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <ChefHat size={24} className="text-guava-green" />
                <h2 className="font-serif text-xl font-bold text-warm-brown dark:text-white">Recipe of the Day</h2>
              </div>
              <div className="rounded-2xl overflow-hidden mb-4">
                <img src={recipeOfDayImage} alt={recipeOfDay.name} className="w-full h-48 object-cover" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-warm-brown dark:text-white mb-2">{recipeOfDay.name}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Clock size={14}/> 35 min</span>
                <span className="flex items-center gap-1"><Users size={14}/> 6 servings</span>
              </div>
              <Link to={`/recipe/${recipeOfDay.id}`} className="text-guava-pink font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                View Recipe →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES BAR */}
      <section className="relative z-20 max-w-[1400px] mx-auto px-4 mt-0 pb-16">
        <div className="bg-white dark:bg-dark-card rounded-full p-2 flex flex-wrap justify-center gap-2 shadow-xl border border-gray-100 dark:border-gray-800">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to={cat.keyword ? `/search?q=${encodeURIComponent(cat.keyword)}` : '/search'}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${i === 0 ? 'bg-guava-green text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-guava-peach dark:hover:bg-gray-700'}`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* SEASON TABS */}
      <section className="relative z-20 max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {seasons.map(s => (
            <button
              key={s.name}
              onClick={() => setSeason(s.name)}
              className={`px-8 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                season === s.name
                  ? 'bg-guava-green text-white shadow-md'
                  : 'bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400 hover:bg-guava-peach dark:hover:bg-gray-700'
              }`}
            >
              {s.icon}
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* RECIPES GRID */}
      <section id="recipes" className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-warm-brown dark:text-white mb-2">
              Our Featured <span className="italic text-guava-pink">Recipes</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Handpicked with love for you!</p>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-medium tracking-widest uppercase mt-4 md:mt-0">
            {recipes.length} Recipes
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      {/* AI CHEF SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
        <div className="bg-guava-green rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
          <div className="relative z-10 w-full md:w-2/3">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              Meet <span className="text-guava-peach">AI Chef</span> ✨
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
              Your personal cooking assistant! Ask for recipes, get cooking tips, and discover new ideas based on the ingredients you have at home.
            </p>
            <Link to="/ai-chef" className="inline-block px-8 py-4 bg-white text-guava-green rounded-full text-sm font-bold tracking-widest uppercase hover:bg-guava-pink hover:text-white transition-all shadow-lg">
              Try AI Chef →
            </Link>
          </div>
          <div className="w-full md:w-1/3 mt-10 md:mt-0 flex justify-center relative z-10">
             <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="AI Chef Robot" className="w-56 h-56 object-contain drop-shadow-2xl animate-[float_3s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;