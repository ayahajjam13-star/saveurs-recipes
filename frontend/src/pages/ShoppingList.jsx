import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getShoppingList } from '../services/mealPlanService';

function ShoppingList() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  }

  useEffect(() => {
    if (!user) return;
    const weekStart = getMonday(new Date());
    
    getShoppingList(weekStart)
      .then(res => {
        setIngredients(res.data.ingredients || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const toggleCheck = (index) => {
    setChecked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const text = ingredients.map((ing, i) => 
      `[${checked[i] ? '✓' : ' '}] ${ing}`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Shopping list copied!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-cream dark:bg-dark-bg transition-colors">
        <div className="text-center">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-4">
            Please sign in
          </h2>
          <p className="text-warm-brown/60 dark:text-dark-text/60">
            You need to be logged in to see your shopping list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      
      <section className="bg-gradient-to-br from-warm-brown via-warm-brown to-orange-accent/30 dark:from-dark-card dark:via-dark-card dark:to-orange-accent/20 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-4">
            From your meal plan
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4">
            🛒 Shopping List
          </h1>
          <p className="text-cream/70 text-lg">
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} to buy
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>
            <p className="mt-4 text-warm-brown/60 dark:text-dark-text/60">Loading shopping list...</p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🛒</p>
            <h3 className="font-serif text-2xl text-warm-brown dark:text-dark-text mb-4">
              Your shopping list is empty
            </h3>
            <p className="text-warm-brown/60 dark:text-dark-text/60 mb-8">
              Add recipes to your Meal Planner to generate a shopping list.
            </p>
            <a
              href="/meal-planner"
              className="inline-block px-6 py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors"
            >
              🗓️ Go to Meal Planner
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 mb-6 transition-colors">
              <ul className="space-y-3">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 py-2 border-b border-warm-brown/5 dark:border-dark-text/5 last:border-0">
                    <button
                      onClick={() => toggleCheck(i)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        checked[i]
                          ? 'bg-orange-accent border-orange-accent text-white'
                          : 'border-warm-brown/30 dark:border-dark-text/30'
                      }`}
                    >
                      {checked[i] && '✓'}
                    </button>
                    <span className={`flex-1 leading-relaxed transition-colors ${
                      checked[i]
                        ? 'line-through text-warm-brown/40 dark:text-dark-text/40'
                        : 'text-warm-brown/80 dark:text-dark-text/80'
                    }`}>
                      {ing}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 justify-center no-print">
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-white dark:bg-dark-card border border-warm-brown/10 dark:border-dark-text/10 text-warm-brown dark:text-dark-text rounded-xl font-medium hover:bg-cream dark:hover:bg-dark-bg transition-colors"
              >
                📋 Copy List
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors"
              >
                🖨️ Print
              </button>
              <a
                href="/meal-planner"
                className="px-6 py-3 bg-white dark:bg-dark-card border border-warm-brown/10 dark:border-dark-text/10 text-warm-brown dark:text-dark-text rounded-xl font-medium hover:bg-cream dark:hover:bg-dark-bg transition-colors"
              >
                🗓️ Back to Planner
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;