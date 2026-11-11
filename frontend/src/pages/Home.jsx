
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
  Sparkles,
  Heart
} from 'lucide-react';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [season, setSeason] = useState('Autumn');
  const [loading, setLoading] = useState(true);
  const [recipeOfDay, setRecipeOfDay] = useState(null);

  const categories = [
    { name: 'All Recipes', icon: <Utensils size={20} />, keyword: '', color: 'bg-[#B8E8EE]' },
    { name: 'Breakfast', icon: <Coffee size={20} />, keyword: 'pancake', color: 'bg-[#F2C7DB]' },
    { name: 'Lunch', icon: <Utensils size={20} />, keyword: 'salad, sandwich', color: 'bg-[#BFE8C8]' },
    { name: 'Dinner', icon: <Moon size={20} />, keyword: 'chicken, beef', color: 'bg-[#CBB7F5]' },
    { name: 'Desserts', icon: <CakeSlice size={20} />, keyword: 'cake, pie, sweet', color: 'bg-[#F2C7DB]' },
    { name: 'Healthy', icon: <Salad size={20} />, keyword: 'salad, vegetable', color: 'bg-[#BFE8C8]' },
    { name: 'Vegan', icon: <Leaf size={20} />, keyword: 'vegetable, tofu', color: 'bg-[#B8E8EE]' },
    { name: 'Quick & Easy', icon: <Zap size={20} />, keyword: 'quick', color: 'bg-[#CBB7F5]' }
  ];

  const seasons = [
    { name: 'Autumn', icon: <Leaf size={19} />, color: 'bg-[#F2C7DB]' },
    { name: 'Winter', icon: <Snowflake size={19} />, color: 'bg-[#B8E8EE]' },
    { name: 'Spring', icon: <Flower size={19} />, color: 'bg-[#BFE8C8]' },
    { name: 'Summer', icon: <Sun size={19} />, color: 'bg-[#CBB7F5]' }
  ];

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

  const recipeImage = (image) => {
    if (!image) return '';

    return image.startsWith('http')
      ? image
      : `/images/${image}`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FFFCFA] text-[#34313B] transition-colors duration-500 dark:bg-[#191923] dark:text-white">

      <SEO title="Saveurs | Recipes by Season" url="/" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-28 lg:pt-24">

        <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-[#B8E8EE]/50 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-[#F2C7DB]/40 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-[1450px] items-center gap-14 lg:grid-cols-2 lg:gap-16">

          <div className="animate-fade-in">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B8E8EE] bg-[#B8E8EE]/30 px-5 py-2.5 text-sm font-semibold text-[#397D88] dark:text-[#B8E8EE]">
              <Sparkles size={17} />
              A little taste of happiness
            </div>

            <h1 className="mb-7 font-serif text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl lg:text-[5.3rem]">
              Cooking is
              <span className="block italic text-[#70C9DA]">
                an adventure.
              </span>
              <span className="block">Let's begin!</span>
            </h1>

            <p className="mb-9 max-w-xl text-base leading-8 text-[#77717D] dark:text-gray-300 sm:text-lg">
              Discover delicious recipes, explore new flavors and find
              little moments of joy in every meal you make.
            </p>

            <div className="flex flex-wrap items-center gap-4">

              <a
                href="#recipes"
                className="group inline-flex items-center gap-3 rounded-full bg-[#7ADDF2] px-8 py-4 font-bold text-[#24515B] shadow-lg shadow-[#7ADDF2]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Recipes
                <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#F2C7DB] bg-white/70 px-8 py-4 font-bold text-[#9B6480] transition-all hover:bg-[#F2C7DB] hover:text-[#593C4A] dark:bg-white/5 dark:text-[#F2C7DB]"
              >
                Find Inspiration
                <Sparkles size={17} />
              </Link>

            </div>

            <div className="mt-12 flex flex-wrap items-center gap-7 sm:gap-10">

              <div>
                <p className="font-serif text-3xl font-bold text-[#65BFD0]">120+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Recipes</p>
              </div>

              <div className="h-11 w-px bg-[#B8E8EE]" />

              <div>
                <p className="font-serif text-3xl font-bold text-[#D99AB9]">20+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Countries</p>
              </div>

              <div className="h-11 w-px bg-[#CBB7F5]" />

              <div>
                <p className="font-serif text-3xl font-bold text-[#85BF92]">4</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Seasons</p>
              </div>

            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-[570px]">

            <div className="absolute -right-7 -top-7 h-40 w-40 rounded-full bg-[#CBB7F5]/50 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-[#BFE8C8]/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-[42%_42%_30%_30%] border-[9px] border-white shadow-2xl dark:border-[#34313B]">
              <img
                src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1100&q=85"
                alt="Delicious fresh pasta"
                loading="eager"
                className="aspect-[4/4.5] w-full object-cover"
              />
            </div>

            <div className="absolute -left-5 top-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2C7DB] text-3xl shadow-lg sm:-left-8 sm:h-20 sm:w-20 sm:text-4xl">
              🍓
            </div>

            <div className="absolute -right-3 top-1/3 flex h-16 w-16 items-center justify-center rounded-full bg-[#BFE8C8] text-3xl shadow-lg sm:-right-7 sm:h-20 sm:w-20 sm:text-4xl">
              🥑
            </div>

            <div className="absolute -bottom-5 left-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8E8EE] text-3xl shadow-lg sm:h-20 sm:w-20 sm:text-4xl">
              🍋
            </div>

            <div className="absolute -bottom-3 right-4 rounded-2xl border border-white/70 bg-white px-5 py-3 shadow-xl dark:border-white/10 dark:bg-[#292938] sm:right-0">
              <p className="text-sm font-bold">Made with love ♡</p>
              <p className="text-xs text-gray-500">Enjoy every bite!</p>
            </div>

          </div>
        </div>
      </section>

      
{/* RECIPE OF THE DAY */}
{recipeOfDay && (
  <section className="mx-auto max-w-[1450px] px-5 py-20 sm:px-8 lg:px-12">

    <div className="mb-10 flex items-center justify-between gap-4">
      <div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F2C7DB]/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#AD7190]">
          <Sparkles size={15} />
          Special for you
        </span>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Today's inspiration<span className="text-[#D99AB9]">.</span>
        </h2>
      </div>

      <span className="hidden text-4xl sm:block">⭐</span>
    </div>

    <div className="relative grid overflow-hidden rounded-[32px] bg-[#FDF1F6] shadow-xl dark:bg-[#292938] md:grid-cols-[1.15fr_1fr]">

      <div className="relative min-h-[350px] overflow-hidden sm:min-h-[480px]">

        {recipeImage(recipeOfDay.image) ? (
          <img
            src={recipeImage(recipeOfDay.image)}
            alt={recipeOfDay.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-[350px] items-center justify-center bg-[#F2C7DB] text-7xl">
            🍽️
          </div>
        )}

        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-5 py-3 text-xs font-bold text-[#A65D80] shadow-lg">
          ✨ Today's Special
        </div>

        <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-5 py-3 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wider text-[#AD7190]">
            Made with love
          </p>
          <p className="mt-1 font-serif text-lg font-bold text-[#34313B]">
            A taste to remember ♡
          </p>
        </div>
      </div>

      <div className="relative flex flex-col justify-center overflow-hidden p-7 sm:p-12 lg:p-14">

        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#B8E8EE]/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#CBB7F5]/30 blur-3xl" />

        <div className="relative">

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B17C9B]">
            A little inspiration for today
          </span>

          <h2 className="mb-6 mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Recipe of
            <span className="block italic text-[#70C9DA]">
              the Day.
            </span>
          </h2>

          <div className="mb-5 h-1 w-16 rounded-full bg-[#F2C7DB]" />

          <h3 className="mb-4 font-serif text-2xl font-bold text-[#B17C9B] dark:text-[#F2C7DB] sm:text-3xl">
            {recipeOfDay.name}
          </h3>

          <p className="mb-8 max-w-md text-sm leading-8 text-gray-600 dark:text-gray-300 sm:text-base">
            Discover today's special recipe and bring something delicious to your table.
          </p>

          <div className="mb-9 flex flex-wrap gap-3">

            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-[#202B34]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8E8EE] text-[#397D88]">
                <Clock size={20} />
              </span>
              <div>
                <p className="text-xs text-gray-500">Preparation</p>
                <p className="font-bold">35 min</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-[#202B34]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2C7DB] text-[#A65D80]">
                <Users size={20} />
              </span>
              <div>
                <p className="text-xs text-gray-500">Servings</p>
                <p className="font-bold">6 people</p>
              </div>
            </div>

          </div>

          <Link
            to={`/recipe/${recipeOfDay.id}`}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#7ADDF2] px-8 py-4 font-bold text-[#24515B] shadow-lg shadow-[#7ADDF2]/20 transition-all duration-300 hover:-translate-y-1 hover:gap-5 hover:shadow-xl"
          >
            Discover Recipe
            <ArrowRight size={19} />
          </Link>

        </div>
      </div>
    </div>
  </section>
)}


      
{/* AI CHEF */}
<section className="mx-auto max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12">
  <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#EAF9FA] via-[#F5F0FF] to-[#FFF0F6] shadow-xl dark:from-[#202F3A] dark:via-[#29283D] dark:to-[#382B3A]">

    {/* Decorative shapes */}
    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#7ADDF2]/30 blur-3xl" />
    <div className="absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-[#CBB7F5]/40 blur-3xl" />

    <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">

      {/* TEXT CONTENT */}
      <div className="relative z-10 text-center lg:text-left">

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B8E8EE] bg-white/80 px-4 py-2 text-xs font-bold text-[#397D88] shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-[#B8E8EE]">
          <Sparkles size={16} />
          YOUR PERSONAL AI COOKING ASSISTANT
        </div>

        <h2 className="mb-5 font-serif text-4xl font-extrabold leading-tight text-[#294B55] sm:text-5xl lg:text-6xl dark:text-white">
          What's cooking
          <br />
          <span className="text-[#54C5DC]">in your mind?</span>
        </h2>

        <p className="mx-auto mb-8 max-w-lg text-base leading-8 text-[#627B82] sm:text-lg lg:mx-0 dark:text-gray-300">
          Meet your new kitchen companion! Tell AI Chef what's in your fridge
          and discover delicious recipes made just for you.
        </p>

        <Link
          to="/ai-chef"
          className="group inline-flex items-center gap-3 rounded-full bg-[#7ADDF2] px-8 py-4 font-extrabold text-[#24515B] shadow-lg shadow-[#7ADDF2]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#62CFE8] hover:shadow-xl"
        >
          <Sparkles size={19} />
          Try AI Chef
          <ArrowRight size={19} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-semibold text-[#548E9A] lg:justify-start dark:text-[#B8E8EE]">
          <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">✨ Smart Recipes</span>
          <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">🥑 Your Ingredients</span>
          <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">💡 Fresh Ideas</span>
        </div>
      </div>

      {/* IMAGE AREA */}
      <div className="relative mx-auto w-full max-w-xl">

        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=90"
            alt="Fresh and delicious food"
            loading="lazy"
            className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[450px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#243C42]/50 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              A little inspiration
            </p>
            <p className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              Create something delicious.
            </p>
          </div>
        </div>

        {/* AI CHEF FLOATING CARD */}
        <div className="absolute -left-3 top-6 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3 shadow-xl sm:-left-8 sm:p-4 dark:border-white/10 dark:bg-[#263C44]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF9FA] sm:h-16 sm:w-16">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="AI Chef assistant"
              loading="lazy"
              className="h-11 w-11 object-contain sm:h-13 sm:w-13"
            />
          </div>

          <div>
            <p className="text-sm font-extrabold text-[#294B55] dark:text-white">
              AI Chef
            </p>
            <p className="text-xs text-[#6C929A] dark:text-gray-300">
              Ready to help you!
            </p>
            <div className="mt-1 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#83D9A1]" />
              <span className="text-[10px] font-semibold text-[#68A987]">Online</span>
            </div>
          </div>
        </div>

        {/* DECORATION */}
        <div className="absolute -bottom-5 -right-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CBB7F5] text-3xl shadow-lg sm:-right-6">
          ✨
        </div>
      </div>

    </div>
  </div>
</section>

      
{/* CATEGORIES */}
<section className="relative overflow-hidden bg-[#F5FBFA] py-24 dark:bg-[#202B34]">

  <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#B8E8EE]/30 blur-3xl" />
  <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#F2C7DB]/30 blur-3xl" />

  <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

    <div className="mb-14 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#B8E8EE]/40 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#397D88] dark:text-[#B8E8EE]">
        <Sparkles size={15} />
        A world of delicious choices
      </span>

      <h2 className="mt-6 font-serif text-4xl font-bold sm:text-6xl">
        Find your next
        <span className="block italic text-[#70C9DA]">
          favorite bite.
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-300 sm:text-base">
        Whatever you're craving, there's something delicious waiting
        for you. Explore, discover and enjoy!
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

      {categories.map((category, index) => {
        const categoryImages = [
  // All Recipes
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=85',

  // Breakfast
  'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&q=85',

  // Lunch
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85',

  // Dinner
  'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=700&q=85',

  // Desserts
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=85',

  // Healthy
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=85',

  // Vegan
  'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=700&q=85',

  // Quick & Easy
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&q=85'
];

        const categoryColors = [
          '#B8E8EE',
          '#F2C7DB',
          '#BFE8C8',
          '#CBB7F5',
          '#F2C7DB',
          '#BFE8C8',
          '#B8E8EE',
          '#CBB7F5'
        ];

        return (
          <Link
        key={category.name}
        to={
        category.name === 'All Recipes'
      ? '/search'
      : `/category/${encodeURIComponent(category.name)}`
        }
            className="group relative overflow-hidden rounded-[28px] bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-[#292938]"
          >

            <div className="relative aspect-[4/5] overflow-hidden">

              <img
                src={categoryImages[index]}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div
                className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl text-[#34313B] shadow-lg"
                style={{ backgroundColor: categoryColors[index] }}
              >
                {category.icon}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">

                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                  Discover something delicious
                </p>

                <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">
                  {category.name}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white">
                  Explore recipes
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />
                </div>

              </div>
            </div>
          </Link>
        );
      })}

    </div>
  </div>
</section>


      {/* SEASONS */}
      <section className="py-20">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#BFE8C8]/50 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#548B60]">
              Fresh ideas, all year round
            </span>

            <h2 className="font-serif text-4xl font-bold sm:text-5xl">
              Taste Every Season
            </h2>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
              Let every season bring something delicious to your kitchen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">

            {seasons.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSeason(item.name)}
                aria-pressed={season === item.name}
                className={`flex items-center gap-3 rounded-full border-2 px-7 py-4 font-bold transition-all duration-300 hover:-translate-y-1 ${
                  season === item.name
                    ? `${item.color} scale-105 border-transparent text-[#34313B] shadow-lg`
                    : 'border-gray-100 bg-white text-gray-500 hover:border-[#B8E8EE] dark:border-white/10 dark:bg-[#292938] dark:text-gray-300'
                }`}
              >
                {item.icon}
                {item.name}
                {season === item.name && <span>✓</span>}
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* RECIPES */}
      
{/* SEASONS */}
<section className="relative overflow-hidden bg-[#F5FBFA] py-24 dark:bg-[#202B34]">

  <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#B8E8EE]/30 blur-3xl" />
  <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#F2C7DB]/30 blur-3xl" />

  <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

    <div className="mb-14 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#5799A1] shadow-sm dark:bg-[#292938]">
        <Sparkles size={15} />
        Fresh ideas, all year round
      </span>

      <h2 className="mt-6 font-serif text-4xl font-bold sm:text-6xl">
        A year full of
        <span className="block italic text-[#70C9DA]">delicious moments.</span>
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-300 sm:text-base">
        Every season has its own flavor. Find your inspiration and bring
        something special to your kitchen.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">

      {[
        {
          name: 'Autumn',
          subtitle: 'Cozy & comforting',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=85',
          color: '#F2C7DB'
        },
        {
          name: 'Winter',
          subtitle: 'Warm & delicious',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=85',
          color: '#B8E8EE'
        },
        {
          name: 'Spring',
          subtitle: 'Fresh & colorful',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85',
          color: '#BFE8C8'
        },
        {
          name: 'Summer',
          subtitle: 'Bright & refreshing',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=85',
          color: '#CBB7F5'
        }
      ].map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={() => setSeason(item.name)}
          aria-pressed={season === item.name}
          className={`group relative overflow-hidden rounded-[28px] text-left transition-all duration-500 hover:-translate-y-2 ${
            season === item.name
              ? 'ring-4 ring-[#7ADDF2] ring-offset-4 ring-offset-[#F5FBFA] dark:ring-offset-[#202B34] shadow-2xl'
              : 'shadow-lg hover:shadow-2xl'
          }`}
        >
          <div className="relative aspect-[3/4] overflow-hidden">

            <img
              src={item.image}
              alt={`${item.name} seasonal food`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-[#34313B] shadow-md"
              style={{ backgroundColor: item.color }}
            >
              {item.name === 'Autumn' ? '🍂' :
               item.name === 'Winter' ? '❄️' :
               item.name === 'Spring' ? '🌸' : '☀️'}
            </div>

            {season === item.name && (
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4BA9B8] shadow-lg">
                ✓
              </span>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
                Discover the flavor
              </p>

              <h3 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                {item.name}
              </h3>

              <p className="mt-1 text-xs font-medium text-white/85 sm:text-sm">
                {item.subtitle}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white">
                Explore season
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

          </div>
        </button>
      ))}

    </div>
  </div>
</section>


{/* RECIPES */}
<section
  id="recipes"
  className="mx-auto max-w-[1450px] scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12"
>

  <div className="relative mb-14 overflow-hidden rounded-[32px] bg-[#FDF1F6] px-7 py-10 dark:bg-[#292938] sm:px-12 sm:py-14">

    <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#F2C7DB]/50 blur-3xl" />
    <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-[#B8E8EE]/50 blur-3xl" />

    <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">

      <div className="max-w-3xl">

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EBC5D8] bg-white/80 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#AC6F90] shadow-sm">
          <Heart size={14} className="fill-[#E9A9C5]" />
          Made for your table
        </div>

        <p className="mb-3 text-sm font-semibold tracking-wide text-[#A77F96]">
          A little inspiration for every craving
        </p>

        <h2 className="font-serif text-4xl font-bold leading-tight text-[#3C4650] dark:text-white sm:text-6xl lg:text-7xl">
          Discover our
          <span className="block italic text-[#70C9DA]">
            delicious recipes.
          </span>
        </h2>

        <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-300 sm:text-base">
          From everyday favorites to new culinary adventures,
          your next delicious moment starts here.
        </p>

      </div>

      <div className="flex items-center gap-3 self-start rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-[#202B34] md:self-end">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B8E8EE] text-[#397D88]">
          <Utensils size={21} />
        </span>

        <div>
          <p className="text-2xl font-bold text-[#4C9EAA]">
            {recipes.length}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Seasonal recipes
          </p>
        </div>
      </div>

    </div>
  </div>

  {loading ? (

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-3xl bg-[#EAF5F5] dark:bg-[#292938]"
        />
      ))}
    </div>

  ) : recipes.length === 0 ? (

    <div className="rounded-[2rem] bg-[#F0FAFC] px-6 py-20 text-center dark:bg-[#292938]">
      <p className="mb-5 text-5xl">🍽️</p>
      <p className="font-serif text-2xl font-bold">
        No recipes available for this season.
      </p>
      <p className="mt-3 text-sm text-gray-500">
        Try another season to discover more delicious ideas.
      </p>
    </div>

  ) : (

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>

  )}

  <div className="mt-14 text-center">
    <Link
      to="/search"
      className="group inline-flex items-center gap-3 rounded-full border-2 border-[#7ADDF2] bg-white px-9 py-4 font-bold text-[#397D88] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ADDF2] hover:text-[#24515B] hover:shadow-lg dark:bg-[#292938] dark:text-[#B8E8EE]"
    >
      Explore All Recipes
      <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
    </Link>
  </div>

</section>


                 {/* FOOTER MESSAGE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF9FA] via-[#FFF7FA] to-[#F1ECFF] px-5 py-12 text-center dark:from-[#18262E] dark:via-[#292938] dark:to-[#302A42]">

        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-[#7ADDF2]/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#F2C7DB]/35 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CBB7F5]/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          {/* Decorative label */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <span className="text-[#E99AB8]">✦</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#648C96] dark:text-[#B8E8EE]">
              A little love in every bite
            </span>
            <span className="text-[#CBB7F5]">✦</span>
          </div>

          {/* Main message */}
          <div>
            <div className="mb-3 text-3xl text-[#E99AB8]">
              ♡
            </div>

            <h2 className="font-serif text-3xl font-extrabold leading-tight text-[#294B55] sm:text-5xl dark:text-white">
              Good food,
              <span className="block bg-gradient-to-r from-[#54BFD2] via-[#C18BB5] to-[#A995D8] bg-clip-text text-transparent">
                good mood.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#789197] sm:text-sm dark:text-gray-300">
              Discover delicious recipes, create beautiful moments and share the joy of cooking.
            </p>
          </div>

          {/* Food icons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {['🍓', '🥑', '🧁', '🍋'].map((food, index) => (
              <div
                key={index}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/80 bg-white/70 text-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-6 dark:border-white/10 dark:bg-white/10"
              >
                {food}
              </div>
            ))}
          </div>

          {/* Brand signature */}
          <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#B8E8EE]" />

            <p className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#A47791] dark:text-[#F2C7DB]">
              Made with love by <span className="text-[#54BFD2]">Saveurs</span>
            </p>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#B8E8EE]" />
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;