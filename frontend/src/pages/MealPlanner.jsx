
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  ChefHat,
  Clock3,
  ArrowUpRight,
  CheckCircle2,
  CalendarCheck,
  LayoutDashboard,
  Coffee,
  Sun,
  Moon,
  Heart,
  BookOpen,
  CalendarPlus,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import {
  getMealPlan,
  addRecipeToDay,
  removeRecipeFromDay,
} from '../services/mealPlanService';
import { getRecipes } from '../services/api';
import PrintMealPlan from '../components/PrintMealPlan';

const DAYS = [
  { key: 'monday', label: 'Monday', short: 'MON', emoji: '🌿', period: 'Start fresh' },
  { key: 'tuesday', label: 'Tuesday', short: 'TUE', emoji: '🍓', period: 'Keep going' },
  { key: 'wednesday', label: 'Wednesday', short: 'WED', emoji: '🥑', period: 'Midweek' },
  { key: 'thursday', label: 'Thursday', short: 'THU', emoji: '🍋', period: 'Almost there' },
  { key: 'friday', label: 'Friday', short: 'FRI', emoji: '🍅', period: 'Feel good' },
  { key: 'saturday', label: 'Saturday', short: 'SAT', emoji: '🥗', period: 'Slow down' },
  { key: 'sunday', label: 'Sunday', short: 'SUN', emoji: '🍑', period: 'Enjoy today' },
];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function getImageUrl(image) {
  if (!image) return '/images/placeholder.jpg';

  return image.startsWith('http')
    ? image
    : `/images/${image}`;
}

function getDateForDay(weekStart, index) {
  const date = new Date(`${weekStart}T12:00:00`);
  date.setDate(date.getDate() + index);
  return date;
}

