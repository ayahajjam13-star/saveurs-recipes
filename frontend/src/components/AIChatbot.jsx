import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function AIChatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await axios.post(`${API_URL}/ai/suggest`, {
        ingredients,
      });
      setResults(res.data.recipes || []);
      if ((res.data.recipes || []).length === 0) {
        setError('No recipes found with those ingredients. Try different ones!');
      }
    } catch (err) {
      console.error(err);
      setError('AI service unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-orange-accent to-red-500 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-white text-2xl"
        title="AI Recipe Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-warm-brown/10 dark:border-dark-text/10 overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-accent to-red-500 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold">AI Chef</h3>
                <p className="text-xs text-white/80">What's in your kitchen?</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[500px] overflow-y-auto">
            <form onSubmit={handleSubmit} className="mb-4">
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                🥕 Enter your ingredients:
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. chicken, tomatoes, onion, garlic..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors resize-none text-sm"
              />
              <button
                type="submit"
                disabled={loading || !ingredients.trim()}
                className="mt-3 w-full py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Thinking...' : '✨ Suggest Recipes'}
              </button>
            </form>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            {results.length > 0 && (
              <div>
                <p className="text-sm font-medium text-warm-brown dark:text-dark-text mb-3">
                  🍽️ You can make these:
                </p>
                <div className="space-y-3">
                  {results.map(recipe => (
                    <a
                      key={recipe.id}
                      href={`/recipe/${recipe.id}`}
                      className="flex gap-3 bg-cream/50 dark:bg-dark-bg/50 rounded-xl p-3 hover:bg-cream dark:hover:bg-dark-bg transition-colors"
                    >
                      <img
                        src={`/images/${recipe.image}`}
                        alt={recipe.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-warm-brown dark:text-dark-text text-sm line-clamp-2">
                          {recipe.name}
                        </p>
                        <p className="text-xs text-warm-brown/60 dark:text-dark-text/60 mt-1">
                          {recipe.cuisine} · {recipe.country}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;