
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
  Clock,
  Users,
  Star,
  Sparkles,
  ArrowUpRight,
  Utensils,
  Leaf,
  MessageCircle,
  ChefHat,
  MoveDownRight,
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
    count: 0,
  });
  const [cookingMode, setCookingMode] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);

    getRecipe(id)
      .then((res) => {
        if (active) setRecipe(res.data);
      })
      .catch((err) => {
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

    axios
      .get(`${API_URL}/ratings/${id}`)
      .then((res) => {
        if (active) setRatings(res.data);
      })
      .catch((err) => console.error('Ratings error:', err));

    return () => {
      active = false;
    };
  }, [id]);

  const favorite = recipe ? isFavorite(recipe.id) : false;

  const handleFavoriteClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    toggleFavorite(recipe.id);
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
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5] dark:bg-[#2D1E19]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#EDC7B9] border-t-[#CF7757]" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[#968179]">
            Setting the table...
          </p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F5] px-6 text-center dark:bg-[#2D1E19]">
        <Utensils size={48} className="mb-5 text-[#CF7757]" />
        <h2 className="font-serif text-4xl font-bold text-[#54352A] dark:text-white">
          Recipe not found
        </h2>
        <p className="mt-3 text-sm text-[#968179]">
          This delicious discovery seems to be missing.
        </p>
        <Link
          to="/"
          className="mt-7 rounded-full bg-[#EB9D81] px-7 py-3 text-sm font-bold text-[#5A3325]"
        >
          Explore recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF9F5] text-[#452F27] dark:bg-[#2D1E19] dark:text-white">

      <SEO title={recipe.name} url={`/recipe/${recipe.id}`} />

      {/* TOP EDITORIAL BAR */}
      <header className="relative z-20 mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-10 lg:px-16">

        <Link
          to="/"
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8F7A72] transition hover:text-[#CF7757]"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          <span>Back</span>
        </Link>

        <Link to="/" className="text-center">
          <span className="block font-serif text-2xl font-black tracking-[0.22em] text-[#54352A] dark:text-white">
            SAVEURS<span className="text-[#EB9D81]">.</span>
          </span>
          <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.35em] text-[#AFA09B]">
            The culinary atelier
          </span>
        </Link>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:rotate-[-8deg] ${
            favorite
              ? 'border-[#ECE0CD] bg-[#ECE0CD] text-[#9C886A]'
              : 'border-[#E9E0DD] text-[#8F7A72] hover:border-[#ECE0CD] hover:bg-[#FDF9F2] hover:text-[#AE9D83] dark:border-white/15'
          }`}
        >
          <Heart size={19} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </header>

      <main>

        {/* ART-DIRECTED COVER */}
        <section className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-8 lg:px-12">

          <div className="relative grid min-h-[650px] grid-cols-1 lg:grid-cols-12 lg:items-center">

            {/* LARGE TYPOGRAPHY */}
            <div className="relative z-10 order-2 flex flex-col justify-center px-3 pb-10 pt-7 sm:px-8 lg:order-1 lg:col-span-5 lg:px-5 lg:py-16">

              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-[#B9AA93]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9D917E]">
                  A taste worth remembering
                </span>
              </div>

              <p className="mb-3 font-serif text-lg italic text-[#B2A38E]">
                Today's culinary story
              </p>

              <h1 className="max-w-2xl break-words font-serif text-5xl font-black leading-[0.98] tracking-[-0.045em] text-[#54352A] sm:text-6xl lg:text-[5.5rem] dark:text-white">
                {recipe.name}
                <span className="text-[#EB9D81]">.</span>
              </h1>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rotate-[-8deg] rounded-full border border-[#E0D6CD] bg-[#F4F0EC] p-1">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#E6D6C6] text-[#6D6256]">
                    <Sparkles size={19} />
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#AFA09B]">
                    Selected by
                  </p>
                  <p className="mt-1 font-serif text-lg font-bold text-[#54352A] dark:text-white">
                    Saveurs Kitchen
                  </p>
                </div>
              </div>

              <p className="mt-9 max-w-sm text-sm leading-8 text-[#8F7A72] dark:text-gray-300">
                A beautiful dish, a memorable moment, and a little inspiration for your next kitchen adventure.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCookingMode(true)}
                  className="group flex items-center gap-3 rounded-full bg-[#54352A] px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#54352A]/15 transition hover:-translate-y-1 hover:bg-[#864F3B] dark:bg-[#EB9D81] dark:text-[#5A3325]"
                >
                  <Play size={15} fill="currentColor" />
                  Let's cook
                  <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#AFA09B]">
                  Recipe #{recipe.id}
                </span>
              </div>

              {/* DECORATIVE TYPOGRAPHY */}
              <div className="pointer-events-none absolute -bottom-5 left-0 hidden select-none font-serif text-[130px] font-black leading-none text-[#EDC7B9]/20 lg:block">
                BON
              </div>
            </div>

            {/* IMAGE COMPOSITION */}
            <div className="relative order-1 min-h-[400px] lg:order-2 lg:col-span-7 lg:min-h-[650px]">

              <div className="absolute right-4 top-5 h-[85%] w-[85%] rotate-[3deg] bg-[#ECE0CD] sm:right-10 lg:right-12" />

              <div className="absolute inset-0 overflow-hidden bg-[#EBE1DD] lg:inset-x-5 lg:inset-y-3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={recipe.name}
                    className="h-full min-h-[400px] w-full object-cover lg:min-h-[620px]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex min-h-[400px] h-full items-center justify-center bg-gradient-to-br from-[#EDC7B9] via-[#ECE0CD] to-[#E6D6C6]">
                    <Utensils size={90} className="text-white/80" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#311F19]/30 to-transparent" />
              </div>

              {/* ROTATED STAMP */}
              <div className="absolute -bottom-5 left-3 flex h-24 w-24 rotate-[-12deg] flex-col items-center justify-center rounded-full border border-white/70 bg-[#EADFC8] text-center text-[#5B3D32] shadow-xl sm:bottom-5 sm:left-0 lg:-left-5">
                <Leaf size={17} />
                <span className="mt-1 text-[8px] font-black uppercase tracking-widest">
                  Made with
                </span>
                <span className="font-serif text-sm font-black italic">
                  love
                </span>
              </div>

              {/* IMAGE SIDE LABEL */}
              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rotate-90 text-[9px] font-black uppercase tracking-[0.4em] text-[#9D8A83] lg:block">
                FOOD · ART · CULTURE
              </div>

            </div>
          </div>

          {/* SMALL FACTS - EDITORIAL FOOTNOTE */}
          <div className="mt-12 grid grid-cols-3 border-y border-[#E7DFDC] py-6 dark:border-white/10">

            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Clock size={19} className="text-[#CF7757]" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-[#AFA09B]">
                  Time
                </p>
                <p className="mt-1 text-xs font-extrabold sm:text-sm">30 minutes</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 border-x border-[#E7DFDC] sm:gap-4 dark:border-white/10">
              <Users size={19} className="text-[#B9AA93]" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-[#AFA09B]">
                  Serves
                </p>
                <p className="mt-1 text-xs font-extrabold sm:text-sm">4 people</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Star size={19} className="text-[#C7B6A6]" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-[#AFA09B]">
                  Rating
                </p>
                <p className="mt-1 text-xs font-extrabold sm:text-sm">
                  {ratings.average || '—'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* INGREDIENTS - THE INGREDIENT ATELIER */}
        <section className="relative overflow-hidden bg-[#F6EDEA] py-20 dark:bg-[#3B2821]">

          <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full border border-[#EDC7B9]/50" />
          <div className="pointer-events-none absolute -right-12 top-20 h-56 w-56 rounded-full border border-[#EDC7B9]/40" />

          <div className="relative mx-auto max-w-[1400px] px-5 md:px-12">

            <div className="grid gap-12 lg:grid-cols-12">

              <div className="lg:col-span-4">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E6956]">
                  01 / THE COMPOSITION
                </p>

                <h2 className="mt-7 font-serif text-5xl font-black leading-[0.95] tracking-tight text-[#54352A] sm:text-6xl dark:text-white">
                  A few
                  <br />
                  good
                  <br />
                  <span className="italic text-[#CF7757]">things.</span>
                </h2>

                <p className="mt-8 max-w-xs text-sm leading-8 text-[#8B7167] dark:text-gray-300">
                  Great dishes start with simple ingredients. Gather everything you need and let the magic happen.
                </p>

                <div className="mt-10 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#CF7757] shadow-sm dark:bg-white/10">
                    <Utensils size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7167]">
                    Ingredient studio
                  </span>
                </div>
              </div>

              <div className="relative lg:col-span-8">

                <div className="absolute -left-5 -top-5 z-10 hidden h-20 w-20 items-center justify-center rounded-full bg-[#ECE0CD] font-serif text-3xl font-black text-[#93846E] lg:flex">
                  01
                </div>

                <div className="border-b border-[#E1D0CA] bg-[#FAF9F5] p-5 sm:p-9 dark:border-white/10 dark:bg-[#432E27]">
                  <RecipeScaling
                    ingredients={recipe.ingredients || []}
                    baseServings={4}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#968179]">
                    Measure · Prepare · Enjoy
                  </span>
                  <Sparkles size={18} className="text-[#B9AA93]" />
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* METHOD - VISUAL STORY */}
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-12">

          <div className="mb-16 flex flex-col justify-between gap-7 md:flex-row md:items-end">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#B2A38E]">
                02 / THE CREATION
              </p>

              <h2 className="mt-5 max-w-2xl font-serif text-5xl font-black leading-[0.95] tracking-tight text-[#54352A] sm:text-7xl dark:text-white">
                The art of
                <br />
                <span className="italic text-[#B9AA93]">making it.</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setCookingMode(true)}
              className="group flex w-fit items-center gap-3 border-b-2 border-[#EB9D81] pb-3 text-xs font-black uppercase tracking-[0.15em] text-[#864F3B] transition hover:gap-5 dark:text-[#EDC7B9]"
            >
              <Play size={16} fill="currentColor" />
              Enter cooking mode
              <ArrowUpRight size={16} />
            </button>

          </div>

          <div className="space-y-0">
            {(recipe.steps || []).map((step, index) => {
              const reverse = index % 2 !== 0;

              return (
                <article
                  key={index}
                  className={`grid gap-5 border-t border-[#E7DFDC] py-10 dark:border-white/10 md:grid-cols-12 md:items-center md:gap-10 ${
                    reverse ? 'md:[direction:rtl]' : ''
                  }`}
                >

                  <div className="relative md:col-span-4 md:[direction:ltr]">
                    <span className="block font-serif text-[100px] font-black leading-none tracking-[-0.08em] text-[#ECDED9] sm:text-[130px] dark:text-white/10">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#9C7D72]">
                      THE PROCESS
                    </span>
                  </div>

                  <div className="md:col-span-8 md:[direction:ltr]">
                    <div className="flex items-start gap-4">
                      <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[#B9AA93]" />
                      <div>
                        <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-[#B2A38E]">
                          STEP {index + 1}
                        </p>

                        <p className="max-w-3xl font-serif text-xl leading-[1.8] text-[#6B5147] sm:text-2xl dark:text-gray-200">
                          {step}
                        </p>
                      </div>
                    </div>
                  </div>

                </article>
              );
            })}

            {(!recipe.steps || recipe.steps.length === 0) && (
              <p className="border-t border-[#E7DFDC] py-10 text-sm text-[#968179]">
                No cooking steps available.
              </p>
            )}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 bg-[#F3F0EB] px-6 py-12 text-center dark:bg-white/5">
            <ChefHat size={32} className="text-[#B2A38E]" />

            <h3 className="font-serif text-3xl font-black text-[#54352A] dark:text-white">
              Ready to make it yours?
            </h3>

            <p className="max-w-md text-sm leading-7 text-[#968179] dark:text-gray-300">
              Follow the steps, take your time, and enjoy every moment in your kitchen.
            </p>

            <button
              type="button"
              onClick={() => setCookingMode(true)}
              className="mt-2 rounded-full bg-[#E6D6C6] px-8 py-4 text-xs font-black uppercase tracking-widest text-[#63584D] transition hover:-translate-y-1 hover:bg-[#EDC7B9] hover:text-[#5A3325]"
            >
              Start the experience
            </button>
          </div>

        </section>

        {/* COMMUNITY - EDITORIAL QUOTES */}
        <section className="relative overflow-hidden bg-[#F5F3EE] py-20 dark:bg-[#34302D]">

          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#ECE0CD]/40 blur-3xl" />

          <div className="relative mx-auto max-w-[1400px] px-5 md:px-12">

            <div className="grid gap-12 lg:grid-cols-12">

              <div className="lg:col-span-4">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#B2A38E]">
                  03 / THE PEOPLE
                </p>

                <h2 className="mt-6 font-serif text-5xl font-black leading-[0.95] text-[#54352A] sm:text-6xl dark:text-white">
                  Food is
                  <br />
                  better
                  <br />
                  <span className="italic text-[#B9AA93]">together.</span>
                </h2>

                <p className="mt-7 max-w-xs text-sm leading-8 text-[#8E8B87] dark:text-gray-300">
                  Every kitchen has a story. Share yours, rate this recipe, and inspire the next person to try it.
                </p>

                <div className="mt-9 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#B9AA93] shadow-sm dark:bg-white/10">
                    <MessageCircle size={19} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9D917E]">
                    From our community
                  </span>
                </div>
              </div>

              <div className="space-y-10 lg:col-span-8">

                <div className="border-b border-[#E7E2DB] pb-10 dark:border-white/10">
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#B2A38E]">
                        YOUR OPINION
                      </p>
                      <h3 className="mt-2 font-serif text-3xl font-bold text-[#54352A] dark:text-white">
                        Rate this recipe
                      </h3>
                    </div>

                    <div className="font-serif text-5xl font-black text-[#D4CABA]">
                      {ratings.average || '—'}
                    </div>
                  </div>

                  <RatingForm
                    recipeId={parseInt(id, 10)}
                    onRatingChange={handleRatingChange}
                  />
                </div>

                <div className="border-b border-[#E7E2DB] pb-10 dark:border-white/10">
                  <div className="mb-7 flex items-center gap-3">
                    <Star size={19} className="text-[#B9AA93]" />
                    <h3 className="font-serif text-2xl font-bold text-[#54352A] dark:text-white">
                      Little notes from food lovers
                    </h3>
                  </div>

                  <RatingList ratings={ratings.ratings || []} />
                </div>

                <div>
                  <div className="mb-7 flex items-center gap-3">
                    <MessageCircle size={19} className="text-[#CF7757]" />
                    <h3 className="font-serif text-2xl font-bold text-[#54352A] dark:text-white">
                      Join the conversation
                    </h3>
                  </div>

                  <CommentsSection recipeId={parseInt(id, 10)} />
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE */}
        <footer className="relative overflow-hidden px-5 py-20 text-center">

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EDC7B9]/20 blur-3xl" />

          <div className="relative">
            <p className="font-serif text-5xl font-black tracking-[0.15em] text-[#54352A] sm:text-7xl dark:text-white">
              SAVEURS<span className="text-[#EB9D81]">.</span>
            </p>

            <p className="mt-5 font-serif text-xl italic text-[#9D917E]">
              Good food, good mood.
            </p>

            <div className="mt-7 flex justify-center gap-4 text-2xl">
              <span>🍓</span>
              <span>🥑</span>
              <span>🧁</span>
              <span>🍋</span>
            </div>

            <p className="mt-8 text-[9px] font-black uppercase tracking-[0.35em] text-[#AFA09B]">
              Made with love, for the love of food
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#864F3B] transition hover:gap-4 dark:text-[#EDC7B9]"
            >
              Discover more recipes
              <MoveDownRight size={15} className="rotate-[-45deg]" />
            </Link>
          </div>

        </footer>

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
