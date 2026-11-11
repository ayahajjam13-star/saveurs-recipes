
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Lock,
  ArrowRight,
  Utensils,
  Sparkles,
  ChefHat,
  Bookmark,
  Search,
  Star,
  Flower2,
  Compass,
  BookHeart,
  MoveUpRight,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Favorites() {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    axios.get(`${API_URL}/favorites`)
      .then((res) => {
        setFavorites(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Favorites error:', err);
        setLoading(false);
      });
  }, [user]);

  const getImageUrl = (image) => {
    if (!image) return '/images/placeholder.jpg';

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:')
    ) {
      return image;
    }

    return `/images/${image.replace(/^\/+/, '')}`;
  };

  // Guest page
  if (!user) {
    return (
      <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#FCF8F7] px-5 py-20">

        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#EDC7B9]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ECE0CD]/35 blur-3xl" />

        <div className="relative w-full max-w-2xl overflow-hidden rounded-[18px] border border-white bg-white/80 p-8 text-center shadow-[0_25px_90px_rgba(90,51,37,0.09)] backdrop-blur-xl sm:p-14">

          <div className="absolute right-7 top-7 text-[#EDC7B9]">
            <Flower2 size={36} />
          </div>

          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[18px] bg-[#F9F5EE] text-[#BCA889]">
            <Heart size={42} />
          </div>

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[3px] text-[#B37E6B]">
            Your personal recipe library
          </p>

          <h1 className="font-serif text-5xl font-medium leading-tight text-[#5A3325] sm:text-6xl">
            Love it.
            <span className="block italic text-[#BCAC93]">
              Save it.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-[#9D8982] sm:text-base">
            Your favorite recipes deserve a special place. Sign in and keep
            every delicious discovery close to you.
          </p>

          <Link
            to="/login"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#5A3325] px-9 py-4 text-sm font-bold text-white shadow-lg shadow-[#5A3325]/15 transition-all hover:-translate-y-1 hover:bg-[#7B4836]"
          >
            Sign in to your collection
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="mt-10 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[2px] text-[#B8A8A2]">
            <span className="h-px w-8 bg-[#EFE1DC]" />
            Save your little moments
            <span className="h-px w-8 bg-[#EFE1DC]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCF9F8] pb-24 text-[#5A3325]">

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:px-12 lg:pb-24">

        <div className="pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full bg-[#EDC7B9]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#ECE0CD]/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.8fr]">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#EFE1DC] bg-white/80 px-4 py-2">
              <Bookmark size={14} className="text-[#B3806E]" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#B3806E]">
                Your personal collection
              </span>
            </div>

            <h1 className="font-serif text-6xl font-medium leading-[1.05] tracking-tight text-[#5A3325] sm:text-7xl lg:text-8xl">
              Saved
              <span className="block italic text-[#C5856D]">
                with love.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#9D8982] sm:text-lg">
              A little corner for all the flavors you love. Your discoveries,
              your inspiration, your very own recipe collection.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/"
                className="group inline-flex items-center gap-3 rounded-full bg-[#5A3325] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#5A3325]/15 transition-all hover:-translate-y-1 hover:bg-[#7B4836]"
              >
                Discover more
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#A7938C]">
                <Heart size={16} className="fill-[#ECE0CD] text-[#D0BEA3]" />
                Made for food lovers
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-[490px]">
            <div className="absolute -right-8 -top-8 h-52 w-52 rounded-full bg-[#EDC7B9]/45 blur-3xl" />

            <div className="relative grid grid-cols-[1fr_0.78fr] items-center gap-4">
              <div className="relative overflow-hidden rounded-[140px_140px_28px_28px] border-[7px] border-white shadow-2xl shadow-[#5A3325]/10">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=85"
                  alt="Beautiful colorful food"
                  className="h-[330px] w-full object-cover sm:h-[410px]"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-[18px] border-4 border-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&q=85"
                    alt="Fresh cooking ingredients"
                    className="h-40 w-full object-cover sm:h-52"
                  />
                </div>

                <div className="flex min-h-[125px] flex-col justify-center rounded-[18px] bg-[#F8EEEA] p-5">
                  <Heart size={22} className="mb-3 fill-[#ECE0CD] text-[#BCAC93]" />
                  <p className="font-serif text-xl font-bold text-[#5A3325]">
                    Your taste.
                  </p>
                  <p className="font-serif text-xl italic text-[#B37E6B]">
                    Your story.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-0 flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:-left-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F9F5EE] text-[#BCA889]">
                <BookHeart size={23} />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#5A3325]">
                  Recipe diary
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#AB9992]">
                  A collection of joy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection count */}
        <div className="relative mx-auto mt-20 max-w-7xl border-t border-[#EFE1DC] pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F9F5EE] text-[#BCA889]">
                <Heart size={22} />
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-[#5A3325]">
                  {favorites.length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#AB9992]">
                  Saved recipes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#AB9992]">
              <Sparkles size={15} className="text-[#C18B77]" />
              Your delicious little collection
            </div>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading ? (
        <section className="mx-auto max-w-7xl px-5 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8EEEA]">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#EFE1DC] border-t-[#C4836B]" />
          </div>
          <p className="font-serif text-2xl text-[#5A3325]">
            Preparing your collection...
          </p>
          <p className="mt-2 text-sm text-[#AB9992]">
            Gathering all your favorite flavors
          </p>
        </section>

      ) : favorites.length === 0 ? (

        /* EMPTY STATE */
        <section className="px-5 py-12 sm:px-8">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[18px] border border-[#F1E6E2] bg-white px-6 py-16 text-center shadow-[0_20px_70px_rgba(90,51,37,0.05)] sm:px-14">

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#EDC7B9]/30 blur-2xl" />
            <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-[#ECE0CD]/25 blur-2xl" />

            <div className="relative">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[18px] bg-[#F8EEEA] text-[#B37E6B]">
                <Utensils size={39} />
              </div>

              <p className="mb-4 text-[10px] font-bold uppercase tracking-[3px] text-[#B3806E]">
                A new adventure awaits
              </p>

              <h2 className="font-serif text-4xl font-medium leading-tight text-[#5A3325] sm:text-5xl">
                Your next favorite
                <span className="block italic text-[#BCAC93]">
                  is waiting.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-[#9D8982]">
                You haven't saved any recipes yet. Explore our kitchen,
                discover something delicious and keep it here for later.
              </p>

              <Link
                to="/"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#5A3325] px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#7B4836]"
              >
                <Compass size={18} />
                Explore recipes
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

      ) : (

        /* RECIPE COLLECTION */
        <section className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">

          <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#EFE1DC] pb-7 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#B3806E]">
                <span className="h-px w-8 bg-[#EB9D81]" />
                <span className="text-[10px] font-bold uppercase tracking-[3px]">
                  The collection
                </span>
              </div>

              <h2 className="font-serif text-4xl font-medium text-[#5A3325] sm:text-5xl">
                Your recipe gallery
                <span className="text-[#C88D77]">.</span>
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-7 text-[#AB9992]">
              Every saved dish is another little memory worth keeping.
            </p>
          </div>

          {/* Featured recipe */}
          {favorites.length > 0 && (
            <Link
              to={`/recipe/${favorites[0].id}`}
              className="group mb-12 grid overflow-hidden rounded-[18px] border border-[#F0E7E3] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5A3325]/8 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-[440px]">
                <img
                  src={getImageUrl(favorites[0].image)}
                  alt={favorites[0].name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />

                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[1.5px] text-[#5A3325] backdrop-blur-md">
                  <Star size={13} className="fill-[#EB9D81] text-[#B6765E]" />
                  Featured favorite
                </div>

                <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#5A3325] shadow-lg transition-all group-hover:bg-[#EDC7B9]">
                  <MoveUpRight size={21} />
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
                <div className="mb-7 flex items-center gap-2 text-[#BCAC93]">
                  <Heart size={16} className="fill-[#ECE0CD]" />
                  <span className="text-[10px] font-bold uppercase tracking-[2.5px]">
                    Your number one pick
                  </span>
                </div>

                <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-[#B78674]">
                  {favorites[0].country || 'World Cuisine'}
                </p>

                <h3 className="font-serif text-4xl font-medium leading-tight text-[#5A3325] transition-colors group-hover:text-[#B97D67] sm:text-5xl">
                  {favorites[0].name}
                </h3>

                <p className="mt-6 max-w-sm text-sm leading-8 text-[#AB9992]">
                  A special recipe from your personal collection. Open it
                  again and enjoy every delicious detail.
                </p>

                <div className="mt-9 flex items-center gap-3 text-sm font-bold text-[#B0745E]">
                  Discover this recipe
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </div>

                <div className="mt-12 border-t border-[#F1E8E5] pt-5">
                  <p className="font-serif text-lg italic text-[#B9A9A3]">
                    Saved with love.
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Other recipes */}
          {favorites.length > 1 && (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#B78674]">
                    More to love
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-[#5A3325]">
                    Your saved dishes
                  </h3>
                </div>

                <span className="rounded-full border border-[#EFE1DC] bg-white px-4 py-2 text-xs font-semibold text-[#9A8279]">
                  {favorites.length - 1} recipes
                </span>
              </div>

              <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.slice(1).map((recipe, index) => (
                  <Link
                    key={recipe.id}
                    to={`/recipe/${recipe.id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-[18px] bg-[#F8EEEA]">
                      <img
                        src={getImageUrl(recipe.image)}
                        alt={recipe.name}
                        loading="lazy"
                        className="h-[270px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[310px]"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg';
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#472518]/45 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />

                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#BCAC93] shadow-sm backdrop-blur-md">
                        <Heart size={18} className="fill-[#ECE0CD]" />
                      </div>

                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5A3325] shadow-md transition-all group-hover:bg-[#EDC7B9]">
                        <ArrowRight size={18} />
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 border-b border-[#EFE1DC] py-5">
                      <div className="min-w-0">
                        <p className="mb-2 text-[9px] font-bold uppercase tracking-[2px] text-[#B3806E]">
                          {recipe.country || 'World Cuisine'}
                        </p>

                        <h3 className="font-serif text-2xl font-medium leading-snug text-[#5A3325] transition-colors group-hover:text-[#B97D67]">
                          {recipe.name}
                        </h3>
                      </div>

                      <span className="pt-1 font-serif text-xl text-[#DCC2B9]">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* BOTTOM SIGNATURE */}
      {!loading && favorites.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[18px] border border-[#EFE1DC] bg-white px-7 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F9F5EE] text-[#BCAC93]">
                <Heart size={22} />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#5A3325]">
                  Keep discovering.
                </p>
                <p className="mt-1 text-xs text-[#AB9992]">
                  There are always more flavors to fall in love with.
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#B0745E] transition-colors hover:text-[#5A3325]"
            >
              Find more recipes
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Favorites;
