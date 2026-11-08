
import { useState, useEffect } from 'react';
import { getBySeason, getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

import {
  Clock,
  Users,
  Utensils,
  Coffee,
  Moon,
  CakeSlice,
  Salad,
  Zap,
  Leaf,
  Snowflake,
  Flower,
  Sun,
  ArrowRight,
  Sparkles
} from 'lucide-react';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [season, setSeason] = useState('Autumn');
  const [loading, setLoading] = useState(true);
  const [recipeOfDay, setRecipeOfDay] = useState(null);

  // Recipe categories
  const categories = [
    { name: 'All Recipes', icon: <Utensils size={17} />, keyword: '' },
    { name: 'Breakfast', icon: <Coffee size={17} />, keyword: 'pancake' },
    { name: 'Lunch', icon: <Utensils size={17} />, keyword: 'salad, sandwich' },
    { name: 'Dinner', icon: <Moon size={17} />, keyword: 'chicken, beef' },
    { name: 'Desserts', icon: <CakeSlice size={17} />, keyword: 'cake, pie, sweet' },
    { name: 'Healthy', icon: <Salad size={17} />, keyword: 'salad, vegetable' },
    { name: 'Vegan', icon: <Leaf size={17} />, keyword: 'vegetable, tofu' },
    { name: 'Quick & Easy', icon: <Zap size={17} />, keyword: 'quick' }
  ];

  // Seasons
  const seasons = [
    { name: 'Autumn', icon: <Leaf size={18} /> },
    { name: 'Winter', icon: <Snowflake size={18} /> },
    { name: 'Spring', icon: <Flower size={18} /> },
    { name: 'Summer', icon: <Sun size={18} /> }
  ];

  // Fetch recipes by selected season
  useEffect(() => {
    let active = true;

    const fetchSeasonRecipes = async () => {
      setLoading(true);

      try {
        const response = await getBySeason(season);

        if (active) {
          setRecipes(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error('Error loading seasonal recipes:', error);

        if (active) {
          setRecipes([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSeasonRecipes();

    return () => {
      active = false;
    };
  }, [season]);

  // Fetch recipe of the day
  useEffect(() => {
    let active = true;

    const fetchRecipeOfDay = async () => {
      try {
        const response = await getRecipes();
        const allRecipes = Array.isArray(response.data) ? response.data : [];

        if (active && allRecipes.length > 0) {
          const day = new Date().getDate();
          setRecipeOfDay(allRecipes[day % allRecipes.length]);
        }
      } catch (error) {
        console.error('Error loading recipe of the day:', error);
      }
    };

    fetchRecipeOfDay();

    return () => {
      active = false;
    };
  }, []);

  // Get correct recipe image URL
  const recipeImage = (image) => {
    if (!image) return '';

    return image.startsWith('http')
      ? image
      : `/images/${image}`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF7F0] text-[#28221E] transition-colors duration-500 dark:bg-[#1A1512] dark:text-white">

      <SEO
        title="Saveurs | Recipes by Season"
        url="/"
      />

      {/* HERO SECTION */}
      <section className="relative flex min-h-[90vh] items-center pb-20 pt-24">

        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F0] via-[#F9EFE7] to-[#F3D9D2] dark:from-[#1A1512] dark:via-[#241C18] dark:to-[#33231F]" />

        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#E88FA5]/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#718B68]/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-16 px-6 lg:grid-cols-2 lg:px-16">

          {/* Hero Text */}
          <div className="animate-fade-in">

            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#E88FA5]/30 bg-white/70 px-5 py-2 dark:bg-white/5">

              <Sparkles size={15} className="text-[#E88FA5]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#718B68]">
                Cook • Eat • Be Happy
              </span>

            </div>

            <h1 className="mb-8 font-serif text-6xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-[6.5rem]">

              Discover the

              <span className="block font-light italic text-[#E88FA5]">
                Taste of
              </span>

              Every Season

            </h1>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-[#78665D] dark:text-gray-300">
              Explore delicious recipes from around the world.
              Find inspiration, discover new flavors and make
              every meal a beautiful experience.
            </p>

            <div className="flex flex-wrap items-center gap-4">

              <a
                href="#recipes"
                className="group flex items-center gap-3 rounded-full bg-[#718B68] px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#607A58] hover:shadow-xl"
              >
                Explore Recipes

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <Link
                to="/search"
                className="rounded-full border border-[#E88FA5]/50 px-8 py-4 font-semibold text-[#E88FA5] transition-all hover:bg-[#E88FA5] hover:text-white"
              >
                Find Inspiration
              </Link>

            </div>

            {/* Statistics */}
            <div className="mt-14 flex items-center gap-8">

              <div>
                <p className="font-serif text-3xl font-bold text-[#718B68]">
                  120+
                </p>

                <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                  Recipes
                </p>
              </div>

              <div className="h-12 w-px bg-[#E88FA5]/30" />

              <div>
                <p className="font-serif text-3xl font-bold text-[#E88FA5]">
                  20+
                </p>

                <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                  Countries
                </p>
              </div>

              <div className="h-12 w-px bg-[#E88FA5]/30" />

              <div>
                <p className="font-serif text-3xl font-bold text-[#718B68]">
                  4
                </p>

                <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                  Seasons
                </p>
              </div>

            </div>
          </div>

          {/* Hero Food Image */}
          <div className="relative flex items-center justify-center">

            <div className="absolute aspect-square w-[85%] rounded-full border border-[#E88FA5]/20" />

            <div className="absolute aspect-square w-[70%] rounded-full border border-[#718B68]/20" />

            <div className="relative aspect-square w-full max-w-[550px]">

              <img
                src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1100&q=85"
                alt="Delicious fresh pasta"
                loading="eager"
                className="h-full w-full rounded-full border-[10px] border-white/80 object-cover shadow-2xl dark:border-white/10"
              />

              <div className="absolute -top-5 left-8 animate-bounce text-5xl">
                🍅
              </div>

              <div className="absolute -right-5 top-12 animate-float text-5xl">
                🥑
              </div>

              <div className="absolute -left-8 bottom-10 animate-float text-5xl">
                🌿
              </div>

              <div className="absolute -bottom-4 right-16 animate-bounce text-5xl">
                🍋
              </div>

              <div className="absolute -right-12 top-1/2 rounded-2xl bg-white p-4 shadow-xl dark:bg-[#30251F]">

                <div className="flex items-center gap-2">

                  <span className="text-lg text-[#E88FA5]">
                    ♥
                  </span>

                  <span className="text-sm font-bold">
                    Made with love
                  </span>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* RECIPE OF THE DAY */}
      {recipeOfDay && (
        <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">

          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-xl dark:bg-[#29211D] md:grid-cols-2">

            <div className="relative min-h-[350px]">

              {recipeImage(recipeOfDay.image) ? (
                <img
                  src={recipeImage(recipeOfDay.image)}
                  alt={recipeOfDay.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[350px] items-center justify-center bg-[#F5D8C8] text-6xl">
                  🍽️
                </div>
              )}

              <div className="absolute left-6 top-6 rounded-full bg-[#E88FA5] px-5 py-2 text-xs font-bold uppercase tracking-widest text-white">
                Today's Special
              </div>

            </div>

            <div className="flex flex-col justify-center p-8 md:p-14">

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#718B68]">
                A little inspiration for today
              </p>

              <h2 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
                Recipe of the Day
              </h2>

              <h3 className="mb-5 font-serif text-2xl italic text-[#E88FA5]">
                {recipeOfDay.name}
              </h3>

              <p className="mb-8 leading-relaxed text-gray-500 dark:text-gray-400">
                Discover today's special recipe and bring
                something delicious to your table.
              </p>

              <div className="mb-8 flex gap-6 text-sm text-gray-500">

                <span className="flex items-center gap-2">
                  <Clock size={17} className="text-[#718B68]" />
                  35 min
                </span>

                <span className="flex items-center gap-2">
                  <Users size={17} className="text-[#718B68]" />
                  6 servings
                </span>

              </div>

              <Link
                to={`/recipe/${recipeOfDay.id}`}
                className="inline-flex items-center gap-3 font-bold text-[#718B68] transition-all hover:gap-5"
              >
                Discover Recipe
                <ArrowRight size={19} />
              </Link>

            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="bg-[#F3E9DF] py-20 dark:bg-[#241C18]">

        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

          <div className="mb-12 text-center">

            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#E88FA5]">
              Explore your taste
            </p>

            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              What are you craving?
            </h2>

          </div>

          <div className="flex flex-wrap justify-center gap-3">

            {categories.map((category) => (
              <Link
                key={category.name}
                to={
                  category.keyword
                    ? `/search?q=${encodeURIComponent(category.keyword)}`
                    : '/search'
                }
                className="flex items-center gap-3 rounded-full border border-[#E88FA5]/10 bg-white px-6 py-4 text-[#55463D] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E88FA5] hover:bg-[#E88FA5] hover:text-white dark:bg-[#30251F] dark:text-white"
              >
                {category.icon}

                <span className="text-sm font-semibold">
                  {category.name}
                </span>

              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* SEASONS */}
      <section className="py-20">

        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

          <div className="mb-12 text-center">

            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#718B68]">
              Fresh ideas, all year round
            </p>

            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              Taste Every Season
            </h2>

          </div>

          <div className="flex flex-wrap justify-center gap-4">

            {seasons.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSeason(item.name)}
                aria-pressed={season === item.name}
                className={`flex items-center gap-3 rounded-full px-8 py-4 font-semibold transition-all duration-300 ${
                  season === item.name
                    ? 'scale-105 bg-[#718B68] text-white shadow-xl shadow-[#718B68]/20'
                    : 'border border-[#718B68]/20 bg-white text-gray-500 hover:-translate-y-1 hover:border-[#718B68] dark:bg-[#29211D] dark:text-gray-300'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* RECIPES */}
      <section
        id="recipes"
        className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 lg:px-12"
      >

        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#E88FA5]">
              Curated with love
            </p>

            <h2 className="font-serif text-4xl font-bold md:text-6xl">
              Our Featured

              <span className="block italic text-[#718B68]">
                Recipes
              </span>
            </h2>

          </div>

          <p className="text-sm uppercase tracking-widest text-gray-500">
            {recipes.length} Recipes
          </p>

        </div>

        {loading ? (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-3xl bg-[#F0E8DF] dark:bg-[#29211D]"
              />
            ))}

          </div>

        ) : recipes.length === 0 ? (

          <div className="py-20 text-center">

            <p className="mb-4 text-5xl">
              🍽️
            </p>

            <p className="font-serif text-2xl">
              No recipes available for this season.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}

          </div>

        )}

        <div className="mt-14 text-center">

          <Link
            to="/search"
            className="inline-flex items-center gap-3 rounded-full border-2 border-[#718B68] px-9 py-4 font-bold text-[#718B68] transition-all hover:bg-[#718B68] hover:text-white"
          >
            Explore All Recipes
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* AI CHEF BANNER */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">

        <div className="relative min-h-[340px] overflow-hidden rounded-[28px] bg-[#302018] shadow-2xl">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#302018] via-[#43291D] to-[#75402B]" />

          <div className="absolute -left-32 top-[-8rem] h-80 w-80 rounded-full bg-[#E88FA5]/10 blur-[90px]" />

          <div className="absolute -bottom-32 right-[15%] h-96 w-96 rounded-full bg-[#D98A50]/15 blur-[100px]" />

          <div className="relative z-10 grid min-h-[340px] items-center md:grid-cols-[0.85fr_1.4fr_1fr]">

            {/* Chef Robot Image */}
            <div className="flex items-center justify-center px-5 pt-8 md:pt-0">

              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                alt="AI Chef assistant"
                loading="lazy"
                className="h-40 w-40 object-contain drop-shadow-2xl sm:h-48 sm:w-48 md:h-56 md:w-56"
              />

            </div>

            {/* Banner Content */}
            <div className="px-7 py-8 text-center md:px-4 md:text-left">

              <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">

                <Sparkles size={15} className="text-[#E8B68D]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8B68D] sm:text-xs">
                  Your personal cooking assistant
                </span>

              </div>

              <h2 className="mb-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.6rem]">
                Meet AI Chef
                <span className="text-[#E88FA5]">.</span>
              </h2>

              <p className="mb-7 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                Not sure what to cook? Share your ingredients
                and let AI Chef inspire your next delicious meal.
              </p>

              <Link
                to="/ai-chef"
                className="group inline-flex items-center gap-3 rounded-full bg-[#E88FA5] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#D77C94] hover:shadow-lg hover:shadow-[#E88FA5]/20"
              >
                Try AI Chef

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>

            {/* Food Image */}
            <div className="relative hidden h-full min-h-[340px] overflow-hidden md:block">

              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=90"
                alt="Fresh and delicious food"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#43291D] via-[#43291D]/20 to-transparent" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#302018]/30 to-transparent" />

            </div>

          </div>
        </div>
      </section>

      {/* FOOTER MESSAGE */}
      <section className="px-6 py-16 text-center">

        <p className="mb-4 text-3xl text-[#E88FA5]">
          ♡
        </p>

        <h2 className="mb-4 font-serif text-3xl italic md:text-4xl">
          Good food, good mood.
        </h2>

        <p className="text-sm uppercase tracking-widest text-gray-500">
          Made with love by Saveurs
        </p>

      </section>

    </div>
  );
}

export default Home;
