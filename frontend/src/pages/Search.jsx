
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, Carrot, SlidersHorizontal, X, Sparkles } from 'lucide-react';

import { searchRecipes, getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Search() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [searchMode, setSearchMode] = useState('name');
  const [query, setQuery] = useState('');
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const seasonKeys = ['All', 'Autumn', 'Winter', 'Spring', 'Summer'];

  const cuisines = [
    'All',
    ...new Set(allRecipes.map(r => r.cuisine).filter(Boolean))
  ].sort();

  // Read search query from URL
  useEffect(() => {
    const q = searchParams.get('q');

    if (q) {
      setQuery(q);
      setLoading(true);

      searchRecipes(q)
        .then(res => setResults(res.data))
        .catch(err => {
          console.error(err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    } else {
      getRecipes()
        .then(res => {
          setAllRecipes(res.data);
          setResults(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [searchParams]);

  // Filter and sort without modifying original results
  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (searchMode === 'name') {
      if (selectedSeason !== 'All') {
        filtered = filtered.filter(
          r => r.season === selectedSeason
        );
      }

      if (selectedCuisine !== 'All') {
        filtered = filtered.filter(
          r => r.cuisine === selectedCuisine
        );
      }

      if (sortBy === 'az') {
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      } else if (sortBy === 'za') {
        filtered.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      }
    }

    return filtered;
  }, [results, selectedSeason, selectedCuisine, sortBy, searchMode]);

  const handleNameSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setResults(allRecipes);
      return;
    }

    setLoading(true);

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

    try {
      const res = await axios.get(
        `${API_URL}/recipes/search-by-ingredients`,
        { params: { ingredients: ingredientQuery } }
      );

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
  };

  const hasActiveFilters =
    selectedSeason !== 'All' ||
    selectedCuisine !== 'All' ||
    sortBy !== 'default' ||
    query ||
    ingredientQuery;

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#242B1D] transition-colors duration-500">

      <SEO
        title="Search"
        description="Discover delicious seasonal recipes from around the world."
        url="/search"
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#354322] py-20 md:py-28 px-4">

        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#87A93D] rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-[#F16D7A] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#C6D97A] text-xs tracking-[0.25em] uppercase mb-7">
            <Sparkles size={15} />
            Discover something delicious
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-[#FFF9F2] font-light mb-6">
            Find Your
            <span className="block italic text-[#F7A1B3]">
              Next Favorite
            </span>
          </h1>

          <p className="text-[#FFF9F2]/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Explore beautiful recipes, discover new flavors
            and find inspiration for every season.
          </p>

          {/* SEARCH MODE */}
          <div className="inline-flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 mb-8">

            <button
              onClick={() => {
                setSearchMode('name');
                setResults(allRecipes);
                setIngredientQuery('');
                setSelectedSeason('All');
                setSelectedCuisine('All');
                setSortBy('default');
              }}
              className={`flex items-center gap-2 px-5 md:px-7 py-3 rounded-xl text-sm font-medium transition-all ${
                searchMode === 'name'
                  ? 'bg-[#F16D7A] text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <SearchIcon size={17} />
              By Name
            </button>

            <button
              onClick={() => {
                setSearchMode('ingredients');
                setResults([]);
                setQuery('');
                setSelectedSeason('All');
                setSelectedCuisine('All');
                setSortBy('default');
              }}
              className={`flex items-center gap-2 px-5 md:px-7 py-3 rounded-xl text-sm font-medium transition-all ${
                searchMode === 'ingredients'
                  ? 'bg-[#F16D7A] text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Carrot size={17} />
              By Ingredients
            </button>

          </div>

          {/* NAME SEARCH */}
          {searchMode === 'name' && (
            <form
              onSubmit={handleNameSearch}
              className="max-w-2xl mx-auto"
            >
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2">

                <SearchIcon
                  className="ml-4 text-[#87A93D] flex-shrink-0"
                  size={22}
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chicken, pasta, tagine..."
                  className="flex-1 min-w-0 px-4 py-4 bg-transparent text-[#354322] placeholder:text-gray-400 focus:outline-none text-sm md:text-base"
                />

                <button
                  type="submit"
                  className="bg-[#F16D7A] hover:bg-[#E75B69] text-white px-5 md:px-8 py-4 rounded-xl font-semibold transition-all shadow-md"
                >
                  Search
                </button>

              </div>
            </form>
          )}

          {/* INGREDIENT SEARCH */}
          {searchMode === 'ingredients' && (
            <form
              onSubmit={handleIngredientSearch}
              className="max-w-2xl mx-auto"
            >
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2">

                <Carrot
                  className="ml-4 text-[#87A93D] flex-shrink-0"
                  size={22}
                />

                <input
                  type="text"
                  value={ingredientQuery}
                  onChange={(e) => setIngredientQuery(e.target.value)}
                  placeholder="Chicken, tomatoes, onion..."
                  className="flex-1 min-w-0 px-4 py-4 bg-transparent text-[#354322] placeholder:text-gray-400 focus:outline-none text-sm md:text-base"
                />

                <button
                  type="submit"
                  className="bg-[#87A93D] hover:bg-[#718F32] text-white px-5 md:px-8 py-4 rounded-xl font-semibold transition-all shadow-md"
                >
                  Find Recipes
                </button>

              </div>
            </form>
          )}

        </div>
      </section>

      {/* FILTERS */}
      {searchMode === 'name' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">

          <div className="bg-white dark:bg-[#303B27] rounded-3xl shadow-xl border border-[#87A93D]/10 p-6 md:p-8">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C6D97A]/25 flex items-center justify-center">
                <SlidersHorizontal className="text-[#87A93D]" size={20} />
              </div>

              <div>
                <h2 className="font-serif text-xl text-[#354322] dark:text-[#F9E3C7]">
                  Refine Your Search
                </h2>
                <p className="text-xs text-gray-400">
                  Find exactly what you're craving
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">

              {/* SEASON */}
              <div>
                <label className="block text-sm font-medium text-[#354322] dark:text-[#F9E3C7] mb-2">
                  🍂 Season
                </label>

                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#87A93D]/20 bg-[#FFF9F2] dark:bg-[#242B1D] text-[#354322] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#87A93D] transition-all"
                >
                  {seasonKeys.map(s => (
                    <option key={s} value={s}>
                      {s === 'All'
                        ? (t('search.all') || 'All Seasons')
                        : t(`seasons.${s}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* CUISINE */}
              <div>
                <label className="block text-sm font-medium text-[#354322] dark:text-[#F9E3C7] mb-2">
                  🍴 Cuisine
                </label>

                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#87A93D]/20 bg-[#FFF9F2] dark:bg-[#242B1D] text-[#354322] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#87A93D] transition-all"
                >
                  {cuisines.map(c => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Cuisines' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* SORT */}
              <div>
                <label className="block text-sm font-medium text-[#354322] dark:text-[#F9E3C7] mb-2">
                  🔤 Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#87A93D]/20 bg-[#FFF9F2] dark:bg-[#242B1D] text-[#354322] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#87A93D] transition-all"
                >
                  <option value="default">Default</option>
                  <option value="az">A - Z</option>
                  <option value="za">Z - A</option>
                </select>
              </div>

            </div>

            {hasActiveFilters && (
              <div className="mt-6 pt-5 border-t border-[#87A93D]/10 flex flex-wrap items-center justify-between gap-3">

                <div className="flex flex-wrap gap-2 text-sm">

                  {query && (
                    <span className="px-3 py-2 bg-[#F7A1B3]/20 text-[#D85D70] rounded-full">
                      Search: {query}
                    </span>
                  )}

                  {selectedSeason !== 'All' && (
                    <span className="px-3 py-2 bg-[#C6D97A]/30 text-[#526D2B] rounded-full">
                      {selectedSeason}
                    </span>
                  )}

                  {selectedCuisine !== 'All' && (
                    <span className="px-3 py-2 bg-[#F9E3C7] text-[#795B3A] rounded-full">
                      {selectedCuisine}
                    </span>
                  )}

                </div>

                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-[#F16D7A] hover:text-[#D85D70] text-sm font-semibold transition-colors"
                >
                  <X size={16} />
                  Clear All
                </button>

              </div>
            )}

          </div>
        </section>
      )}

      {/* RESULTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && filteredResults.length === 0 && (
          <EmptyState
            icon={searchMode === 'ingredients' ? '🥕' : '🔍'}
            title={
              searchMode === 'ingredients'
                ? 'No recipes found with these ingredients'
                : 'No recipes found'
            }
            description={
              searchMode === 'ingredients'
                ? 'Try fewer ingredients or different ones.'
                : 'Try different keywords or clear your filters.'
            }
            actionLabel="Clear Filters"
            onAction={clearAllFilters}
          />
        )}

        {!loading && filteredResults.length > 0 && (
          <>

            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">

              <div>
                <p className="text-[#F16D7A] font-semibold tracking-[0.25em] uppercase text-xs mb-3">
                  Your Discovery
                </p>

                <h2 className="font-serif text-3xl md:text-4xl text-[#354322] dark:text-[#F9E3C7]">
                  {filteredResults.length}
                  <span className="italic text-[#87A93D]"> Recipes Found</span>
                </h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#87A93D]">
                <Sparkles size={17} />
                Made with love
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredResults.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}

            </div>

          </>
        )}

      </section>

    </div>
  );
}

export default Search;