function formatDate(date, options = { day: 'numeric' }) {
  return date.toLocaleDateString('en-GB', options);
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
  const [selectedDay, setSelectedDay] = useState('monday');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    getMealPlan(weekStart)
      .then((res) => {
        if (active) {
          setMeals(res.data.meals || {});
        }
      })
      .catch((err) => {
        console.error('Meal plan error:', err);
        if (active) toast.error('Could not load meal plan');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    getRecipes()
      .then((res) => {
        if (active) setAllRecipes(res.data || []);
      })
      .catch((err) => {
        console.error('Recipes error:', err);
      });

    return () => {
      active = false;
    };
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
    const date = new Date(`${weekStart}T12:00:00`);
    date.setDate(date.getDate() + amount * 7);

    const nextWeek = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    setWeekStart(nextWeek);
  };

  const goToCurrentWeek = () => {
    setWeekStart(getMonday(new Date()));
  };

  const filteredRecipes = allRecipes.filter((recipe) =>
    (recipe.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMeals = Object.values(meals).reduce(
    (total, dayMeals) => total + (dayMeals || []).length,
    0
  );

  const plannedDays = DAYS.filter(
    (day) => (meals[day.key] || []).length > 0
  ).length;

  const formattedWeek = new Date(`${weekStart}T12:00:00`).toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const weekEnd = getDateForDay(weekStart, 6);

  const formattedRange = `${formatDate(
    new Date(`${weekStart}T12:00:00`),
    { day: 'numeric', month: 'short' }
  )} — ${formatDate(weekEnd, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  if (!user) {
    return (
      <main className="flex min-h-[85vh] items-center justify-center bg-[#F7FCFD] px-5 py-16 dark:bg-[#172D35]">
        <section className="relative w-full max-w-xl overflow-hidden rounded-[36px] border border-[#B8E8EE] bg-white p-9 text-center shadow-xl shadow-[#24515B]/5 dark:border-white/10 dark:bg-[#203C46] sm:p-14">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7ADDF2]/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#CBB7F5]/20 blur-3xl" />

          <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#DDF5F7] text-[#24515B]">
            <CalendarDays size={34} />
          </div>

          <p className="relative mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#398B9A]">
            Your personal food planner
          </p>

          <h1 className="relative font-serif text-4xl font-black text-[#24515B] dark:text-white sm:text-5xl">
            Make room for
            <span className="block italic text-[#398B9A]">delicious days.</span>
          </h1>

          <p className="relative mx-auto mt-5 max-w-sm text-sm leading-7 text-[#66858D] dark:text-gray-300">
            Sign in to organize your weekly meals, save your favourite recipes and make every week easier.
          </p>

          <Link
            to="/login"
            className="relative mt-9 inline-flex items-center gap-3 rounded-full bg-[#7ADDF2] px-8 py-4 text-sm font-black text-[#24515B] shadow-lg shadow-[#7ADDF2]/20 transition-all hover:-translate-y-1 hover:bg-[#B8E8EE]"
          >
            Sign in to start
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7FCFD] pb-20 text-[#24515B] dark:bg-[#172D35] dark:text-white">

      {/* TOP INTRO */}
      <section className="relative overflow-hidden bg-[#24515B] text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#7ADDF2]/15 blur-3xl" />
        <div className="absolute -bottom-40 left-[25%] h-96 w-96 rounded-full bg-[#CBB7F5]/15 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-16 lg:px-12">

          <div className="mb-14 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7ADDF2] text-[#24515B]">
                <ChefHat size={23} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8E8EE]">
                  SAVEURS
                </p>
                <p className="text-xs font-semibold text-white/65">
                  Your kitchen companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5">
              <Sparkles size={14} className="text-[#7ADDF2]" />
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/85">
                Plan · Cook · Enjoy
              </span>
            </div>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">

            <div>
              <p className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#7ADDF2]">
                <span className="h-px w-7 bg-[#7ADDF2]" />
                A little planning, a lot of flavour
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Your week,
                <span className="block italic text-[#B8E8EE]">
                  beautifully
                </span>
                planned.
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                Bring your favourite recipes together, one day at a time. A calmer week starts with a little inspiration.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay('monday');
                    setPickerOpen('monday');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#7ADDF2] px-6 py-3.5 text-xs font-black text-[#24515B] transition-all hover:-translate-y-1 hover:bg-[#B8E8EE]"
                >
                  <Plus size={17} />
                  Add a recipe
                </button>

                <Link
                  to="/shopping-list"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-black text-white transition-all hover:bg-white/20"
                >
                  <ShoppingCart size={16} />
                  Shopping list
                </Link>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative mx-auto flex min-h-[290px] w-full max-w-[430px] items-center justify-center">

              <div className="absolute h-64 w-64 rounded-full border border-dashed border-[#B8E8EE]/30 sm:h-80 sm:w-80" />
              <div className="absolute h-52 w-52 rounded-full bg-[#7ADDF2]/15 blur-2xl sm:h-64 sm:w-64" />

              <div className="relative flex h-56 w-56 rotate-[-5deg] flex-col items-center justify-center rounded-[42px] border border-white/20 bg-gradient-to-br from-[#DDF5F7] to-[#7ADDF2] shadow-2xl shadow-black/20 sm:h-64 sm:w-64">
                <span className="text-7xl drop-shadow-lg sm:text-8xl">🥗</span>
                <p className="mt-3 font-serif text-2xl font-black italic text-[#24515B]">
                  Fresh & lovely
                </p>
                <span className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#398B9A]">
                  Every single day
                </span>
              </div>

              <div className="absolute -left-1 top-8 rotate-[-8deg] rounded-2xl bg-white px-4 py-3 text-[#24515B] shadow-xl sm:left-0">
                <div className="flex items-center gap-2">
                  <Coffee size={16} className="text-[#398B9A]" />
                  <span className="text-[10px] font-black">Breakfast</span>
                </div>
              </div>

              <div className="absolute -right-1 top-20 rotate-[7deg] rounded-2xl bg-[#B8E8EE] px-4 py-3 text-[#24515B] shadow-xl sm:right-0">
                <div className="flex items-center gap-2">
                  <Sun size={16} />
                  <span className="text-[10px] font-black">Lunch time</span>
                </div>
              </div>

              <div className="absolute bottom-5 left-2 rotate-[5deg] rounded-2xl bg-[#CBB7F5] px-4 py-3 text-[#40365F] shadow-xl sm:left-3">
                <div className="flex items-center gap-2">
                  <Moon size={16} />
                  <span className="text-[10px] font-black">Dinner</span>
                </div>
              </div>

              <span className="absolute bottom-4 right-4 text-4xl text-[#B8E8EE]">✳</span>
              <span className="absolute right-10 top-3 text-3xl text-[#7ADDF2]">✳</span>
            </div>
          </div>
        </div>
      </section>

      {/* WEEK DASHBOARD */}
      <div className="relative z-10 mx-auto -mt-8 max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* WEEK CONTROL */}
        <section className="rounded-[26px] border border-[#B8E8EE] bg-white p-5 shadow-xl shadow-[#24515B]/5 dark:border-white/10 dark:bg-[#203C46] sm:p-7">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DDF5F7] text-[#24515B]">
                <CalendarDays size={27} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#398B9A]">
                  YOUR WEEK AT A GLANCE
                </p>
                <h2 className="mt-1 font-serif text-2xl font-black text-[#24515B] dark:text-white sm:text-3xl">
                  {formattedRange}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={goToCurrentWeek}
                className="rounded-full border border-[#B8E8EE] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#398B9A] transition-colors hover:bg-[#EFFAFC] dark:border-white/15 dark:hover:bg-white/10"
              >
                This week
              </button>

              <button
                type="button"
                onClick={() => changeWeek(-1)}
                aria-label="Previous week"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFFAFC] text-[#24515B] transition-all hover:bg-[#B8E8EE] dark:bg-white/10 dark:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => changeWeek(1)}
                aria-label="Next week"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#24515B] text-white transition-all hover:bg-[#398B9A]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#B8E8EE]/60 pt-6 dark:border-white/10">

            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-[#8AAAB0]">
                Planned meals
              </p>
              <p className="mt-1 font-serif text-3xl font-black text-[#24515B] dark:text-white">
                {totalMeals}
              </p>
            </div>

            <div className="border-x border-[#B8E8EE]/60 px-4 dark:border-white/10">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#8AAAB0]">
                Active days
              </p>
              <p className="mt-1 font-serif text-3xl font-black text-[#398B9A]">
                {plannedDays}<span className="text-base text-[#8AAAB0]">/7</span>
              </p>
            </div>

            <div className="pl-1">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#8AAAB0]">
                Days to enjoy
              </p>
              <p className="mt-1 font-serif text-3xl font-black text-[#8170B5]">
                {7 - plannedDays}
              </p>
            </div>
          </div>
        </section>

        {/* WEEK DAY SELECTOR */}
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#398B9A]">
                Choose your day
              </p>
              <h2 className="font-serif text-3xl font-black text-[#24515B] dark:text-white">
                Your weekly rhythm
              </h2>
            </div>

            <p className="text-xs text-[#8AAAB0]">
              Select a day to jump to its menu
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {DAYS.map((day, index) => {
              const count = (meals[day.key] || []).length;
              const isSelected = selectedDay === day.key;

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day.key);
                    document.getElementById(`day-${day.key}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }}
                  className={`rounded-2xl border p-3 text-center transition-all duration-200 sm:p-4 ${
                    isSelected
                      ? 'border-[#24515B] bg-[#24515B] text-white shadow-lg shadow-[#24515B]/15'
                      : 'border-[#B8E8EE] bg-white text-[#24515B] hover:-translate-y-1 hover:bg-[#EFFAFC] dark:border-white/10 dark:bg-[#203C46] dark:text-white dark:hover:bg-[#294752]'
                  }`}
                >
                  <span className="block text-xl">{day.emoji}</span>
                  <span className={`mt-2 block text-[9px] font-black tracking-wider ${
                    isSelected ? 'text-[#B8E8EE]' : 'text-[#8AAAB0]'
                  }`}>
                    {day.short}
                  </span>
                  <span className={`mt-1 block font-serif text-lg font-black ${
                    isSelected ? 'text-white' : 'text-[#24515B] dark:text-white'
                  }`}>
                    {formatDate(getDateForDay(weekStart, index))}
                  </span>
                  <span className={`mt-1 block text-[9px] font-bold ${
                    isSelected ? 'text-white/60' : 'text-[#8AAAB0]'
                  }`}>
                    {count} {count === 1 ? 'meal' : 'meals'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <section className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* DAILY PROGRAM */}
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#398B9A]">
                  The plan
                </p>
                <h2 className="font-serif text-3xl font-black text-[#24515B] dark:text-white sm:text-4xl">
                  The daily menu<span className="text-[#7ADDF2]">.</span>
                </h2>
              </div>

              <span className="rounded-full bg-[#DDF5F7] px-4 py-2 text-[9px] font-black uppercase tracking-wider text-[#398B9A]">
                7 days · 1 week
              </span>
            </div>

            {loading ? (
              <div className="rounded-[26px] border border-[#B8E8EE] bg-white py-24 text-center dark:border-white/10 dark:bg-[#203C46]">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#B8E8EE] border-t-[#398B9A]" />
                <p className="mt-5 text-xs font-bold text-[#66858D]">
                  Preparing your weekly menu...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {DAYS.map((day, index) => {
                  const dayMeals = meals[day.key] || [];
                  const date = getDateForDay(weekStart, index);
                  const isSelected = selectedDay === day.key;

                  return (
                    <article
                      key={day.key}
                      id={`day-${day.key}`}
                      onMouseEnter={() => setSelectedDay(day.key)}
                      className={`scroll-mt-8 overflow-hidden rounded-[25px] border bg-white transition-all duration-300 dark:bg-[#203C46] ${
                        isSelected
                          ? 'border-[#7ADDF2] shadow-lg shadow-[#7ADDF2]/10'
                          : 'border-[#B8E8EE]/70 shadow-sm dark:border-white/10'
                      }`}
                    >
                      {/* DAY HEADER */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8E8EE]/50 bg-[#F3FBFC] px-5 py-5 dark:border-white/10 dark:bg-[#1C3540] sm:px-7">

                        <div className="flex items-center gap-4">
                          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                            index % 3 === 0
                              ? 'bg-[#DDF5F7]'
                              : index % 3 === 1
                                ? 'bg-[#EDE8FA]'
                                : 'bg-[#E7F5E9]'
                          }`}>
                            {day.emoji}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-xl font-black text-[#24515B] dark:text-white sm:text-2xl">
                                {day.label}
                              </h3>

                              {dayMeals.length > 0 && (
                                <span className="rounded-full bg-[#BFE8C8] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-[#35634A]">
                                  Planned
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-[10px] font-semibold text-[#8AAAB0]">
                              {formatDate(date, {
                                day: 'numeric',
                                month: 'long',
                              })} · {day.period}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDay(day.key);
                            setPickerOpen(day.key);
                            setSearchQuery('');
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-[#24515B] px-4 py-2.5 text-[10px] font-black text-white transition-all hover:bg-[#398B9A]"
                        >
                          <Plus size={15} />
                          Add meal
                        </button>
                      </div>

                      {/* DAY MEALS */}
                      <div className="p-5 sm:p-6">
                        {dayMeals.length === 0 ? (
                          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#B8DCE1] bg-[#FBFEFE] px-5 py-9 text-center dark:border-white/15 dark:bg-[#1C3540] sm:flex-row sm:justify-between sm:text-left">
                            <div className="flex flex-col items-center gap-3 sm:flex-row">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF5F7] text-[#398B9A]">
                                <Utensils size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-[#24515B] dark:text-white">
                                  Nothing on the menu yet
                                </p>
                                <p className="mt-1 text-xs text-[#8AAAB0]">
                                  Add a recipe to make this day delicious.
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDay(day.key);
                                setPickerOpen(day.key);
                                setSearchQuery('');
                              }}
                              className="mt-4 text-xs font-black text-[#398B9A] transition-colors hover:text-[#24515B] sm:mt-0"
                            >
                              + Choose a recipe
                            </button>
                          </div>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {dayMeals.map((recipe) => (
                              <div
                                key={recipe.id}
                                className="group relative flex min-w-0 items-center gap-3 rounded-2xl border border-[#B8E8EE]/60 bg-white p-3 transition-all hover:border-[#7ADDF2] hover:shadow-md dark:border-white/10 dark:bg-[#1C3540]"
                              >
                                <Link
                                  to={`/recipe/${recipe.id}`}
                                  className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#DDF5F7]"
                                >
                                  <img
                                    src={getImageUrl(recipe.image)}
                                    alt={recipe.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </Link>

                                <div className="min-w-0 flex-1">
                                  <Link
                                    to={`/recipe/${recipe.id}`}
                                    className="line-clamp-2 text-sm font-black text-[#24515B] transition-colors hover:text-[#398B9A] dark:text-white"
                                  >
                                    {recipe.name}
                                  </Link>

                                  <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#8AAAB0]">
                                    <BookOpen size={12} />
                                    {recipe.cuisine || 'Delicious recipe'}
                                  </p>

                                  <Link
                                    to={`/recipe/${recipe.id}`}
                                    className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#398B9A]"
                                  >
                                    View recipe
                                    <ArrowUpRight size={12} />
                                  </Link>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveRecipe(day.key, recipe.id)}
                                  aria-label={`Remove ${recipe.name}`}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8AAAB0] transition-all hover:bg-[#FCE9EF] hover:text-[#C15E78] dark:hover:bg-white/10"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-6">

            {/* WEEKLY PROGRESS */}
            <section className="overflow-hidden rounded-[26px] bg-[#24515B] p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B8E8EE]">
                  Your progress
                </span>
                <LayoutDashboard size={18} className="text-[#7ADDF2]" />
              </div>

              <div className="mt-7">
                <p className="font-serif text-5xl font-black">
                  {Math.round((plannedDays / 7) * 100)}%
                </p>
                <p className="mt-2 text-xs text-white/60">
                  of your week has a meal planned
                </p>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#B8E8EE] to-[#7ADDF2] transition-all duration-500"
                  style={{ width: `${(plannedDays / 7) * 100}%` }}
                />
              </div>

              <div className="mt-5 flex justify-between text-[9px] font-bold text-white/60">
                <span>{plannedDays} days planned</span>
                <span>{7 - plannedDays} remaining</span>
              </div>
            </section>

            {/* MEAL IDEAS */}
            <section className="rounded-[26px] border border-[#B8E8EE] bg-white p-6 dark:border-white/10 dark:bg-[#203C46]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE8FA] text-[#8170B5]">
                  <Sparkles size={19} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#398B9A]">
                    A little reminder
                  </p>
                  <h3 className="font-serif text-xl font-black text-[#24515B] dark:text-white">
                    Keep it balanced
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDF5F7] text-lg">🥑</span>
                  <div>
                    <p className="text-xs font-black text-[#24515B] dark:text-white">Fresh ingredients</p>
                    <p className="mt-0.5 text-[10px] text-[#8AAAB0]">Add some colour to your plate.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5E9] text-lg">🥦</span>
                  <div>
                    <p className="text-xs font-black text-[#24515B] dark:text-white">Variety matters</p>
                    <p className="mt-0.5 text-[10px] text-[#8AAAB0]">Explore different recipes.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FCEEF4] text-lg">🍓</span>
                  <div>
                    <p className="text-xs font-black text-[#24515B] dark:text-white">Enjoy every bite</p>
                    <p className="mt-0.5 text-[10px] text-[#8AAAB0]">Make time for the food you love.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SHOPPING LIST CTA */}
            <section className="relative overflow-hidden rounded-[26px] border border-[#B8E8EE] bg-gradient-to-br from-[#DDF5F7] to-[#B8E8EE] p-6">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />

              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#24515B] shadow-sm">
                  <ShoppingCart size={22} />
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#398B9A]">
                  Next step
                </p>

                <h3 className="mt-2 font-serif text-2xl font-black text-[#24515B]">
                  Ready to shop?
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#527982]">
                  Take your planned meals and turn them into one organized shopping list.
                </p>

                <Link
                  to="/shopping-list"
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#24515B] px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:bg-[#398B9A]"
                >
                  Open shopping list
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </section>

            {/* PRINT CTA */}
            <button
              type="button"
              onClick={() => setPrintOpen(true)}
              className="flex w-full items-center justify-between rounded-[22px] border border-[#B8E8EE] bg-white p-5 text-left transition-all hover:border-[#7ADDF2] hover:shadow-md dark:border-white/10 dark:bg-[#203C46]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE8FA] text-[#8170B5]">
                  <Printer size={19} />
                </span>
                <span>
                  <span className="block text-xs font-black text-[#24515B] dark:text-white">
                    Print your week
                  </span>
                  <span className="mt-1 block text-[10px] text-[#8AAAB0]">
                    Keep your menu close
                  </span>
                </span>
              </span>
              <ArrowUpRight size={17} className="text-[#398B9A]" />
            </button>
          </aside>
        </section>

        {/* BOTTOM MESSAGE */}
        <section className="mt-16 overflow-hidden rounded-[28px] border border-[#B8E8EE] bg-white dark:border-white/10 dark:bg-[#203C46]">
          <div className="grid items-center gap-5 px-7 py-8 sm:grid-cols-[1fr_auto] sm:px-10">
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#398B9A]">
                A week full of possibilities
              </p>
              <h2 className="font-serif text-2xl font-black text-[#24515B] dark:text-white sm:text-3xl">
                Good food, good mood.
              </h2>
              <p className="mt-2 text-xs text-[#8AAAB0]">
                Made with love, planned with Saveurs.
              </p>
            </div>

            <div className="flex items-center gap-3 text-3xl">
              <span>🍓</span>
              <span>🥑</span>
              <span>🍋</span>
              <span>🥗</span>
            </div>
          </div>
        </section>
      </div>

      {/* PRINT MODAL */}
      {printOpen && (
        <PrintMealPlan
          meals={meals}
          weekStart={weekStart}
          onClose={() => setPrintOpen(false)}
        />
      )}

      {/* RECIPE PICKER */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#142F37]/70 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPickerOpen(null);
              setSearchQuery('');
            }
          }}
        >
          <section className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-[#B8E8EE] bg-[#F7FCFD] shadow-2xl dark:border-white/10 dark:bg-[#203C46]">

            {/* MODAL HEADER */}
            <div className="relative overflow-hidden bg-[#24515B] px-6 py-7 text-white sm:px-8">
              <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full bg-[#7ADDF2]/20 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#7ADDF2]">
                    Build your weekly menu
                  </p>

                  <h2 className="font-serif text-2xl font-black sm:text-3xl">
                    Add a little flavour
                  </h2>

                  <p className="mt-2 text-xs text-white/65">
                    Choose a recipe for {DAYS.find((day) => day.key === pickerOpen)?.label}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPickerOpen(null);
                    setSearchQuery('');
                  }}
                  aria-label="Close recipe picker"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative mt-7">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#398B9A]"
                />

                <input
                  type="text"
                  placeholder="Search by recipe name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white py-4 pl-12 pr-4 text-sm font-semibold text-[#24515B] outline-none placeholder:text-[#8AAAB0] focus:border-[#7ADDF2]"
                />
              </div>
            </div>

            {/* RECIPE RESULTS */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              {filteredRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF5F7] text-[#398B9A]">
                    <Search size={27} />
                  </div>

                  <h3 className="font-serif text-2xl font-black text-[#24515B] dark:text-white">
                    No recipes found
                  </h3>

                  <p className="mt-2 text-xs text-[#8AAAB0]">
                    Try another name or a different search.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#398B9A]">
                      Choose your favourite
                    </p>
                    <span className="rounded-full bg-[#DDF5F7] px-3 py-1.5 text-[9px] font-black text-[#398B9A]">
                      {Math.min(filteredRecipes.length, 30)} recipes
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredRecipes.slice(0, 30).map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => handleAddRecipe(pickerOpen, recipe.id)}
                        className="group flex min-w-0 items-center gap-3 rounded-2xl border border-[#B8E8EE] bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#7ADDF2] hover:shadow-md dark:border-white/10 dark:bg-[#1C3540]"
                      >
                        <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#DDF5F7]">
                          <img
                            src={getImageUrl(recipe.image)}
                            alt={recipe.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-black text-[#24515B] transition-colors group-hover:text-[#398B9A] dark:text-white">
                            {recipe.name}
                          </p>

                          <p className="mt-2 text-[10px] font-semibold text-[#8AAAB0]">
                            {recipe.cuisine || 'World Cuisine'}
                          </p>
                        </div>

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DDF5F7] text-[#24515B] transition-all group-hover:bg-[#7ADDF2]">
                          <Plus size={17} />
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-[#B8E8EE] bg-white px-6 py-4 text-center dark:border-white/10 dark:bg-[#1C3540]">
              <p className="text-[10px] font-semibold text-[#8AAAB0]">
                Select a recipe to add it to your day.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default MealPlanner;
