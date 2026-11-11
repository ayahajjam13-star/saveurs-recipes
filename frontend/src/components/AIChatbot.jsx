
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
  AlertCircle,
  RotateCcw,
  Utensils,
  ChevronRight,
  MessageCircle,
  WandSparkles,
  Send,
  Clock3
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
      {/* Floating AI Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI Chef' : 'Open AI Chef'}
        aria-expanded={isOpen}
        title="Your AI cooking assistant"
        className="fixed bottom-6 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#5A3325] text-white shadow-[0_8px_30px_rgba(90,51,37,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#804A36] hover:shadow-[0_12px_35px_rgba(90,51,37,0.35)] active:scale-95 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <ChefHat size={28} strokeWidth={1.7} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-[#422318] bg-[#ECE0CD]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5A3325]" />
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-3 z-[59] flex w-[420px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[18px] border border-[#EDC7B9] dark:border-[#744F42] bg-white dark:bg-[#422318] shadow-[0_20px_80px_rgba(90,51,37,0.2)] animate-fade-in sm:bottom-28 sm:right-7"
          style={{
            height: 'min(650px, calc(100dvh - 140px))',
            maxHeight: '650px'
          }}
        >

          {/* Header */}
          <div className="relative shrink-0 overflow-hidden border-b border-[#EDC7B9]/70 dark:border-[#744F42] bg-white dark:bg-[#422318] px-5 py-4">

            <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-[#EB9D81]/25 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-16 h-32 w-32 rounded-full bg-[#E6D6C6]/20 blur-2xl" />

            <div className="relative flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EB9D81] to-[#EDC7B9] text-[#5A3325] shadow-sm">
                  <ChefHat size={25} strokeWidth={1.7} />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-[#422318] bg-[#EADFC8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5A3325]" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#5A3325] dark:text-white">
                      Saveurs Chef
                    </h3>
                    <Sparkles size={14} className="text-[#AE9B7F]" />
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#65B98B]" />
                    <p className="text-[11px] text-[#9A7D72] dark:text-[#D0BFB9]">
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9A7D72] transition-colors hover:bg-[#EDC7B9]/30 hover:text-[#5A3325] dark:hover:bg-[#5A3325] dark:hover:text-white disabled:opacity-40"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  aria-label="Close AI Chef"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9A7D72] transition-colors hover:bg-[#ECE0CD]/30 hover:text-[#AE9B7F] dark:hover:bg-[#3F3832] dark:hover:text-[#ECE0CD]"
                >
                  <X size={18} />
                </button>
              </div>

            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-[#FBF5F2] dark:bg-[#351B11] px-4 py-5 sm:px-5">

            {/* Welcome Section */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-[#EB9D81]/50 bg-[#EDC7B9]/40 px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-[#995B45] dark:bg-[#5A3325] dark:text-[#EDC7B9]">
                  SMART COOKING
                </span>
                <span className="text-[10px] text-[#B09287] dark:text-[#CBB3AA]">
                  Discover something delicious
                </span>
              </div>

              <h4 className="text-2xl font-bold leading-tight text-[#5A3325] dark:text-white">
                What's in your
                <span className="text-[#995B45] dark:text-[#EB9D81]"> kitchen?</span>
              </h4>

              <p className="mt-2 text-xs leading-6 text-[#9A7D72] dark:text-[#D0BFB9]">
                Tell me what ingredients you have and I'll find recipes you can make.
              </p>
            </div>

            {/* Assistant Message */}
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5A3325] text-[#EDC7B9] shadow-sm">
                <WandSparkles size={17} />
              </div>

              <div className="rounded-2xl rounded-tl-sm border border-[#EDC7B9]/70 dark:border-[#744F42] bg-white dark:bg-[#422318] px-4 py-3 shadow-sm">
                <p className="text-xs leading-6 text-[#7F6156] dark:text-[#DAC8C2]">
                  Welcome to your kitchen! Share your ingredients and let's discover your next favorite meal.
                </p>
              </div>
            </div>

            {/* Ingredients Form */}
            <form onSubmit={handleSubmit} className="mb-5">

              <label className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-[#5A3325] dark:text-white">
                  <Leaf size={15} className="text-[#995B45] dark:text-[#EB9D81]" />
                  {t('ai.ingredients', {
                    defaultValue: 'Your ingredients'
                  })}
                </span>

                <span className="text-[10px] text-[#B09287] dark:text-[#CBB3AA]">
                  Be creative
                </span>
              </label>

              <div className="rounded-2xl border border-[#EDC7B9] dark:border-[#744F42] bg-white dark:bg-[#422318] p-3 transition-all focus-within:border-[#EB9D81] focus-within:ring-4 focus-within:ring-[#EB9D81]/15">

                <textarea
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  placeholder="e.g. chicken, tomatoes, onion, garlic..."
                  rows={3}
                  disabled={loading}
                  className="w-full resize-none bg-transparent text-sm leading-6 text-[#5A3325] dark:text-white outline-none placeholder:text-[#B89C92] dark:placeholder:text-[#BA9D92] disabled:opacity-50"
                />

                <div className="flex items-center justify-between gap-2 border-t border-[#EDC7B9]/60 dark:border-[#744F42] pt-3">
                  <span className="text-[10px] text-[#B09287] dark:text-[#CBB3AA]">
                    Separate ingredients with commas
                  </span>

                  <button
                    type="submit"
                    disabled={loading || !ingredients.trim()}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-[#5A3325] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#804A36] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Thinking
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        {t('ai.suggest', {
                          defaultValue: 'Find recipes'
                        })}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Loading Message */}
            {loading && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#EDC7B9] dark:border-[#744F42] bg-white dark:bg-[#422318] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6D6C6]/30 text-[#A18E7A] dark:bg-[#4F463E] dark:text-[#E6D6C6]">
                  <WandSparkles size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#5A3325] dark:text-white">
                    Finding your recipes...
                  </p>
                  <p className="mt-1 text-[10px] text-[#9A7D72] dark:text-[#D0BFB9]">
                    A little kitchen magic is happening.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 text-red-600 dark:text-red-400">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <p className="text-xs leading-5">{error}</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6">

                <div className="mb-4 flex items-end justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#995B45] dark:text-[#EB9D81]">
                      MADE FOR YOU
                    </span>

                    <h4 className="mt-1 text-xl font-bold text-[#5A3325] dark:text-white">
                      Delicious ideas
                    </h4>
                  </div>

                  <span className="rounded-full border border-[#EDC7B9] bg-[#EDC7B9]/35 px-3 py-1.5 text-[10px] font-bold text-[#995B45] dark:border-[#744F42] dark:bg-[#5A3325] dark:text-[#EDC7B9]">
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
                        className="group flex items-center gap-3 rounded-2xl border border-[#EDC7B9]/80 dark:border-[#744F42] bg-white dark:bg-[#422318] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#EB9D81] hover:shadow-lg hover:shadow-[#5A3325]/5"
                      >

                        <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#EDC7B9] to-[#E6D6C6]/50 text-[#995B45]">
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
                          <h5 className="line-clamp-2 text-sm font-bold leading-5 text-[#5A3325] dark:text-white transition-colors group-hover:text-[#995B45] dark:group-hover:text-[#EB9D81]">
                            {recipe.name}
                          </h5>

                          <p className="mt-1.5 truncate text-[10px] text-[#9A7D72] dark:text-[#CBB3AA]">
                            {[recipe.cuisine, recipe.country]
                              .filter(Boolean)
                              .join(' · ') || 'Delicious recipe'}
                          </p>

                          <span className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#995B45] dark:text-[#EB9D81]">
                            View recipe
                            <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="shrink-0 text-[#B89C92] transition-colors group-hover:text-[#AE9B7F]"
                        />

                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#EDC7B9]/70 dark:border-[#744F42] pt-4">
              <MessageCircle size={12} className="text-[#AE9B7F]" />
              <p className="text-[10px] tracking-wide text-[#B09287] dark:text-[#CBB3AA]">
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
