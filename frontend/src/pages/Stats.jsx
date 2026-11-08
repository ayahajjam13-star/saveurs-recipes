
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart3,
  Utensils,
  Star,
  TrendingUp,
  Trophy,
  Flame,
  Heart,
  Sparkles,
  ArrowRight,
  MessageCircle,
  ChefHat
} from 'lucide-react';

import RatingStars from '../components/RatingStars';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function getImageUrl(image) {
  if (!image) return '/images/placeholder.jpg';

  return image.startsWith('http')
    ? image
    : `/images/${image}`;
}

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/recipes/stats/top-rated`)
      .then(res => {
        setStats(res.data);
        setError(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#C6D97A] border-t-[#F16D7A] rounded-full animate-spin mx-auto" />
          <p className="mt-5 text-[#87A93D] tracking-widest text-xs uppercase">
            Discovering the numbers...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <BarChart3 size={55} className="text-[#F16D7A] mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-[#53652C] mb-4">
            Statistics unavailable
          </h2>
          <p className="text-[#88816F] mb-7">
            We couldn't load the recipe statistics. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#87A93D] text-white rounded-full hover:bg-[#6E8C2D] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const distribution = stats.distribution || {};
  const topRated = stats.top_rated || [];
  const mostRated = stats.most_rated || [];

  const maxDist = Math.max(
    ...Object.values(distribution).map(Number),
    1
  );

  const ratingColors = {
    5: '#87A93D',
    4: '#A9C45B',
    3: '#C6D97A',
    2: '#F7A1B3',
    1: '#F16D7A',
  };

  const globalStats = [
    {
      number: stats.total_recipes ?? 0,
      label: 'Total Recipes',
      icon: Utensils,
      color: 'bg-[#C6D97A]/25',
      iconColor: 'text-[#87A93D]',
    },
    {
      number: stats.total_ratings ?? 0,
      label: 'Total Ratings',
      icon: Star,
      color: 'bg-[#F7A1B3]/25',
      iconColor: 'text-[#F16D7A]',
    },
    {
      number: stats.average_rating ?? 0,
      label: 'Average Rating',
      icon: TrendingUp,
      color: 'bg-[#F9E3C7]',
      iconColor: 'text-[#87A93D]',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FDF8F0] text-[#394323] overflow-hidden">

      <SEO
        title="Stats"
        description="Recipe statistics and top rated recipes."
        url="/stats"
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#53652C] py-24 md:py-32 px-6">

        <div className="absolute top-[-80px] right-[-50px] w-80 h-80 rounded-full bg-[#C6D97A]/20 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-50px] w-80 h-80 rounded-full bg-[#F7A1B3]/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <BarChart3 size={32} className="text-[#F7A1B3]" />
          </div>

          <p className="text-[#C6D97A] uppercase tracking-[0.35em] text-xs font-semibold mb-5">
            By The Numbers
          </p>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            Statistics<span className="text-[#F7A1B3]">.</span>
          </h1>

          <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto leading-8">
            Discover the recipes our community loves,
            explore ratings and celebrate culinary creativity.
          </p>

          <div className="flex justify-center items-center gap-3 mt-8">
            <span className="w-12 h-px bg-[#C6D97A]" />
            <Heart size={17} className="text-[#F7A1B3]" />
            <span className="w-12 h-px bg-[#C6D97A]" />
          </div>

        </div>
      </section>

      {/* GLOBAL STATISTICS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 -mt-10 relative z-10">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {globalStats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-[25px] p-7 md:p-9 text-center shadow-lg shadow-[#53652C]/5 border border-[#C6D97A]/20 hover:-translate-y-2 transition-all duration-500"
              >

                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon size={29} className={item.iconColor} />
                </div>

                <p className="font-serif text-4xl md:text-5xl text-[#53652C] mb-3">
                  {item.number}
                </p>

                <p className="text-xs text-[#88816F] uppercase tracking-[0.2em]">
                  {item.label}
                </p>

              </div>
            );
          })}

        </div>
      </section>

      {/* RATING DISTRIBUTION */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Introduction */}
          <div>

            <p className="text-[#F16D7A] uppercase tracking-[0.3em] text-xs font-semibold mb-5">
              Community Feedback
            </p>

            <h2 className="font-serif text-4xl md:text-5xl text-[#53652C] leading-tight mb-6">
              Ratings Distribution
            </h2>

            <p className="text-[#88816F] leading-8 mb-8 max-w-lg">
              Every rating tells a story. Discover how our
              community evaluates the recipes shared on Saveurs.
            </p>

            <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#C6D97A]/20 shadow-sm max-w-sm">

              <div className="w-12 h-12 bg-[#F9E3C7] rounded-xl flex items-center justify-center">
                <Star size={25} className="text-[#87A93D]" />
              </div>

              <div>
                <p className="font-serif text-3xl text-[#53652C]">
                  {stats.average_rating ?? 0}
                  <span className="text-[#88816F] text-base"> / 5</span>
                </p>
                <p className="text-xs text-[#88816F]">
                  Average community rating
                </p>
              </div>

            </div>

          </div>

          {/* Rating Bars */}
          <div className="bg-white rounded-[28px] p-7 md:p-9 shadow-sm border border-[#C6D97A]/20">

            <div className="flex items-center justify-between mb-8">

              <h3 className="font-serif text-2xl text-[#53652C]">
                Rating Overview
              </h3>

              <span className="px-4 py-2 bg-[#F9E3C7] rounded-full text-xs text-[#53652C]">
                {stats.total_ratings ?? 0} Reviews
              </span>

            </div>

            <div className="space-y-6">

              {[5, 4, 3, 2, 1].map(stars => {

                const count = Number(distribution[stars] || 0);

                const percent = stats.total_ratings > 0
                  ? (count / stats.total_ratings) * 100
                  : 0;

                return (
                  <div key={stars}>

                    <div className="flex items-center justify-between mb-2">

                      <div className="flex items-center gap-2">

                        <span className="font-semibold text-[#53652C]">
                          {stars}
                        </span>

                        <Star
                          size={15}
                          fill="#F1C75B"
                          className="text-[#F1C75B]"
                        />

                      </div>

                      <span className="text-xs text-[#88816F]">
                        {count} ratings · {percent.toFixed(1)}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-[#F9E3C7]/60 rounded-full overflow-hidden">

                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: ratingColors[stars],
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

      {/* TOP RATED RECIPES */}
      <section className="bg-[#F9E3C7]/30 py-24 px-5 md:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">

            <div>

              <div className="flex items-center gap-3 mb-5">
                <Trophy size={20} className="text-[#F16D7A]" />
                <p className="text-[#F16D7A] uppercase tracking-[0.3em] text-xs font-semibold">
                  Community Favorites
                </p>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl text-[#53652C]">
                Top Rated Recipes
              </h2>

              <p className="text-[#88816F] mt-4">
                The most loved recipes by our community.
              </p>

            </div>

            <div className="flex items-center gap-2 text-[#87A93D] text-sm">
              <Sparkles size={17} />
              <span>Our community's best</span>
            </div>

          </div>

          {topRated.length === 0 ? (

            <p className="text-center py-12 text-[#88816F]">
              No top rated recipes available yet.
            </p>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

              {topRated.map((item, index) => (

                <Link
                  key={item.recipe.id}
                  to={`/recipe/${item.recipe.id}`}
                  className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-[#C6D97A]/20"
                >

                  <div className="relative aspect-square overflow-hidden bg-[#F9E3C7]">

                    <img
                      src={getImageUrl(item.recipe.image)}
                      alt={item.recipe.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />

                    {index < 3 && (
                      <div className="absolute top-4 left-4 w-10 h-10 bg-[#87A93D] text-white rounded-full flex items-center justify-center font-serif text-lg shadow-lg">
                        {index + 1}
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-1">
                      <Star size={14} fill="#F1C75B" className="text-[#F1C75B]" />
                      <span className="text-xs font-bold text-[#53652C]">
                        {Number(item.average || 0).toFixed(1)}
                      </span>
                    </div>

                  </div>

                  <div className="p-5">

                    <p className="text-[10px] text-[#F16D7A] uppercase tracking-[0.2em] mb-3">
                      {index === 0 ? 'Community Choice' : 'Top Rated'}
                    </p>

                    <h3 className="font-serif text-xl text-[#53652C] group-hover:text-[#F16D7A] transition-colors line-clamp-2 mb-4">
                      {item.recipe.name}
                    </h3>

                    <RatingStars
                      rating={Math.round(item.average)}
                      size="sm"
                    />

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#C6D97A]/30">

                      <span className="text-xs text-[#88816F]">
                        {item.count} reviews
                      </span>

                      <ArrowRight
                        size={17}
                        className="text-[#87A93D] group-hover:translate-x-1 transition-transform"
                      />

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}

        </div>
      </section>

      {/* MOST RATED RECIPES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">

        <div className="mb-12">

          <div className="flex items-center gap-3 mb-5">
            <Flame size={21} className="text-[#F16D7A]" />
            <p className="text-[#F16D7A] uppercase tracking-[0.3em] text-xs font-semibold">
              Popular Choices
            </p>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#53652C]">
            Most Rated Recipes
          </h2>

          <p className="text-[#88816F] mt-4">
            Recipes that received the most community feedback.
          </p>

        </div>

        {mostRated.length === 0 ? (

          <p className="text-center py-12 text-[#88816F]">
            No rated recipes available yet.
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

            {mostRated.map((item) => (

              <Link
                key={item.recipe.id}
                to={`/recipe/${item.recipe.id}`}
                className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-[#C6D97A]/20"
              >

                <div className="relative aspect-square overflow-hidden bg-[#F9E3C7]">

                  <img
                    src={getImageUrl(item.recipe.image)}
                    alt={item.recipe.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  <div className="absolute top-4 right-4 bg-[#F16D7A] text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <MessageCircle size={14} />
                    <span className="text-xs font-semibold">
                      {item.count}
                    </span>
                  </div>

                </div>

                <div className="p-5">

                  <p className="text-[10px] text-[#87A93D] uppercase tracking-[0.2em] mb-3">
                    Most Reviewed
                  </p>

                  <h3 className="font-serif text-xl text-[#53652C] group-hover:text-[#F16D7A] transition-colors line-clamp-2 mb-4">
                    {item.recipe.name}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-[#C6D97A]/30">

                    <div>
                      <p className="text-xs text-[#88816F] mb-1">
                        Average Rating
                      </p>

                      <p className="font-serif text-xl text-[#53652C]">
                        {Number(item.average || 0).toFixed(1)}
                        <span className="text-sm text-[#88816F]"> / 5</span>
                      </p>
                    </div>

                    <RatingStars
                      rating={Math.round(item.average)}
                      size="sm"
                    />

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#53652C] py-24 px-6">

        <div className="absolute top-[-100px] right-[-50px] w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute bottom-[-120px] left-[-50px] w-80 h-80 rounded-full border border-white/10" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">

          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
            <ChefHat size={30} className="text-[#F7A1B3]" />
          </div>

          <p className="text-[#C6D97A] uppercase tracking-[0.3em] text-xs font-semibold mb-5">
            Explore & Enjoy
          </p>

          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
            Discover Your Next Favorite
          </h2>

          <p className="text-white/70 leading-8 mb-10 max-w-xl mx-auto">
            Explore delicious recipes from around the world
            and become part of our culinary community.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#F16D7A] text-white rounded-full font-semibold hover:bg-[#E45C69] hover:scale-105 transition-all shadow-xl"
          >
            <Utensils size={19} />
            Explore Recipes
            <ArrowRight size={19} />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Stats;