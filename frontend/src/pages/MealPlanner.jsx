import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMealPlan, addRecipeToDay, removeRecipeFromDay } from '../services/mealPlanService';
import { getRecipes } from '../services/api';
import PrintMealPlan from '../components/PrintMealPlan';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const DAYS = [
  { key: 'monday', label: 'Monday', emoji: '1️⃣' },
  { key: 'tuesday', label: 'Tuesday', emoji: '2️⃣' },
  { key: 'wednesday', label: 'Wednesday', emoji: '3️⃣' },
  { key: 'thursday', label: 'Thursday', emoji: '4️⃣' },
  { key: 'friday', label: 'Friday', emoji: '5️⃣' },
  { key: 'saturday', label: 'Saturday', emoji: '6️⃣' },
  { key: 'sunday', label: 'Sunday', emoji: '7️⃣' },
];

function MealPlanner() {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [meals, setMeals] = useState({});
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [printOpen, setPrintOpen] = useState(false);

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  }

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getMealPlan(weekStart)
      .then(res => {
        setMeals(res.data.meals || {});
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    getRecipes().then(res => setAllRecipes(res.data));
  }, [weekStart, user]);

  const handleAddRecipe = async (day, recipeId) => {
    try {
      await addRecipeToDay(weekStart, day, recipeId);
      const res = await getMealPlan(weekStart);
      setMeals(res.data.meals);
      toast.success('Recipe added!');
      setPickerOpen(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add recipe');
    }
  };

  const handleRemoveRecipe = async (day, recipeId) => {
    try {
      await removeRecipeFromDay(weekStart, day, recipeId);
      const res = await getMealPlan(weekStart);
      setMeals(res.data.meals);
      toast.success('Recipe removed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove recipe');
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
            You need to be logged in to use the Meal Planner.
          </p>
        </div>
      </div>
    );
  }

  const filteredRecipes = allRecipes.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      
      <section className="bg-gradient-to-br from-warm-brown via-warm-brown to-orange-accent/30 dark:from-dark-card dark:via-dark-card dark:to-orange-accent/20 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-4">
            Plan your week
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4">
            🗓️ Meal Planner
          </h1>
          <p className="text-cream/70 text-lg">
            Plan your meals for the week and generate your shopping list.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Week Selector */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() - 7);
              setWeekStart(d.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-white dark:bg-dark-card border border-warm-brown/10 dark:border-dark-text/10 rounded-xl text-warm-brown dark:text-dark-text hover:bg-cream dark:hover:bg-dark-bg transition-colors"
          >
            ← Previous Week
          </button>
          
          <div className="text-center">
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">
              Week of
            </p>
            <p className="font-serif text-xl font-bold text-warm-brown dark:text-dark-text">
              {new Date(weekStart).toLocaleDateString('en-GB', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </p>
          </div>
          
          <button
            onClick={() => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() + 7);
              setWeekStart(d.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-white dark:bg-dark-card border border-warm-brown/10 dark:border-dark-text/10 rounded-xl text-warm-brown dark:text-dark-text hover:bg-cream dark:hover:bg-dark-bg transition-colors"
          >
            Next Week →
          </button>
        </div>

        {/* Days Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>
            <p className="mt-4 text-warm-brown/60 dark:text-dark-text/60">Loading meal plan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS.map(day => (
              <div
                key={day.key}
                className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-warm-brown dark:text-dark-text">
                    {day.emoji} {day.label}
                  </h3>
                  <button
                    onClick={() => setPickerOpen(day.key)}
                    className="w-8 h-8 bg-orange-accent text-white rounded-full hover:bg-orange-accent/90 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {(meals[day.key] || []).length === 0 ? (
                  <p className="text-sm text-warm-brown/40 dark:text-dark-text/40 text-center py-4">
                    No meals planned
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(meals[day.key] || []).map(recipe => (
                      <div
                        key={recipe.id}
                        className="flex items-center gap-3 bg-cream/50 dark:bg-dark-bg/50 rounded-xl p-2 group"
                      >
                        <img
                          src={`/images/${recipe.image}`}
                          alt={recipe.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <a
                            href={`/recipe/${recipe.id}`}
                            className="text-sm font-medium text-warm-brown dark:text-dark-text hover:text-orange-accent transition-colors line-clamp-2"
                          >
                            {recipe.name}
                          </a>
                        </div>
                        <button
                          onClick={() => handleRemoveRecipe(day.key, recipe.id)}
                          className="w-6 h-6 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="text-center mt-12 flex flex-wrap gap-3 justify-center">
          <a
            href="/shopping-list"
            className="inline-block px-8 py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-all hover:scale-105"
          >
            🛒 View Shopping List
          </a>
          <button
            onClick={() => setPrintOpen(true)}
            className="inline-block px-8 py-4 bg-white dark:bg-dark-card text-warm-brown dark:text-dark-text border border-warm-brown/10 dark:border-dark-text/10 rounded-2xl font-semibold hover:bg-cream dark:hover:bg-dark-bg transition-all hover:scale-105"
          >
            🖨️ Print Plan
          </button>
        </div>
      </div>

      {/* Print Meal Plan */}
      {printOpen && (
        <PrintMealPlan 
          meals={meals} 
          weekStart={weekStart} 
          onClose={() => setPrintOpen(false)} 
        />
      )}

      {/* Recipe Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-warm-brown/10 dark:border-dark-text/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text">
                  Add Recipe to {DAYS.find(d => d.key === pickerOpen)?.label}
                </h2>
                <button
                  onClick={() => { setPickerOpen(null); setSearchQuery(''); }}
                  className="text-warm-brown/60 dark:text-dark-text/60 hover:text-warm-brown dark:hover:text-dark-text text-2xl"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredRecipes.slice(0, 30).map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => handleAddRecipe(pickerOpen, recipe.id)}
                    className="flex items-center gap-3 p-3 bg-cream/50 dark:bg-dark-bg/50 rounded-xl hover:bg-cream dark:hover:bg-dark-bg transition-colors text-left"
                  >
                    <img
                      src={`/images/${recipe.image}`}
                      alt={recipe.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-brown dark:text-dark-text line-clamp-2">
                        {recipe.name}
                      </p>
                      <p className="text-xs text-warm-brown/60 dark:text-dark-text/60">
                        {recipe.cuisine}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlanner;