
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {
  Search as SearchIcon,
  Carrot,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowDownUp,
  Leaf,
  ChefHat,
  Utensils,
  ArrowRight,
  RotateCcw,
  SearchX,
  BookOpen,
  Flower2,
} from 'lucide-react';

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

  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const seasonKeys = ['All', 'Autumn', 'Winter', 'Spring', 'Summer'];

  const cuisines = useMemo(() => {
    return [
      'All',
      ...new Set(allRecipes.map(recipe => recipe.cuisine).filter(Boolean)),
    ].sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a.localeCompare(b);
    });
  }, [allRecipes]);

  // Load recipes and handle URL search
  useEffect(() => {
    let cancelled = false;

    const loadRecipes = async () => {
      setLoading(true);

      try {
        const [recipesResponse, urlQuery] = await Promise.all([
          getRecipes(),
          Promise.resolve(searchParams.get('q')),
        ]);

        if (cancelled) return;

        const recipes = Array.isArray(recipesResponse.data)
          ? recipesResponse.data
          : [];

        setAllRecipes(recipes);

        if (urlQuery?.trim()) {
          setQuery(urlQuery);

          const searchResponse = await searchRecipes(urlQuery);

          if (!cancelled) {
            setResults(Array.isArray(searchResponse.data) ? searchResponse.data : []);
          }
        } else {
          setQuery('');
          setResults(recipes);
        }
      } catch (error) {
        console.error('Error loading recipes:', error);

        if (!cancelled) {
          setAllRecipes([]);
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRecipes();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  // Filter and sort recipes
  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (searchMode === 'name') {
      if (selectedSeason !== 'All') {
        filtered = filtered.filter(
          recipe => recipe.season === selectedSeason
        );
      }

      if (selectedCuisine !== 'All') {
        filtered = filtered.filter(
          recipe => recipe.cuisine === selectedCuisine
        );
      }

      if (sortBy === 'az') {
        filtered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        );
      } else if (sortBy === 'za') {
        filtered.sort((a, b) =>
          (b.name || '').localeCompare(a.name || '')
        );
      }
    }

    return filtered;
  }, [results, selectedSeason, selectedCuisine, sortBy, searchMode]);

  const handleNameSearch = async (e) => {
    e.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      setResults(allRecipes);
      return;
    }

    setLoading(true);

    try {
      const response = await searchRecipes(searchTerm);

      setResults(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error('Name search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientSearch = async (e) => {
    e.preventDefault();

    const ingredients = ingredientQuery.trim();

    if (!ingredients) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/recipes/search-by-ingredients`,
        {
          params: {
            ingredients,
          },
        }
      );

      setResults(response.data.recipes || []);
    } catch (error) {
      console.error('Ingredient search error:', error);
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

  const switchMode = (mode) => {
    setSearchMode(mode);
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
    Boolean(query.trim()) ||
    Boolean(ingredientQuery.trim());

  return (
    <main className="min-h-screen bg-[#F5FAF9] dark:bg-[#172B2E] text-[#24515B] dark:text-[#EAF8F7] transition-colors duration-500">

      <SEO
        title="Search Recipes"
        description="Discover delicious recipes, explore ingredients and find inspiration for your next meal."
        url="/search"
      />

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#DDF5F4] via-[#F2FAF8] to-[#F9EAF2] dark:from-[#1D4145] dark:via-[#1B3539] dark:to-[#3A303E]" />

        <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-[#7ADDF2]/30 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-[#F2C7DB]/40 blur-3xl" />
        <div className="absolute top-20 left-1/2 w-40 h-40 rounded-full bg-[#BFE8C8]/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 md:pt-24 pb-24 md:pb-32">

          <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 items-center">

            {/* LEFT CONTENT */}
            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 shadow-sm mb-8">
                <Sparkles size={15} className="text-[#D18AAE]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#39717A] dark:text-[#B8E8EE]">
                  Your recipe discovery space
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.08] tracking-tight text-[#24515B] dark:text-white mb-6">
                A little search,
                <span className="block italic font-normal text-[#54AEB9] dark:text-[#7ADDF2]">
                  a lot of flavor.
                </span>
              </h1>

              <p className="max-w-lg text-[#55767B] dark:text-[#C2D9D9] text-base md:text-lg leading-8 mb-9">
                Find the recipes you love, explore new ingredients and let your next delicious idea begin here.
              </p>

              {/* SEARCH MODE SWITCH */}
              <div className="inline-flex flex-wrap gap-2 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-white dark:border-white/10 shadow-sm mb-6">

                <button
                  type="button"
                  onClick={() => switchMode('name')}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    searchMode === 'name'
                      ? 'bg-[#24515B] text-white shadow-lg shadow-[#24515B]/20'
                      : 'text-[#55767B] dark:text-[#D1E6E5] hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  <SearchIcon size={17} />
                  Search by name
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('ingredients')}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    searchMode === 'ingredients'
                      ? 'bg-[#24515B] text-white shadow-lg shadow-[#24515B]/20'
                      : 'text-[#55767B] dark:text-[#D1E6E5] hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  <Carrot size={17} />
                  By ingredients
                </button>

              </div>

              {/* SEARCH INPUT */}
              {searchMode === 'name' ? (
                <form
                  onSubmit={handleNameSearch}
                  className="max-w-2xl"
                >
                  <div className="group flex items-center gap-2 bg-white dark:bg-[#29464A] rounded-2xl p-2 shadow-xl shadow-[#24515B]/10 border border-white dark:border-white/10 focus-within:ring-4 focus-within:ring-[#7ADDF2]/30 transition-all">

                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#DDF5F4] dark:bg-[#365D60] flex items-center justify-center">
                      <SearchIcon size={21} className="text-[#398B96] dark:text-[#B8E8EE]" />
                    </div>

                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Try pasta, chicken, tagine..."
                      className="flex-1 min-w-0 bg-transparent outline-none px-2 py-3 text-sm md:text-base text-[#24515B] dark:text-white placeholder:text-[#91A9AA] dark:placeholder:text-[#A7C0C0]"
                    />

                    {query && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('');
                          setResults(allRecipes);
                        }}
                        className="p-2 text-[#91A9AA] hover:text-[#D18AAE]"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 md:px-7 py-4 rounded-xl bg-[#54AEB9] hover:bg-[#398F9A] text-white text-sm font-bold transition-all shadow-md shadow-[#54AEB9]/20"
                    >
                      <span>Search</span>
                      <ArrowRight size={16} />
                    </button>

                  </div>
                </form>
              ) : (
                <form
                  onSubmit={handleIngredientSearch}
                  className="max-w-2xl"
                >
                  <div className="group flex items-center gap-2 bg-white dark:bg-[#29464A] rounded-2xl p-2 shadow-xl shadow-[#24515B]/10 border border-white dark:border-white/10 focus-within:ring-4 focus-within:ring-[#BFE8C8]/40 transition-all">

                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#E5F5E8] dark:bg-[#365B4A] flex items-center justify-center">
                      <Carrot size={21} className="text-[#5E9B70]" />
                    </div>

                    <input
                      type="text"
                      value={ingredientQuery}
                      onChange={(e) => setIngredientQuery(e.target.value)}
                      placeholder="Chicken, tomatoes, onion..."
                      className="flex-1 min-w-0 bg-transparent outline-none px-2 py-3 text-sm md:text-base text-[#24515B] dark:text-white placeholder:text-[#91A9AA] dark:placeholder:text-[#A7C0C0]"
                    />

                    {ingredientQuery && (
                      <button
                        type="button"
                        onClick={() => setIngredientQuery('')}
                        className="p-2 text-[#91A9AA] hover:text-[#D18AAE]"
                        aria-label="Clear ingredients"
                      >
                        <X size={18} />
                      </button>
                    )}

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 md:px-7 py-4 rounded-xl bg-[#72B98A] hover:bg-[#589C70] text-white text-sm font-bold transition-all shadow-md shadow-[#72B98A]/20"
                    >
                      <span>Find recipes</span>
                      <ArrowRight size={16} />
                    </button>

                  </div>
                </form>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-xs text-[#66888C] dark:text-[#B7D0D0]">
                <span className="flex items-center gap-1.5">
                  <Leaf size={14} className="text-[#72B98A]" />
                  Fresh inspiration
                </span>
                <span className="flex items-center gap-1.5">
                  <ChefHat size={14} className="text-[#54AEB9]" />
                  Every kind of cuisine
                </span>
                <span className="flex items-center gap-1.5">
                  <Flower2 size={14} className="text-[#D18AAE]" />
                  Made for food lovers
                </span>
              </div>

            </div>

            {/* RIGHT DECORATIVE COMPOSITION */}
            <div className="hidden lg:flex justify-center items-center relative min-h-[390px]">

              <div className="absolute w-[330px] h-[330px] rounded-full border border-[#54AEB9]/20" />
              <div className="absolute w-[270px] h-[270px] rounded-full border border-dashed border-[#D18AAE]/40" />

              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#B8E8EE] via-[#E9F8F4] to-[#F2C7DB] shadow-2xl shadow-[#24515B]/10 flex items-center justify-center">
                <div className="w-52 h-52 rounded-full bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center text-center shadow-inner">
                  <div className="w-16 h-16 rounded-2xl bg-[#DDF5F4] flex items-center justify-center mb-3">
                    <Utensils size={30} className="text-[#398F9A]" />
                  </div>
                  <span className="font-serif text-2xl italic text-[#24515B]">
                    Find your
                  </span>
                  <span className="font-serif text-2xl italic text-[#54AEB9]">
                    next favorite
                  </span>
                </div>
              </div>

              <div className="absolute top-5 right-12 w-16 h-16 rounded-2xl bg-white dark:bg-[#29464A] shadow-xl flex items-center justify-center rotate-12">
                <Carrot size={29} className="text-[#72B98A]" />
              </div>

              <div className="absolute bottom-12 right-4 w-14 h-14 rounded-full bg-[#F2C7DB] shadow-lg flex items-center justify-center -rotate-12">
                <Sparkles size={24} className="text-[#A85E85]" />
              </div>

              <div className="absolute bottom-5 left-7 w-16 h-16 rounded-2xl bg-[#BFE8C8] shadow-lg flex items-center justify-center rotate-12">
                <Leaf size={28} className="text-[#4D9564]" />
              </div>

              <div className="absolute top-12 left-6 w-12 h-12 rounded-full bg-[#CBB7F5] shadow-lg flex items-center justify-center">
                <Flower2 size={23} className="text-white" />
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CURVE */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#F5FAF9] dark:bg-[#172B2E] rounded-t-[50%]" />

      </section>

      {/* FILTER PANEL */}
      {searchMode === 'name' && (
        <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 -mt-2">

          <div className="bg-white dark:bg-[#223C40] rounded-3xl border border-[#D8ECEA] dark:border-white/10 shadow-lg shadow-[#24515B]/5 overflow-hidden">

            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#DDF5F4] dark:bg-[#365D60] flex items-center justify-center">
                  <SlidersHorizontal size={20} className="text-[#398F9A] dark:text-[#B8E8EE]" />
                </div>

                <div>
                  <h2 className="font-serif text-xl text-[#24515B] dark:text-white">
                    Refine your discovery
                  </h2>
                  <p className="text-xs text-[#91A9AA] mt-1">
                    Choose your season, cuisine and preference
                  </p>
                </div>
              </div>

              <div className={`w-9 h-9 rounded-full bg-[#F0F8F7] dark:bg-white/10 flex items-center justify-center transition-transform ${filtersOpen ? 'rotate-180' : ''}`}>
                <ArrowDownUp size={17} className="text-[#54AEB9]" />
              </div>
            </button>

            {filtersOpen && (
              <div className="px-6 md:px-8 pb-7">

                <div className="h-px bg-[#E7F1F0] dark:bg-white/10 mb-6" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                  {/* SEASON */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#66888C] dark:text-[#B7D0D0] mb-3">
                      <Flower2 size={15} className="text-[#D18AAE]" />
                      Season
                    </label>

                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#F5FAF9] dark:bg-[#29464A] border border-[#DCECEA] dark:border-white/10 text-sm text-[#24515B] dark:text-white outline-none focus:ring-2 focus:ring-[#7ADDF2]/50 transition-all"
                    >
                      {seasonKeys.map(season => (
                        <option key={season} value={season}>
                          {season === 'All'
                            ? (t('search.all') || 'All Seasons')
                            : t(`seasons.${season}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CUISINE */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#66888C] dark:text-[#B7D0D0] mb-3">
                      <Utensils size={15} className="text-[#54AEB9]" />
                      Cuisine
                    </label>

                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#F5FAF9] dark:bg-[#29464A] border border-[#DCECEA] dark:border-white/10 text-sm text-[#24515B] dark:text-white outline-none focus:ring-2 focus:ring-[#7ADDF2]/50 transition-all"
                    >
                      {cuisines.map(cuisine => (
                        <option key={cuisine} value={cuisine}>
                          {cuisine === 'All' ? 'All Cuisines' : cuisine}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SORT */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#66888C] dark:text-[#B7D0D0] mb-3">
                      <ArrowDownUp size={15} className="text-[#9B82CE]" />
                      Sort recipes
                    </label>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#F5FAF9] dark:bg-[#29464A] border border-[#DCECEA] dark:border-white/10 text-sm text-[#24515B] dark:text-white outline-none focus:ring-2 focus:ring-[#7ADDF2]/50 transition-all"
                    >
                      <option value="default">Recommended</option>
                      <option value="az">Name: A - Z</option>
                      <option value="za">Name: Z - A</option>
                    </select>
                  </div>

                </div>

                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-[#E7F1F0] dark:border-white/10">

                    <div className="flex flex-wrap gap-2">

                      {query && (
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#DDF5F4] dark:bg-[#365D60] text-[#39818A] dark:text-[#B8E8EE] text-xs font-semibold">
                          <SearchIcon size={13} />
                          {query}
                        </span>
                      )}

                      {selectedSeason !== 'All' && (
                        <span className="px-3 py-2 rounded-full bg-[#F8E8F0] dark:bg-[#513C4B] text-[#A85E85] text-xs font-semibold">
                          {selectedSeason}
                        </span>
                      )}

                      {selectedCuisine !== 'All' && (
                        <span className="px-3 py-2 rounded-full bg-[#E5F5E8] dark:bg-[#365B4A] text-[#4D9564] text-xs font-semibold">
                          {selectedCuisine}
                        </span>
                      )}

                      {sortBy !== 'default' && (
                        <span className="px-3 py-2 rounded-full bg-[#EEE8FA] dark:bg-[#44395B] text-[#8871B8] text-xs font-semibold">
                          {sortBy === 'az' ? 'A - Z' : 'Z - A'}
                        </span>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#D18AAE] hover:text-[#B66D91] transition-colors"
                    >
                      <RotateCcw size={14} />
                      Reset filters
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>
        </section>
      )}

      {/* RESULTS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">

        {/* RESULTS HEADER */}
        {!loading && filteredResults.length > 0 && (
          <div className="flex flex-wrap items-end justify-between gap-5 mb-9">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-px bg-[#54AEB9]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#54AEB9]">
                  The collection
                </span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-[#24515B] dark:text-white">
                {searchMode === 'ingredients'
                  ? 'Recipes with your ingredients'
                  : 'Explore the recipes'}
              </h2>

              <p className="text-sm text-[#91A9AA] mt-2">
                A little inspiration for your next meal.
              </p>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#223C40] border border-[#DCECEA] dark:border-white/10 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#DDF5F4] dark:bg-[#365D60] flex items-center justify-center">
                <BookOpen size={18} className="text-[#398F9A] dark:text-[#B8E8EE]" />
              </div>

              <div>
                <p className="text-lg font-bold text-[#24515B] dark:text-white leading-none">
                  {filteredResults.length}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#91A9AA] mt-1">
                  Recipes found
                </p>
              </div>
            </div>

          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div>
            <div className="mb-8">
              <div className="h-8 w-64 rounded-lg bg-[#DCECEA] dark:bg-white/10 animate-pulse mb-3" />
              <div className="h-4 w-40 rounded-lg bg-[#E7F1F0] dark:bg-white/5 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredResults.length === 0 && (
          <div className="max-w-2xl mx-auto py-10">

            <div className="bg-white dark:bg-[#223C40] rounded-[2rem] border border-[#DCECEA] dark:border-white/10 p-8 md:p-12 text-center shadow-lg shadow-[#24515B]/5">

              <div className="w-20 h-20 mx-auto rounded-[1.7rem] bg-[#F8E8F0] dark:bg-[#513C4B] flex items-center justify-center mb-6 rotate-3">
                <SearchX size={34} className="text-[#D18AAE]" />
              </div>

              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D18AAE]">
                Nothing here yet
              </span>

              <h3 className="font-serif text-3xl text-[#24515B] dark:text-white mt-3 mb-3">
                No recipes found
              </h3>

              <p className="text-sm leading-7 text-[#819B9D] dark:text-[#B7D0D0] max-w-sm mx-auto mb-7">
                {searchMode === 'ingredients'
                  ? 'Try fewer ingredients or change your ingredient list to discover more recipes.'
                  : 'Try another keyword or adjust your filters. Your next favorite recipe might be just one search away.'}
              </p>

              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#24515B] hover:bg-[#34717B] text-white text-sm font-semibold transition-all shadow-lg shadow-[#24515B]/15"
              >
                <RotateCcw size={16} />
                Explore all recipes
              </button>

            </div>

          </div>
        )}

        {/* RECIPE GRID */}
        {!loading && filteredResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredResults.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}

          </div>
        )}

      </section>

      {/* BOTTOM SIGNATURE */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16">

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#DDF5F4] via-[#EAF7F0] to-[#F8EAF1] dark:from-[#25494D] dark:via-[#294B43] dark:to-[#493747] px-7 md:px-12 py-9 md:py-11">

          <div className="absolute -right-10 -top-20 w-64 h-64 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute -left-10 -bottom-24 w-64 h-64 rounded-full bg-[#7ADDF2]/20 blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#54AEB9] dark:text-[#B8E8EE] mb-3">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  A world of flavor
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-[#24515B] dark:text-white">
                Every great meal starts with an idea.
              </h3>

              <p className="text-sm text-[#66888C] dark:text-[#C2D9D9] mt-2">
                Keep exploring. Keep discovering. Keep cooking.
              </p>
            </div>

            <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-white/70 dark:bg-white/10 flex items-center justify-center shadow-sm rotate-6">
              <ChefHat size={31} className="text-[#54AEB9] dark:text-[#B8E8EE]" />
            </div>

          </div>
        </div>

      </section>

    </main>
  );
}

export default Search;
