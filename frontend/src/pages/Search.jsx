import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { searchRecipes, getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Search() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams(); // باش نقراو ?q=... من الرابط
  const [searchMode, setSearchMode] = useState('name');
  const [query, setQuery] = useState('');
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const cuisines = ['All', ...new Set(allRecipes.map(r => r.cuisine))].sort();
  const seasonKeys = ['All', 'Autumn', 'Winter', 'Spring', 'Summer'];

  // 🔥 هاد الـ useEffect كيقرا الكلمة المفتاحية من الرابط ويبحث بها
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setLoading(true);
      searchRecipes(q)
        .then(res => {
          setResults(res.data);
          setLoading(false);
          setSearched(true);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      getRecipes()
        .then(res => {
          setAllRecipes(res.data);
          setResults(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchMode !== 'name') return;
    
    let filtered = [...results];

    if (selectedSeason !== 'All') {
      filtered = filtered.filter(r => r.season === selectedSeason);
    }

    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(r => r.cuisine === selectedCuisine);
    }

    if (sortBy === 'az') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setResults(filtered);
  }, [selectedSeason, selectedCuisine, sortBy, searchMode]);

  const handleNameSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults(allRecipes);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await searchRecipes(query);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientSearch = async (e) => {
    e.preventDefault();
    if (!ingredientQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await axios.get(`${API_URL}/recipes/search-by-ingredients`, {
        params: { ingredients: ingredientQuery },
      });
      setResults(res.data.recipes || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    setIngredientQuery('');
    setSelectedSeason('All');
    setSelectedCuisine('All');
    setSortBy('default');
    setResults(allRecipes);
    setSearched(false);
  };

  const hasActiveFilters = selectedSeason !== 'All' || selectedCuisine !== 'All' || sortBy !== 'default' || query || ingredientQuery;

  return (
    <div className="animate-fade-in bg-[#FAF7F0] dark:bg-dark-bg min-h-screen transition-colors">
      
      <SEO title="Search" description="Search through 120 recipes from around the world." url="/search" />

      <section className="bg-[#1A1A1A] dark:bg-dark-card py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-guava-pink font-medium tracking-widest uppercase text-sm mb-4">
            Find your next meal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
            {t('search.title') || 'Search Recipes'}
          </h1>
          <p className="text-gray-300 text-lg mb-8">{t('search.subtitle') || 'Search through 120 recipes from around the world.'}</p>

          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => { setSearchMode('name'); clearAllFilters(); }}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                searchMode === 'name'
                  ? 'bg-guava-pink text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🔍 By Name
            </button>
            <button
              onClick={() => { setSearchMode('ingredients'); clearAllFilters(); }}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                searchMode === 'ingredients'
                  ? 'bg-guava-pink text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🥕 By Ingredients
            </button>
          </div>

          {searchMode === 'name' ? (
            <form onSubmit={handleNameSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder') || 'e.g. chicken, pasta, tagine...'}
                  className="w-full pl-16 pr-36 py-5 rounded-[24px] border-none bg-white dark:bg-dark-card text-warm-brown dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-guava-pink text-lg shadow-soft transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 px-8 bg-guava-pink text-white rounded-xl hover:bg-guava-pink/90 transition-colors font-semibold">
                  {t('search.button') || 'Search'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleIngredientSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🥕</div>
                <input
                  type="text"
                  value={ingredientQuery}
                  onChange={(e) => setIngredientQuery(e.target.value)}
                  placeholder="e.g. chicken, tomatoes, onion..."
                  className="w-full pl-16 pr-36 py-5 rounded-[24px] border-none bg-white dark:bg-dark-card text-warm-brown dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-guava-pink text-lg shadow-soft transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 px-8 bg-guava-pink text-white rounded-xl hover:bg-guava-pink/90 transition-colors font-semibold">
                  Search
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {searchMode === 'name' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white dark:bg-dark-card rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-800 p-6 transition-colors">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-brown dark:text-white mb-2">
                  🍂 {t('search.season') || 'Season'}
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-warm-brown dark:text-white focus:outline-none focus:ring-2 focus:ring-guava-pink transition-all"
                >
                  {seasonKeys.map(s => (
                    <option key={s} value={s}>
                      {s === 'All' ? (t('search.all') || 'All') : t(`seasons.${s}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-brown dark:text-white mb-2">
                  🍴 {t('search.cuisine') || 'Cuisine'}
                </label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-warm-brown dark:text-white focus:outline-none focus:ring-2 focus:ring-guava-pink transition-all"
                >
                  {cuisines.map(c => (
                    <option key={c} value={c}>
                      {c === 'All' ? (t('search.all') || 'All') : c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-brown dark:text-white mb-2">
                  🔤 {t('search.sortBy') || 'Sort by'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-warm-brown dark:text-white focus:outline-none focus:ring-2 focus:ring-guava-pink transition-all"
                >
                  <option value="default">Default</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-sm">
                  {query && <span className="px-3 py-1 bg-guava-pink/10 text-guava-pink rounded-full">Search: {query}</span>}
                  {selectedSeason !== 'All' && <span className="px-3 py-1 bg-guava-pink/10 text-guava-pink rounded-full">{t(`seasons.${selectedSeason}`)}</span>}
                  {selectedCuisine !== 'All' && <span className="px-3 py-1 bg-guava-pink/10 text-guava-pink rounded-full">{selectedCuisine}</span>}
                </div>
                <button onClick={clearAllFilters} className="text-gray-500 hover:text-guava-pink transition-colors text-sm font-medium">
                  Clear All ✕
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <EmptyState
            icon={searchMode === 'ingredients' ? '🥕' : '🔍'}
            title={searchMode === 'ingredients' ? 'No recipes found with these ingredients' : (t('search.noResults') || 'No recipes found')}
            description={searchMode === 'ingredients' ? 'Try fewer ingredients or different ones' : (t('search.noResultsText') || 'Try different keywords or clear your filters.')}
            actionLabel={t('search.clearFilters') || 'Clear Filters'}
            onAction={clearAllFilters}
          />
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-guava-pink font-medium tracking-widest uppercase text-sm mb-2">
                  {t('search.results') || 'Results'}
                </p>
                <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-white">
                  {results.length} {(t('search.recipesFound') || 'recipes found')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}

      </section>
    </div>
  );
}

export default Search;