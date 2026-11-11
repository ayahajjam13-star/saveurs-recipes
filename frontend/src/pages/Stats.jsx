
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
  ChefHat,
  RefreshCw,
  Users,
  Award,
} from 'lucide-react';

import RatingStars from '../components/RatingStars';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function getImageUrl(image) {
  if (!image) return '/images/placeholder.jpg';

  return image.startsWith('http') ? image : `/images/${image}`;
}

function RecipeCard({ item, index, type = 'top' }) {
  const recipe = item.recipe;

  if (!recipe) return null;

  const isTop = type === 'top';

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group flex flex-col bg-white rounded-[18px] overflow-hidden border border-[#EDC7B9]/60 hover:border-[#EB9D81] hover:shadow-xl hover:shadow-[#EB9D81]/15 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F8ECE8]">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        <div className="absolute top-3 left-3">
          {isTop && index < 3 ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5A3325] text-white text-xs font-bold shadow-lg">
              <Trophy size={12} />
              #{index + 1}
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[#5A3325] text-xs font-semibold">
              {isTop ? 'Top rated' : 'Popular'}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur shadow-sm">
          <Star size={14} fill="#EABF55" className="text-[#EABF55]" />
          <span className="text-sm font-bold text-[#5A3325]">
            {Number(item.average || 0).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A45F45] mb-2">
          {isTop ? 'Community favorite' : 'Reader favorite'}
        </p>

        <h3 className="text-lg font-bold text-[#5A3325] leading-snug line-clamp-2 group-hover:text-[#98543B] transition-colors min-h-[3.5rem]">
          {recipe.name}
        </h3>

        <div className="mt-4">
          {isTop && (
            <RatingStars rating={Math.round(Number(item.average || 0))} size="sm" />
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#F4E9E5]">
          <div className="flex items-center gap-1.5 text-xs text-[#998178]">
            <MessageCircle size={14} />
            <span>{item.count || 0} reviews</span>
          </div>

          <span className="w-8 h-8 rounded-full bg-[#F8ECE8] flex items-center justify-center text-[#98543B] group-hover:bg-[#5A3325] group-hover:text-white transition-all">
            <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    setError(false);

    axios.get(`${API_URL}/recipes/stats/top-rated`)
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FBF6F4] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-16 h-16 rounded-[18px] bg-[#F6E4DE] flex items-center justify-center mx-auto mb-5 animate-pulse">
            <BarChart3 size={30} className="text-[#98543B]" />
          </div>
          <p className="text-sm font-semibold text-[#5A3325]">
            Preparing your statistics...
          </p>
          <div className="w-36 h-1.5 rounded-full bg-[#F0E3DE] overflow-hidden mt-4 mx-auto">
            <div className="h-full w-1/2 rounded-full bg-[#EB9D81] animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="min-h-screen bg-[#FBF6F4] flex items-center justify-center px-5">
        <div className="max-w-md w-full bg-white rounded-[18px] p-10 text-center border border-[#EDC7B9] shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#ECE0CD]/40 flex items-center justify-center mx-auto mb-5">
            <BarChart3 size={30} className="text-[#9D8869]" />
          </div>
          <h2 className="text-2xl font-bold text-[#5A3325] mb-3">
            Statistics unavailable
          </h2>
          <p className="text-sm text-[#998178] leading-7 mb-7">
            We couldn't load the recipe statistics. Please try again.
          </p>
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5A3325] text-white font-semibold text-sm hover:bg-[#794836] transition-colors"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const distribution = stats.distribution || {};
  const topRated = stats.top_rated || [];
  const mostRated = stats.most_rated || [];

  const totalRatings = Number(stats.total_ratings || 0);
  const averageRating = Number(stats.average_rating || 0);

  const ratingColors = {
    5: '#98543B',
    4: '#EB9D81',
    3: '#E6D6C6',
    2: '#ECE0CD',
    1: '#CEB898',
  };

  const globalStats = [
    {
      label: 'Total recipes',
      number: stats.total_recipes ?? 0,
      icon: Utensils,
      description: 'Recipes on Saveurs',
      accent: '#98543B',
      background: '#EDC7B9',
    },
    {
      label: 'Total ratings',
      number: totalRatings,
      icon: Star,
      description: 'Community reviews',
      accent: '#9D8869',
      background: '#ECE0CD',
    },
    {
      label: 'Average rating',
      number: averageRating.toFixed(1),
      icon: TrendingUp,
      description: 'Out of 5 stars',
      accent: '#968473',
      background: '#E6D6C6',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FBF6F4] text-[#5A3325] overflow-hidden">
      <SEO
        title="Stats"
        description="Recipe statistics and top rated recipes."
        url="/stats"
      />

      {/* HERO */}
      <section className="relative px-5 pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#EDC7B9]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#E6D6C6]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EDC7B9] text-[#98543B] text-xs font-bold tracking-wider mb-7 shadow-sm">
                <Sparkles size={15} />
                THE SAVEURS COMMUNITY
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#5A3325]">
                A little taste
                <br />
                of our
                <span className="relative inline-block ml-3 text-[#98543B]">
                  success.
                  <span className="absolute left-0 bottom-0 w-full h-2 bg-[#EB9D81]/50 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[#8C6F65] leading-8 text-base md:text-lg">
                Numbers, flavors and community love. Explore the recipes
                everyone is talking about and see what makes Saveurs special.
              </p>

              <div className="flex flex-wrap gap-3 mt-9">
                <a
                  href="#community"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5A3325] text-white text-sm font-bold hover:bg-[#794836] transition-all shadow-lg shadow-[#5A3325]/15"
                >
                  Explore statistics
                  <ArrowRight size={17} />
                </a>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#EDC7B9] text-[#5A3325] text-sm font-bold hover:bg-[#F8ECE8] transition-all"
                >
                  <ChefHat size={17} />
                  Discover recipes
                </Link>
              </div>
            </div>

            <div className="relative max-w-md w-full mx-auto">
              <div className="absolute -top-7 -right-5 w-20 h-20 rounded-full bg-[#ECE0CD]/70 blur-xl" />
              <div className="absolute -bottom-8 -left-5 w-24 h-24 rounded-full bg-[#EB9D81]/50 blur-xl" />

              <div className="relative bg-white rounded-[18px] p-6 sm:p-8 border border-[#EDC7B9] shadow-[0_25px_70px_rgba(90,51,37,0.10)] rotate-1">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-xs text-[#998178] font-semibold uppercase tracking-wider">
                      Community score
                    </p>
                    <h3 className="text-xl font-bold mt-1">Recipe ratings</h3>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#EDC7B9]/50 flex items-center justify-center">
                    <Award size={23} className="text-[#98543B]" />
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-28 h-28 rounded-full bg-[#F8ECE8] border-[9px] border-[#EB9D81] flex flex-col items-center justify-center shrink-0">
                    <span className="text-3xl font-black text-[#5A3325]">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-[#998178] font-semibold">
                      OUT OF 5
                    </span>
                  </div>

                  <div>
                    <RatingStars
                      rating={Math.round(averageRating)}
                      size="sm"
                    />
                    <p className="text-sm font-bold mt-2">
                      Community rating
                    </p>
                    <p className="text-xs text-[#998178] mt-1">
                      Based on {totalRatings} reviews
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#F4E9E5] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#98543B]">
                    <Users size={17} />
                    <span className="text-xs font-semibold">Made with love</span>
                  </div>
                  <Heart size={19} className="text-[#CEB898]" fill="#ECE0CD" />
                </div>
              </div>

              <div className="absolute -bottom-5 -right-3 bg-[#5A3325] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 -rotate-2">
                <Sparkles size={17} className="text-[#EB9D81]" />
                <span className="text-xs font-bold">Good food, good mood!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section id="community" className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 -mt-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {globalStats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group bg-white rounded-[18px] p-6 md:p-7 border border-[#F0E2DD] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.background}80` }}
                  >
                    <Icon size={22} style={{ color: item.accent }} />
                  </div>

                  <span className="text-xs font-bold text-[#C0ABA4]">
                    0{index + 1}
                  </span>
                </div>

                <p className="text-4xl md:text-5xl font-black tracking-tight mt-6 text-[#5A3325]">
                  {item.number}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-xs text-[#AC9992] mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FBF6F4] flex items-center justify-center text-[#98543B] group-hover:bg-[#EDC7B9] transition-colors">
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RATINGS ANALYTICS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#98543B] mb-3">
              UNDERSTANDING OUR COMMUNITY
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              The rating picture
            </h2>
            <p className="text-[#998178] mt-3 max-w-lg leading-7">
              Every star counts. Here's how our community rates the recipes.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-[#F0E2DD] text-sm font-semibold">
            <Star size={17} fill="#EABF55" className="text-[#EABF55]" />
            {totalRatings} total reviews
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
          {/* AVERAGE */}
          <div className="relative overflow-hidden rounded-[18px] bg-[#5A3325] p-8 md:p-10 text-white min-h-[320px] flex flex-col justify-between">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10" />
            <div className="absolute top-10 -right-7 w-40 h-40 rounded-full bg-[#EB9D81]/10 blur-2xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-7">
                <Star size={24} className="text-[#EB9D81]" />
              </div>

              <p className="text-xs text-[#EDC7B9] uppercase tracking-[0.2em] font-bold">
                Overall experience
              </p>

              <div className="flex items-end gap-3 mt-4">
                <span className="text-7xl md:text-8xl font-black tracking-tight">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-white/50 mb-3">/ 5</span>
              </div>

              <RatingStars
                rating={Math.round(averageRating)}
                size="sm"
              />
            </div>

            <div className="relative flex items-center justify-between mt-10 pt-5 border-t border-white/15">
              <span className="text-sm text-white/65">Average community rating</span>
              <TrendingUp size={21} className="text-[#EB9D81]" />
            </div>
          </div>

          {/* DISTRIBUTION */}
          <div className="bg-white rounded-[18px] p-7 md:p-10 border border-[#F0E2DD] shadow-sm">
            <div className="flex items-center justify-between mb-9">
              <div>
                <h3 className="text-xl font-bold">Rating distribution</h3>
                <p className="text-xs text-[#AC9992] mt-1">
                  Breakdown of all submitted ratings
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-[#F8ECE8] flex items-center justify-center">
                <BarChart3 size={21} className="text-[#98543B]" />
              </div>
            </div>

            <div className="space-y-6">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = Number(distribution[stars] || 0);
                const percent = totalRatings > 0
                  ? (count / totalRatings) * 100
                  : 0;

                return (
                  <div key={stars}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm w-3">{stars}</span>
                        <Star
                          size={15}
                          fill="#EABF55"
                          className="text-[#EABF55]"
                        />
                        <span className="text-xs text-[#AC9992]">
                          {stars === 5 ? 'Excellent' :
                            stars === 4 ? 'Very good' :
                              stars === 3 ? 'Good' :
                                stars === 2 ? 'Fair' : 'Poor'}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[#8C6F65] tabular-nums">
                        {count} · {percent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[#F7F2F0] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
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

      {/* TOP RATED */}
      <section className="py-20 md:py-24 bg-[#F8EEEA]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#98543B] text-xs font-bold mb-4">
                <Trophy size={14} />
                THE BEST OF SAVEURS
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Top rated recipes
              </h2>
              <p className="text-[#998178] mt-3">
                The recipes that earned the highest love from our community.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[#98543B]">
              <Sparkles size={17} />
              Community favorites
            </div>
          </div>

          {topRated.length === 0 ? (
            <div className="bg-white rounded-[18px] p-12 text-center border border-[#EDC7B9]">
              <ChefHat size={35} className="text-[#98543B] mx-auto mb-4" />
              <p className="font-semibold text-[#5A3325]">
                No top rated recipes available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {topRated.map((item, index) => (
                <RecipeCard
                  key={item.recipe?.id || index}
                  item={item}
                  index={index}
                  type="top"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MOST RATED */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECE0CD]/40 text-[#9D8869] text-xs font-bold mb-4">
              <Flame size={14} />
              MOST TALKED ABOUT
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Most rated recipes
            </h2>

            <p className="text-[#998178] mt-3">
              The recipes that received the most community feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#9D8869] font-semibold">
            <MessageCircle size={17} />
            Readers' choices
          </div>
        </div>

        {mostRated.length === 0 ? (
          <div className="bg-white rounded-[18px] p-12 text-center border border-[#F0E2DD]">
            <Heart size={35} className="text-[#CEB898] mx-auto mb-4" />
            <p className="font-semibold text-[#5A3325]">
              No rated recipes available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {mostRated.map((item, index) => (
              <RecipeCard
                key={item.recipe?.id || index}
                item={item}
                index={index}
                type="popular"
              />
            ))}
          </div>
        )}
      </section>

      {/* FINAL SECTION */}
      <section className="px-5 pb-16">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[18px] bg-[#5A3325] px-7 py-16 md:px-16 md:py-20 text-center">
          <div className="absolute -top-28 -left-20 w-80 h-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -right-20 w-96 h-96 rounded-full border border-white/10" />
          <div className="absolute top-0 right-1/4 w-52 h-52 bg-[#EB9D81]/10 rounded-full blur-3xl" />

          <div className="relative max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-[18px] bg-white/10 flex items-center justify-center mx-auto mb-7">
              <ChefHat size={30} className="text-[#EB9D81]" />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#EDC7B9] font-bold mb-4">
              YOUR NEXT FAVORITE IS WAITING
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Let's make something delicious.
            </h2>

            <p className="text-white/65 leading-7 mt-5 mb-9">
              Explore new flavors, discover inspiring recipes and share
              your love for good food with the Saveurs community.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#EDC7B9] text-[#5A3325] font-bold text-sm hover:bg-[#EB9D81] hover:-translate-y-1 transition-all shadow-lg"
            >
              <Utensils size={18} />
              Explore recipes
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Stats;
