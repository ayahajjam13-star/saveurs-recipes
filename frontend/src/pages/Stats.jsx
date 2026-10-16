import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import RatingStars from '../components/RatingStars';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Stats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/recipes/stats/top-rated`)
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-32 bg-cream dark:bg-dark-bg min-h-screen transition-colors">
        <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-warm-brown/60 dark:text-dark-text/60">Loading stats...</p>
      </div>
    );
  }

  if (!stats) return null;

  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      
      <SEO title="Stats" description="Recipe statistics and top rated recipes." url="/stats" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-warm-brown via-warm-brown to-orange-accent/30 dark:from-dark-card dark:via-dark-card dark:to-orange-accent/20 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-4">
            By the numbers
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4">
            📊 Statistics
          </h1>
          <p className="text-cream/70 text-lg">
            Discover what our community loves most.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 -mt-24 relative z-10">
          <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-4xl mb-2">🍽️</p>
            <p className="font-serif text-4xl font-bold text-orange-accent mb-1">{stats.total_recipes}</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">Recipes</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-4xl mb-2">⭐</p>
            <p className="font-serif text-4xl font-bold text-orange-accent mb-1">{stats.total_ratings}</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">Ratings</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
            <p className="text-4xl mb-2">📈</p>
            <p className="font-serif text-4xl font-bold text-orange-accent mb-1">{stats.average_rating}</p>
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">Average</p>
          </div>
        </div>

        {/* Ratings Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 md:p-8 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 mb-12 transition-colors">
          <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text mb-6">
            ⭐ Ratings Distribution
          </h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = stats.distribution[stars] || 0;
              const percent = stats.total_ratings > 0 ? (count / stats.total_ratings) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-4">
                  <span className="w-16 text-sm font-medium text-warm-brown dark:text-dark-text">
                    {stars} ⭐
                  </span>
                  <div className="flex-1 bg-cream dark:bg-dark-bg rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-accent to-yellow-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percent}%` }}
                    >
                      {count > 0 && (
                        <span className="text-xs font-bold text-white">{count}</span>
                      )}
                    </div>
                  </div>
                  <span className="w-16 text-right text-sm text-warm-brown/60 dark:text-dark-text/60">
                    {percent.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Rated */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-6">
            🏆 Top Rated Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stats.top_rated.map((item, index) => (
              <Link
                key={item.recipe.id}
                to={`/recipe/${item.recipe.id}`}
                className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-warm-brown/5 dark:border-dark-text/5"
              >
                <div className="relative aspect-square overflow-hidden bg-cream dark:bg-dark-bg">
                  {index < 3 && (
                    <div className="absolute top-3 left-3 bg-orange-accent text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">
                      {index + 1}
                    </div>
                  )}
                  <img
                    src={`/images/${item.recipe.image}`}
                    alt={item.recipe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold text-warm-brown dark:text-dark-text group-hover:text-orange-accent transition-colors line-clamp-2 mb-2">
                    {item.recipe.name}
                  </h3>
                  <RatingStars rating={Math.round(item.average)} size="sm" />
                  <p className="text-xs text-warm-brown/60 dark:text-dark-text/60 mt-1">
                    {item.average} ({item.count} reviews)
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most Rated */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-6">
            🔥 Most Rated Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stats.most_rated.map((item) => (
              <Link
                key={item.recipe.id}
                to={`/recipe/${item.recipe.id}`}
                className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-warm-brown/5 dark:border-dark-text/5"
              >
                <div className="relative aspect-square overflow-hidden bg-cream dark:bg-dark-bg">
                  <img
                    src={`/images/${item.recipe.image}`}
                    alt={item.recipe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold text-warm-brown dark:text-dark-text group-hover:text-orange-accent transition-colors line-clamp-2 mb-2">
                    {item.recipe.name}
                  </h3>
                  <p className="text-xs text-warm-brown/60 dark:text-dark-text/60">
                    ⭐ {item.average} · {item.count} reviews
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Stats;