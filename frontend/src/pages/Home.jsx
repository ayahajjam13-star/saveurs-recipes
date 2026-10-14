import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBySeason } from '../services/api';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [season, setSeason] = useState('Autumn');
  const [loading, setLoading] = useState(true);

  const seasons = [
    { name: 'Autumn', emoji: '🍂', color: 'from-orange-400' },
    { name: 'Winter', emoji: '❄️', color: 'from-blue-400' },
    { name: 'Spring', emoji: '🌸', color: 'from-pink-400' },
    { name: 'Summer', emoji: '☀️', color: 'from-yellow-400' },
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

  return (
    <div className="bg-cream dark:bg-dark-bg transition-colors">
      
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
            alt="Fresh ingredients"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/90 via-warm-brown/70 to-warm-brown/40 dark:from-dark-bg/95 dark:via-dark-bg/80 dark:to-dark-bg/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <span className="text-cream text-sm font-medium tracking-widest uppercase">
              ✨ {t('home.badge')}
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-cream leading-tight mb-6">
            {t('home.title1')}
            <span className="block text-orange-accent italic">{t('home.title2')}</span>
          </h1>

          <p className="text-lg md:text-xl text-cream/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#recipes" className="px-8 py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-all hover:scale-105 shadow-lg shadow-orange-accent/30">
              🍽️ {t('home.browseRecipes')}
            </a>
            <Link to="/search" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-cream rounded-2xl font-semibold hover:bg-white/20 transition-all">
              🔍 {t('home.searchRecipes')}
            </Link>
          </div>
        </div>
      </section>

      {/* Season Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-xl p-4 flex flex-wrap justify-center gap-2 transition-colors">
          {seasons.map(s => (
            <button
              key={s.name}
              onClick={() => setSeason(s.name)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                season === s.name
                  ? `bg-gradient-to-br ${s.color} to-orange-accent text-white shadow-md scale-105`
                  : 'text-warm-brown dark:text-dark-text hover:bg-cream dark:hover:bg-dark-bg'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{t(`seasons.${s.name}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recipes Grid */}
      <section id="recipes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-2">
              {t('home.featured')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown dark:text-dark-text">
              {seasons.find(s => s.name === season)?.emoji} {t('home.seasonRecipes', { season: t(`seasons.${season}`) })}
            </h2>
          </div>
          <p className="hidden md:block text-warm-brown/60 dark:text-dark-text/60">
            {recipes.length} {t('home.deliciousRecipes')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-warm-brown/5 dark:border-dark-text/5 animate-pulse">
                <div className="aspect-[4/3] bg-cream dark:bg-dark-bg"></div>
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-cream dark:bg-dark-bg rounded w-2/3"></div>
                  <div className="h-5 bg-cream dark:bg-dark-bg rounded w-full"></div>
                  <div className="h-3 bg-cream dark:bg-dark-bg rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;