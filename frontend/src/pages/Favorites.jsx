
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Heart, Lock, ArrowRight, Utensils, Sparkles } from 'lucide-react';

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

    axios.get(`${API_URL}/favorites`)
      .then(res => {
        setFavorites(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Favorites error:', err);
        setLoading(false);
      });
  }, [user]);

  // Guest Page
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center px-6">
        <div className="max-w-md text-center py-16">
          <div className="w-24 h-24 rounded-full bg-[#F7A1B3]/20 flex items-center justify-center mx-auto mb-8">
            <Lock size={38} className="text-[#F16D7A]" />
          </div>

          <p className="text-[#87A93D] uppercase tracking-[0.3em] text-xs mb-4">
            Your Personal Collection
          </p>

          <h2 className="font-serif text-5xl text-[#53652C] mb-5">
            A Taste of Love
          </h2>

          <p className="text-[#77745F] leading-7 mb-9">
            Sign in to save your favorite recipes and keep
            your most delicious discoveries in one place.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#87A93D] text-white hover:bg-[#6E8C2D] transition-all duration-300 shadow-lg shadow-[#87A93D]/20"
          >
            Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-[#394323] pb-28 overflow-hidden">

      {/* Decorative Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 px-6 text-center">

        <div className="absolute top-12 left-[-60px] w-52 h-52 rounded-full bg-[#C6D97A]/20 blur-3xl" />
        <div className="absolute top-32 right-[-60px] w-60 h-60 rounded-full bg-[#F7A1B3]/20 blur-3xl" />

        <div className="relative z-10">

          <div className="flex justify-center mb-7">
            <div className="w-16 h-16 rounded-full bg-[#F7A1B3]/25 flex items-center justify-center">
              <Heart size={30} className="text-[#F16D7A]" />
            </div>
          </div>

          <p className="text-[#87A93D] tracking-[0.35em] uppercase text-xs font-semibold mb-5">
            Your Culinary Collection
          </p>

          <h1 className="font-serif text-6xl md:text-8xl font-normal text-[#53652C] tracking-tight mb-6">
            Favorites<span className="text-[#F16D7A]">.</span>
          </h1>

          <p className="max-w-xl mx-auto text-[#88816F] text-base md:text-lg font-light leading-8">
            Every recipe tells a story. Keep the flavors
            you love close to your heart.
          </p>

          <div className="flex justify-center items-center gap-3 mt-8">
            <span className="h-px w-12 bg-[#C6D97A]" />
            <Sparkles size={17} className="text-[#F16D7A]" />
            <span className="h-px w-12 bg-[#C6D97A]" />
          </div>

          <div className="inline-flex items-center gap-2 mt-7 px-5 py-2 rounded-full bg-white border border-[#C6D97A]/50 shadow-sm">
            <Heart size={15} className="text-[#F16D7A]" />
            <span className="text-sm text-[#53652C]">
              {favorites.length} Saved Recipes
            </span>
          </div>

        </div>
      </section>

      {/* Loading */}
      {loading ? (
        <div className="py-32 text-center">
          <div className="w-12 h-12 border-4 border-[#C6D97A] border-t-[#F16D7A] rounded-full animate-spin mx-auto mb-5" />
          <p className="text-[#87A93D] tracking-widest text-sm">
            Preparing your collection...
          </p>
        </div>

      ) : favorites.length === 0 ? (

        /* Empty Collection */
        <section className="max-w-xl mx-auto px-6 py-16 text-center">

          <div className="w-28 h-28 bg-[#F7A1B3]/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Utensils size={42} className="text-[#F16D7A]" />
          </div>

          <p className="uppercase tracking-[0.3em] text-xs text-[#87A93D] mb-4">
            A New Adventure Awaits
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-[#53652C] italic mb-5">
            Your table is waiting...
          </h2>

          <p className="text-[#88816F] leading-7 mb-9">
            You haven't saved any recipes yet.
            Discover delicious dishes and add your favorites here.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#F16D7A] text-white px-8 py-4 rounded-full hover:bg-[#E45C69] transition-all shadow-lg shadow-[#F16D7A]/20"
          >
            Explore Recipes <ArrowRight size={18} />
          </Link>

        </section>

      ) : (

        /* Recipe Gallery */
        <section className="max-w-[1500px] mx-auto px-6 lg:px-12">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">

            {favorites.map((recipe, index) => {

              const isLarge = index % 3 === 0;

              return (
                <article
                  key={recipe.id}
                  className={`
                    group relative
                    ${isLarge ? 'md:col-span-7' : 'md:col-span-5'}
                    ${index % 2 !== 0 ? 'md:mt-24' : ''}
                  `}
                >

                  <Link to={`/recipe/${recipe.id}`}>

                    {/* Image */}
                    <div className="relative overflow-hidden rounded-[28px] bg-[#F9E3C7] shadow-lg shadow-[#53652C]/10">

                      <img
                        src={
                          recipe.image?.startsWith('http')
                            ? recipe.image
                            : `/images/${recipe.image}`
                        }
                        alt={recipe.name}
                        loading="lazy"
                        className={`
                          w-full object-cover
                          transition-transform duration-700
                          group-hover:scale-105
                          ${isLarge
                            ? 'h-[360px] md:h-[530px]'
                            : 'h-[320px] md:h-[400px]'
                          }
                        `}
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#394323]/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                      {/* Favorite Icon */}
                      <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md">
                        <Heart
                          size={21}
                          fill="#F16D7A"
                          className="text-[#F16D7A]"
                        />
                      </div>

                      {/* View Recipe */}
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                        <span className="text-white text-xs uppercase tracking-[0.25em]">
                          Discover Recipe
                        </span>
                        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#87A93D] group-hover:bg-[#F16D7A] group-hover:text-white transition-all">
                          <ArrowRight size={20} />
                        </div>
                      </div>

                    </div>

                    {/* Recipe Information */}
                    <div className="mt-6 pb-5 border-b border-[#C6D97A]/50 flex justify-between items-end gap-4">

                      <div>
                        <p className="text-[#F16D7A] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
                          {recipe.country || 'World Cuisine'}
                        </p>

                        <h3 className="font-serif text-3xl md:text-4xl text-[#53652C] group-hover:text-[#F16D7A] transition-colors duration-300">
                          {recipe.name}
                        </h3>
                      </div>

                      <span className="text-[#87A93D] text-xs uppercase tracking-widest whitespace-nowrap">
                        #{index + 1}
                      </span>

                    </div>

                  </Link>

                </article>
              );
            })}

          </div>

        </section>
      )}

      {/* Bottom Decoration */}
      <div className="flex justify-center items-center gap-4 mt-24 opacity-70">
        <span className="w-12 h-px bg-[#C6D97A]" />
        <Heart size={16} className="text-[#F16D7A]" />
        <span className="text-[#87A93D] text-xs tracking-[0.3em] uppercase">
          Made with love
        </span>
        <Heart size={16} className="text-[#F16D7A]" />
        <span className="w-12 h-px bg-[#C6D97A]" />
      </div>

    </div>
  );
}

export default Favorites;