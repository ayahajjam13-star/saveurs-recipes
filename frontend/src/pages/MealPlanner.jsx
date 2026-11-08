
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ShoppingCart,
  Printer,
  Search,
  X,
  Utensils,
  Heart,
  Sparkles,
  ChefHat
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import {
  getMealPlan,
  addRecipeToDay,
  removeRecipeFromDay
} from '../services/mealPlanService';
import { getRecipes } from '../services/api';
import PrintMealPlan from '../components/PrintMealPlan';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const DAYS = [
  { key: 'monday', label: 'Monday', emoji: '🌿' },
  { key: 'tuesday', label: 'Tuesday', emoji: '🍓' },
  { key: 'wednesday', label: 'Wednesday', emoji: '🥑' },
  { key: 'thursday', label: 'Thursday', emoji: '🍋' },
  { key: 'friday', label: 'Friday', emoji: '🍅' },
  { key: 'saturday', label: 'Saturday', emoji: '🥗' },
  { key: 'sunday', label: 'Sunday', emoji: '🍑' },
];

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
}

function getImageUrl(image) {
  if (!image) return '/images/placeholder.jpg';

  return image.startsWith('http')
    ? image
    : `/images/${image}`;
}

function MealPlanner() {
  const { user } = useAuth();

  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [meals, setMeals] = useState({});
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getMealPlan(weekStart)
      .then(res => {
        setMeals(res.data.meals || {});
      })
      .catch(err => {
        console.error(err);
        toast.error('Could not load meal plan');
      })
      .finally(() => setLoading(false));

    getRecipes()
      .then(res => setAllRecipes(res.data))
      .catch(err => console.error('Recipes error:', err));

  }, [weekStart, user]);

  const handleAddRecipe = async (day, recipeId) => {
    try {
      await addRecipeToDay(weekStart, day, recipeId);

      const res = await getMealPlan(weekStart);
      setMeals(res.data.meals || {});

      toast.success('Recipe added!');
      setPickerOpen(null);
      setSearchQuery('');

    } catch (err) {
      console.error(err);
      toast.error('Failed to add recipe');
    }
  };

  const handleRemoveRecipe = async (day, recipeId) => {
    try {
      await removeRecipeFromDay(weekStart, day, recipeId);

      const res = await getMealPlan(weekStart);
      setMeals(res.data.meals || {});

      toast.success('Recipe removed');

    } catch (err) {
      console.error(err);
      toast.error('Failed to remove recipe');
    }
  };

  const changeWeek = (amount) => {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() + amount * 7);

    setWeekStart(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    );
  };

  const filteredRecipes = allRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMeals = Object.values(meals).reduce(
    (total, dayMeals) => total + (dayMeals || []).length,
    0
  );

  const formattedWeek = new Date(weekStart + 'T12:00:00').toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center px-6">

        <div className="max-w-md text-center py-16">

          <div className="w-24 h-24 bg-[#F7A1B3]/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <LockIcon />
          </div>

          <p className="text-[#87A93D] uppercase tracking-[0.3em] text-xs mb-4">
            Your Weekly Kitchen
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-[#53652C] mb-5">
            Plan with Love
          </h2>

          <p className="text-[#88816F] leading-8 mb-9">
            Sign in to organize your meals, discover recipes
            and create your perfect weekly menu.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#87A93D] text-white rounded-full hover:bg-[#6E8C2D] transition-all shadow-lg"
          >
            Sign In <ChevronRight size={18} />
          </Link>

        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF8F0] text-[#394323] pb-24 overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#53652C] py-24 md:py-32 px-6">

        <div className="absolute top-[-70px] right-[-50px] w-72 h-72 bg-[#C6D97A]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-40px] w-72 h-72 bg-[#F7A1B3]/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-7">
            <CalendarDays size={30} className="text-[#F7A1B3]" />
          </div>

          <p className="text-[#C6D97A] tracking-[0.35em] uppercase text-xs font-semibold mb-5">
            Your Weekly Kitchen
          </p>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            Meal Planner<span className="text-[#F7A1B3]">.</span>
          </h1>

          <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto leading-8">
            Plan your meals, organize your favorite dishes
            and make every day a delicious experience.
          </p>

          <div className="flex justify-center items-center gap-3 mt-8">
            <span className="w-12 h-px bg-[#C6D97A]" />
            <Heart size={17} className="text-[#F7A1B3]" />
            <span className="w-12 h-px bg-[#C6D97A]" />
          </div>

        </div>
      </section>

      {/* WEEK SUMMARY */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 -mt-8 relative z-10">

        <div className="bg-white rounded-[25px] shadow-xl shadow-[#53652C]/5 border border-[#C6D97A]/20 p-6 md:p-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-14 h-14 bg-[#F7A1B3]/20 rounded-2xl flex items-center justify-center">
                <ChefHat size={28} className="text-[#F16D7A]" />
              </div>

              <div>
                <p className="text-[#88816F] text-xs uppercase tracking-widest mb-1">
                  Your Weekly Menu
                </p>
                <h2 className="font-serif text-2xl text-[#53652C]">
                  {totalMeals} Planned Meals
                </h2>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => changeWeek(-1)}
                aria-label="Previous week"
                className="w-11 h-11 rounded-full border border-[#C6D97A]/60 flex items-center justify-center text-[#87A93D] hover:bg-[#C6D97A]/20 transition-all"
              >
                <ChevronLeft size={21} />
              </button>

              <div className="text-center min-w-[150px]">
                <p className="text-[10px] text-[#88816F] uppercase tracking-widest mb-1">
                  Week of
                </p>
                <p className="font-serif text-lg text-[#53652C]">
                  {formattedWeek}
                </p>
              </div>

              <button
                onClick={() => changeWeek(1)}
                aria-label="Next week"
                className="w-11 h-11 rounded-full border border-[#C6D97A]/60 flex items-center justify-center text-[#87A93D] hover:bg-[#C6D97A]/20 transition-all"
              >
                <ChevronRight size={21} />
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* WEEKLY PLANNER */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-16">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">

          <div>
            <p className="text-[#F16D7A] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
              Organize Your Week
            </p>

            <h2 className="font-serif text-4xl md:text-5xl text-[#53652C]">
              Your Daily Menu
            </h2>
          </div>

          <p className="text-[#88816F] text-sm">
            Seven days, endless delicious possibilities.
          </p>

        </div>

        {loading ? (

          <div className="text-center py-28">

            <div className="w-12 h-12 border-4 border-[#C6D97A] border-t-[#F16D7A] rounded-full animate-spin mx-auto" />

            <p className="mt-5 text-[#87A93D] text-sm tracking-widest">
              Preparing your weekly menu...
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {DAYS.map((day, index) => (

              <article
                key={day.key}
                className="group bg-white rounded-[25px] p-6 border border-[#C6D97A]/25 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >

                {/* Day Header */}
                <div className="flex items-center justify-between mb-6">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-[#F9E3C7]/60 flex items-center justify-center text-2xl">
                      {day.emoji}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#88816F] mb-1">
                        Day {index + 1}
                      </p>

                      <h3 className="font-serif text-xl text-[#53652C]">
                        {day.label}
                      </h3>
                    </div>

                  </div>

                  <button
                    onClick={() => {
                      setPickerOpen(day.key);
                      setSearchQuery('');
                    }}
                    aria-label={`Add recipe to ${day.label}`}
                    className="w-10 h-10 bg-[#F16D7A] text-white rounded-full flex items-center justify-center hover:bg-[#E45C69] hover:rotate-90 transition-all duration-300 shadow-md shadow-[#F16D7A]/20"
                  >
                    <Plus size={21} />
                  </button>

                </div>

                <div className="h-px bg-[#C6D97A]/30 mb-5" />

                {/* Meals */}
                {(meals[day.key] || []).length === 0 ? (

                  <div className="py-9 text-center rounded-2xl bg-[#FDF8F0] border border-dashed border-[#C6D97A]/60">

                    <Utensils size={27} className="text-[#C6D97A] mx-auto mb-3" />

                    <p className="text-sm text-[#88816F] mb-3">
                      No meals planned yet
                    </p>

                    <button
                      onClick={() => {
                        setPickerOpen(day.key);
                        setSearchQuery('');
                      }}
                      className="text-[#F16D7A] text-xs font-semibold hover:underline"
                    >
                      + Add your first recipe
                    </button>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {(meals[day.key] || []).map(recipe => (

                      <div
                        key={recipe.id}
                        className="flex items-center gap-3 bg-[#FDF8F0] rounded-2xl p-3 group/recipe border border-transparent hover:border-[#C6D97A]/50 transition-all"
                      >

                        <img
                          src={getImageUrl(recipe.image)}
                          alt={recipe.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />

                        <div className="flex-1 min-w-0">

                          <Link
                            to={`/recipe/${recipe.id}`}
                            className="text-sm font-semibold text-[#53652C] hover:text-[#F16D7A] transition-colors line-clamp-2"
                          >
                            {recipe.name}
                          </Link>

                          <p className="text-xs text-[#88816F] mt-2">
                            {recipe.cuisine || 'Delicious recipe'}
                          </p>

                        </div>

                        <button
                          onClick={() => handleRemoveRecipe(day.key, recipe.id)}
                          aria-label="Remove recipe"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#F16D7A] hover:bg-[#F7A1B3]/30 transition-all opacity-100 md:opacity-0 md:group-hover/recipe:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    ))}

                  </div>

                )}

              </article>

            ))}

          </div>

        )}

      </section>

      {/* BOTTOM ACTIONS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-16">

        <div className="bg-[#F9E3C7]/40 rounded-[30px] p-8 md:p-12 text-center border border-[#C6D97A]/30">

          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles size={27} className="text-[#F16D7A]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#53652C] mb-4">
            Your Week, Made Delicious
          </h2>

          <p className="text-[#88816F] max-w-xl mx-auto leading-7 mb-9">
            Everything is planned. Now get ready to cook,
            enjoy and share your favorite meals.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">

            <Link
              to="/shopping-list"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#87A93D] text-white rounded-full font-semibold hover:bg-[#6E8C2D] hover:scale-105 transition-all shadow-lg shadow-[#87A93D]/20"
            >
              <ShoppingCart size={19} />
              Shopping List
            </Link>

            <button
              onClick={() => setPrintOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#53652C] border border-[#C6D97A]/50 rounded-full font-semibold hover:bg-[#FDF8F0] hover:scale-105 transition-all"
            >
              <Printer size={19} />
              Print Meal Plan
            </button>

          </div>

        </div>

      </section>

      {/* PRINT MODAL */}
      {printOpen && (
        <PrintMealPlan
          meals={meals}
          weekStart={weekStart}
          onClose={() => setPrintOpen(false)}
        />
      )}

      {/* RECIPE PICKER MODAL */}
      {pickerOpen && (

        <div
          className="fixed inset-0 bg-[#394323]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPickerOpen(null);
              setSearchQuery('');
            }
          }}
        >

          <div className="bg-[#FDF8F0] rounded-[28px] max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">

            {/* Modal Header */}
            <div className="p-6 md:p-8 bg-white border-b border-[#C6D97A]/30">

              <div className="flex items-start justify-between gap-4 mb-6">

                <div>
                  <p className="text-[#F16D7A] uppercase tracking-[0.25em] text-xs mb-2">
                    Build Your Menu
                  </p>

                  <h2 className="font-serif text-2xl md:text-3xl text-[#53652C]">
                    Add Recipe to {DAYS.find(d => d.key === pickerOpen)?.label}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setPickerOpen(null);
                    setSearchQuery('');
                  }}
                  aria-label="Close"
                  className="w-10 h-10 rounded-full bg-[#F7A1B3]/20 text-[#F16D7A] flex items-center justify-center hover:bg-[#F7A1B3]/40 transition-colors"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="relative">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87A93D]"
                />

                <input
                  type="text"
                  placeholder="Search your favorite recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#FDF8F0] border border-[#C6D97A]/40 text-[#53652C] placeholder:text-[#AAA38F] focus:outline-none focus:border-[#F16D7A] transition-colors"
                />

              </div>

            </div>

            {/* Recipe List */}
            <div className="p-6 overflow-y-auto flex-1">

              {filteredRecipes.length === 0 ? (

                <div className="text-center py-16">

                  <Utensils size={38} className="text-[#C6D97A] mx-auto mb-4" />

                  <p className="font-serif text-xl text-[#53652C]">
                    No recipes found
                  </p>

                  <p className="text-sm text-[#88816F] mt-2">
                    Try another search.
                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {filteredRecipes.slice(0, 30).map(recipe => (

                    <button
                      key={recipe.id}
                      onClick={() => handleAddRecipe(pickerOpen, recipe.id)}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#C6D97A]/20 hover:border-[#F16D7A]/50 hover:shadow-md transition-all text-left group"
                    >

                      <img
                        src={getImageUrl(recipe.image)}
                        alt={recipe.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      <div className="flex-1 min-w-0">

                        <p className="text-sm font-semibold text-[#53652C] group-hover:text-[#F16D7A] transition-colors line-clamp-2">
                          {recipe.name}
                        </p>

                        <p className="text-xs text-[#88816F] mt-2">
                          {recipe.cuisine || 'World Cuisine'}
                        </p>

                      </div>

                      <Plus size={19} className="text-[#87A93D] flex-shrink-0" />

                    </button>

                  ))}

                </div>

              )}

            </div>

            <div className="px-6 py-4 border-t border-[#C6D97A]/30 bg-white text-center">
              <p className="text-xs text-[#88816F]">
                Showing up to 30 recipes · Choose one to add it to your day.
              </p>
            </div>

          </div>

        </div>

      )}

    </main>
  );
}

function LockIcon() {
  return <CalendarDays size={36} className="text-[#F16D7A]" />;
}

export default MealPlanner;
