
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  ChefHat,
  X,
  Sparkles,
  ArrowUpRight,
  Leaf,
  Clock3,
  AlertCircle,
  RotateCcw,
  Utensils,
  ChevronRight,
  MessageCircle,
  WandSparkles
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function AIChatbot() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ingredients.trim() || loading) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await axios.post(`${API_URL}/ai/suggest`, {
        ingredients: ingredients.trim()
      });

      const recipes = res.data.recipes || [];
      setResults(recipes);

      if (recipes.length === 0) {
        setError(
          'No recipes found with those ingredients. Try different ones!'
        );
      }
    } catch (err) {
      console.error('AI Chatbot error:', err);

      setError(
        err.response?.data?.message ||
        'AI service unavailable. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    if (loading) return;

    setIngredients('');
    setResults([]);
    setError('');
  };

  const getRecipeImage = (image) => {
    if (!image) return null;

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('/storage/') ||
      image.startsWith('/images/')
    ) {
      return image;
    }

    return `/images/${image}`;
  };

  return (
    <>
      {/* Floating assistant button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI Chef' : 'Open AI Chef'}
        aria-expanded={isOpen}
        title="Your AI cooking assistant"
        className="fixed bottom-6 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl bg-[#718B68] text-white shadow-[0_8px_30px_rgba(113,139,104,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#617B59] hover:shadow-[0_12px_35px_rgba(113,139,104,0.4)] active:scale-95 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <ChefHat size={27} strokeWidth={1.7} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#FAF7F0] bg-[#E88FA5]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-3 z-[59] flex w-[420px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[26px] border border-[#EEE7DF] bg-[#FFFEFC] shadow-[0_20px_80px_rgba(40,34,30,0.18)] animate-fade-in sm:bottom-28 sm:right-7"
          style={{
            height: 'min(650px, calc(100dvh - 140px))',
            maxHeight: '650px'
          }}
        >

          {/* Header */}
          <div className="relative shrink-0 overflow-hidden border-b border-[#EEE7DF] bg-[#FFFEFC] px-5 py-4">

            <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-[#E88FA5]/10 blur-2xl" />

            <div className="relative flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#718B68] text-white shadow-sm">
                  <ChefHat size={24} strokeWidth={1.7} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#28221E]">
                      Saveurs Chef
                    </h3>
                    <Sparkles size={14} className="text-[#E88FA5]" />
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#718B68]" />
                    <p className="text-[11px] text-[#8B8179]">
                      Your personal recipe assistant
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  disabled={loading}
                  title="Start a new search"
                  aria-label="Reset conversation"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8B8179] transition-colors hover:bg-[#FAF7F0] hover:text-[#718B68] disabled:opacity-40"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  aria-label="Close AI Chef"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8B8179] transition-colors hover:bg-[#FAF7F0] hover:text-[#D77F96]"
                >
                  <X size={18} />
                </button>
              </div>

            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto bg-[#FAF7F0] px-4 py-5 sm:px-5">

            {/* Welcome section */}
            <div className="mb-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-[#E88FA5]/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-[#C96F88]">
                  SMART COOKING
                </span>
                <span className="text-[10px] text-[#A49A91]">
                  Discover something delicious
                </span>
              </div>

              <h4 className="font-serif text-2xl font-bold leading-tight text-[#28221E]">
                What's in your
                <span className="text-[#718B68]"> kitchen?</span>
              </h4>

              <p className="mt-2 text-xs leading-6 text-[#8B8179]">
                Tell me what ingredients you have and I'll find recipes you can make.
              </p>
            </div>

            {/* Assistant message */}
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#718B68] text-white">
                <WandSparkles size={16} />
              </div>

              <div className="rounded-2xl rounded-tl-sm border border-[#EEE7DF] bg-[#FFFEFC] px-4 py-3 shadow-sm">
                <p className="text-xs leading-6 text-[#51453D]">
                  Welcome to your kitchen! Share your ingredients and let's discover your next favorite meal.
                </p>
              </div>
            </div>

            {/* Ingredients form */}
            <form onSubmit={handleSubmit} className="mb-5">

              <label className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-[#28221E]">
                  <Leaf size={15} className="text-[#718B68]" />
                  {t('ai.ingredients', {
                    defaultValue: 'Your ingredients'
                  })}
                </span>

                <span className="text-[10px] text-[#A49A91]">
                  Be creative
                </span>
              </label>

              <div className="rounded-2xl border border-[#EEE7DF] bg-[#FFFEFC] p-3 transition-all focus-within:border-[#E88FA5] focus-within:ring-4 focus-within:ring-[#E88FA5]/10">

                <textarea
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  placeholder="e.g. chicken, tomatoes, onion, garlic..."
                  rows={3}
                  disabled={loading}
                  className="w-full resize-none bg-transparent text-sm leading-6 text-[#28221E] outline-none placeholder:text-[#A49A91] disabled:opacity-50"
                />

                <div className="flex items-center justify-between border-t border-[#EEE7DF] pt-3">
                  <span className="text-[10px] text-[#A49A91]">
                    Separate ingredients with commas
                  </span>

                  <button
                    type="submit"
                    disabled={loading || !ingredients.trim()}
                    className="flex items-center gap-2 rounded-xl bg-[#718B68] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#617B59] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Thinking
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        {t('ai.suggest', {
                          defaultValue: 'Find recipes'
                        })}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Loading message */}
            {loading && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#EEE7DF] bg-[#FFFEFC] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E88FA5]/10 text-[#D77F96]">
                  <WandSparkles size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#28221E]">
                    Finding your recipes...
                  </p>
                  <p className="mt-1 text-[10px] text-[#8B8179]">
                    A little kitchen magic is happening.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <p className="text-xs leading-5">{error}</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6">

                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#E88FA5]">
                      MADE FOR YOU
                    </span>

                    <h4 className="mt-1 font-serif text-xl font-bold text-[#28221E]">
                      Delicious ideas
                    </h4>
                  </div>

                  <span className="rounded-full bg-[#718B68]/10 px-3 py-1.5 text-[10px] font-bold text-[#718B68]">
                    {results.length} recipes
                  </span>
                </div>

                <div className="space-y-3">
                  {results.map(recipe => {
                    const imageUrl = getRecipeImage(recipe.image);

                    return (
                      <Link
                        key={recipe.id}
                        to={`/recipe/${recipe.id}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 rounded-2xl border border-[#EEE7DF] bg-[#FFFEFC] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E88FA5]/50 hover:shadow-[0_8px_25px_rgba(40,34,30,0.07)]"
                      >

                        <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F5D8C8]/40 text-[#718B68]">
                          <Utensils size={24} strokeWidth={1.5} />

                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={recipe.name}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={e => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className="line-clamp-2 text-sm font-bold leading-5 text-[#28221E] transition-colors group-hover:text-[#C96F88]">
                            {recipe.name}
                          </h5>

                          <p className="mt-1.5 truncate text-[10px] text-[#8B8179]">
                            {[recipe.cuisine, recipe.country]
                              .filter(Boolean)
                              .join(' · ') || 'Delicious recipe'}
                          </p>

                          <span className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#718B68]">
                            View recipe
                            <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="shrink-0 text-[#A49A91] transition-colors group-hover:text-[#E88FA5]"
                        />

                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#EEE7DF] pt-4">
              <MessageCircle size={12} className="text-[#E88FA5]" />
              <p className="text-[10px] tracking-wide text-[#A49A91]">
                Your little cooking companion by Saveurs
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
