
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getShoppingList } from '../services/mealPlanService';

import {
  ShoppingBasket,
  Check,
  Copy,
  Printer,
  CalendarDays,
  Lock,
  Leaf,
  Sparkles,
  CheckCheck,
  ArrowUpRight,
  PackageCheck,
  ArrowRight,
  ShoppingCart,
  Heart
} from 'lucide-react';

const ingredientEmojis = [
  '🥑', '🍅', '🥕', '🍋', '🥬',
  '🧀', '🥚', '🍓', '🥒', '🧄',
  '🧅', '🥦', '🍄', '🥔', '🌽'
];

function ShoppingList() {
  const { user } = useAuth();

  const [ingredients, setIngredients] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    date.setDate(diff);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${dayOfMonth}`;
  }

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const weekStart = getMonday(new Date());

    getShoppingList(weekStart)
      .then(res => {
        if (active) {
          setIngredients(res.data.ingredients || []);
          setChecked({});
        }
      })
      .catch(err => {
        console.error('Shopping list error:', err);

        if (active) {
          toast.error('Could not load your shopping list.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const toggleCheck = (index) => {
    setChecked(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const checkedCount = ingredients.filter((_, i) => checked[i]).length;

  const progress = ingredients.length
    ? Math.round((checkedCount / ingredients.length) * 100)
    : 0;

  const remainingCount = ingredients.length - checkedCount;

  const toggleAll = () => {
    if (checkedCount === ingredients.length) {
      setChecked({});
    } else {
      const allChecked = {};

      ingredients.forEach((_, i) => {
        allChecked[i] = true;
      });

      setChecked(allChecked);
    }
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
      <div className="flex min-h-[85vh] items-center justify-center bg-[#FDF9F8] px-5 dark:bg-[#341F18]">
        <div className="relative w-full max-w-lg overflow-hidden rounded-[18px] border border-[#EDC7B9] bg-white p-10 text-center shadow-xl shadow-[#EB9D81]/10 dark:border-white/10 dark:bg-[#452B21] sm:p-14">

          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#EB9D81]/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#E6D6C6]/20 blur-3xl" />

          <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[18px] bg-[#EDC7B9] text-[#5A3325]">
            <Lock size={34} />
          </div>

          <p className="relative mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#98543B]">
            Welcome to Saveurs
          </p>

          <h2 className="relative mb-4 font-serif text-4xl font-black text-[#5A3325] dark:text-white">
            Your basket is waiting!
          </h2>

          <p className="relative mb-9 text-sm leading-7 text-[#8C7167] dark:text-gray-300">
            Sign in to organize your ingredients, plan your meals and make shopping easier.
          </p>

          <Link
            to="/login"
            className="relative inline-flex items-center gap-3 rounded-full bg-[#EB9D81] px-8 py-4 text-sm font-black text-[#5A3325] shadow-lg shadow-[#EB9D81]/20 transition-all hover:-translate-y-1 hover:bg-[#EDC7B9]"
          >
            Enter Saveurs
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#FDF9F8] text-[#5A3325] transition-colors duration-300 dark:bg-[#341F18] dark:text-white">

      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-[#EDC7B9]/40 bg-[#5A3325] px-4 py-3 text-center text-[9px] font-black uppercase tracking-[0.22em] text-white sm:text-[10px]">
        <Sparkles size={14} className="text-[#EB9D81]" />
        <span>THE SAVEURS SHOPPING LIST</span>
        <span className="text-[#EDC7B9]">✳</span>
        <span className="hidden sm:inline text-white/70">
          Fresh ingredients. Happy kitchens.
        </span>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EDC7B9] via-[#F6E4DE] to-[#E6D6C6]/50">

        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute -bottom-32 left-[25%] h-96 w-96 rounded-full bg-[#EB9D81]/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-8 px-6 py-14 sm:px-10 md:grid-cols-[1.1fr_0.9fr] md:px-16 md:py-20 lg:py-24">

          {/* HERO TEXT */}
          <div className="relative z-10">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5A3325]/10 bg-white/70 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#864F3B] shadow-sm">
              <Leaf size={14} />
              Your weekly shopping board
            </div>

            <h1 className="font-serif text-[clamp(3.5rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.06em] text-[#5A3325]">
              SHOPPING
              <br />
              <span className="italic text-[#98543B]">made easy.</span>
            </h1>

            <p className="mt-8 max-w-md text-sm font-semibold leading-7 text-[#815F53] sm:text-base">
              Everything you need for your favourite recipes, all in one place. Plan your meals, collect your ingredients and enjoy cooking.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                to="/meal-planner"
                className="group inline-flex items-center gap-3 rounded-full bg-[#5A3325] px-7 py-4 text-xs font-black text-white shadow-xl shadow-[#5A3325]/15 transition-all hover:-translate-y-1 hover:bg-[#864F3B]"
              >
                Plan my meals
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#98543B]/30 bg-white/50 px-5 py-4 text-[10px] font-black uppercase tracking-wider text-[#5A3325]">
                <Heart size={15} className="text-[#98543B]" />
                Made with love
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-[9px] font-black uppercase tracking-[0.18em] text-[#815F53]">
              <span>01 — PLAN</span>
              <span className="text-[#98543B]">✳</span>
              <span>02 — SHOP</span>
              <span className="text-[#98543B]">✳</span>
              <span>03 — ENJOY</span>
            </div>
          </div>

          {/* HERO ART */}
          <div className="relative mx-auto flex w-full max-w-[490px] items-center justify-center py-8">

            <div className="relative flex aspect-square w-[88%] items-center justify-center rounded-[48%_48%_42%_42%] border border-white/60 bg-gradient-to-br from-[#EB9D81] to-[#EDC7B9] shadow-2xl shadow-[#98543B]/15">

              <div className="absolute inset-4 rounded-[48%_48%_42%_42%] border-2 border-dashed border-[#5A3325]/20" />

              <div className="relative flex -rotate-6 flex-col items-center">
                <span className="text-8xl drop-shadow-lg sm:text-9xl">🥬</span>
                <div className="-mt-9 flex items-center justify-center gap-1">
                  <span className="text-7xl drop-shadow-lg sm:text-8xl">🥑</span>
                  <span className="text-6xl drop-shadow-lg sm:text-7xl">🍅</span>
                </div>
                <div className="-mt-5 flex items-center gap-2">
                  <span className="text-6xl drop-shadow-lg">🥕</span>
                  <span className="text-6xl drop-shadow-lg">🍋</span>
                </div>
              </div>

              <div className="absolute -left-8 top-[18%] -rotate-12 rounded-2xl bg-white px-4 py-3 shadow-xl">
                <span className="block text-[9px] font-black uppercase tracking-widest text-[#A37B6C]">
                  Fresh ideas
                </span>
                <span className="font-serif text-xl font-black text-[#5A3325]">
                  Every day!
                </span>
              </div>

              <div className="absolute -right-7 bottom-[18%] rotate-6 rounded-2xl bg-[#5A3325] px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2 text-[#EDC7B9]">
                  <Leaf size={17} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Eat fresh
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 rotate-12 text-5xl text-[#98543B]">✳</div>
            <div className="absolute bottom-2 left-0 -rotate-12 text-4xl text-[#5A3325]">✳</div>

            <div className="absolute bottom-0 left-2 -rotate-6 rounded-xl border border-[#EDC7B9] bg-white px-5 py-4 shadow-xl dark:border-white/10 dark:bg-[#452B21]">
              <p className="font-serif text-sm italic text-[#98543B]">
                Good food,
              </p>
              <p className="font-serif text-base font-black text-[#5A3325] dark:text-white">
                starts here ♡
              </p>
            </div>
          </div>
        </div>

        {/* HERO BOTTOM STRIP */}
        <div className="relative border-t border-white/10 bg-[#5A3325] px-6 py-4">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#EDC7B9]">
              GOOD FOOD STARTS HERE
            </span>

            <div className="flex items-center gap-4 text-xl">
              <span>🍓</span>
              <span>🥑</span>
              <span>🍅</span>
              <span>🥕</span>
              <span>🍋</span>
              <span>🥦</span>
            </div>

            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
              MADE WITH LOVE — SAVEURS
            </span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-[1250px] px-5 py-14 sm:px-8 md:py-20">

        {/* SECTION HEADING */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-1.5 w-8 rounded-full bg-[#EB9D81]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98543B]">
                Your personal grocery board
              </span>
            </div>

            <h2 className="font-serif text-4xl font-black tracking-tight text-[#5A3325] dark:text-white sm:text-5xl">
              Let's get shopping<span className="text-[#98543B]">!</span>
            </h2>
          </div>

          <Link
            to="/meal-planner"
            className="group inline-flex items-center gap-2 rounded-full border border-[#EB9D81] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#5A3325] transition-all hover:bg-[#EDC7B9] dark:border-white/15 dark:bg-[#452B21] dark:text-white"
          >
            Meal planner
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {loading ? (

          <div className="rounded-[18px] border border-[#EDC7B9]/60 bg-white px-6 py-24 text-center shadow-sm dark:border-white/10 dark:bg-[#452B21]">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#EDC7B9] border-t-[#98543B]" />
            <p className="mt-5 text-sm font-semibold text-[#8C7167] dark:text-gray-300">
              Gathering your ingredients...
            </p>
          </div>

        ) : ingredients.length === 0 ? (

          /* EMPTY STATE */
          <section className="relative overflow-hidden rounded-[18px] border border-[#EDC7B9]/50 bg-gradient-to-br from-[#5A3325] to-[#864F3B] text-white shadow-xl shadow-[#5A3325]/10">

            <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#EB9D81]/20 blur-3xl" />
            <div className="absolute -bottom-32 left-[20%] h-80 w-80 rounded-full bg-[#E6D6C6]/20 blur-3xl" />

            <div className="relative grid items-center md:grid-cols-[1fr_0.9fr]">

              <div className="px-7 py-12 sm:px-12 md:py-16">

                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#EDC7B9] px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#5A3325]">
                  <Sparkles size={13} />
                  A fresh beginning
                </div>

                <h3 className="max-w-md font-serif text-5xl font-black leading-[1.02] sm:text-6xl">
                  Your basket
                  <span className="block italic text-[#EDC7B9]">
                    needs
                  </span>
                  some love!
                </h3>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">
                  Your shopping board is empty for now. Pick your favourite recipes and we'll gather all the ingredients right here.
                </p>

                <Link
                  to="/meal-planner"
                  className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#EB9D81] px-7 py-4 text-xs font-black text-[#5A3325] transition-all hover:-translate-y-1 hover:bg-white"
                >
                  Build my shopping list
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <p className="mt-7 text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                  PICK RECIPES · GET INGREDIENTS · ENJOY
                </p>
              </div>

              {/* EMPTY STATE ART */}
              <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden px-8 py-10 md:min-h-[510px]">

                <div className="absolute h-[300px] w-[300px] rounded-full border border-dashed border-white/25 sm:h-[370px] sm:w-[370px]" />
                <div className="absolute h-[230px] w-[230px] rounded-full border border-white/20 sm:h-[290px] sm:w-[290px]" />

                <div className="relative flex h-64 w-64 rotate-[-5deg] flex-col items-center justify-center rounded-[45px] bg-gradient-to-br from-[#EDC7B9] to-[#EB9D81] shadow-2xl shadow-black/20 sm:h-80 sm:w-80">

                  <div className="absolute inset-4 rounded-[18px] border-2 border-dashed border-[#5A3325]/25" />

                  <div className="relative text-center">
                    <div className="text-8xl drop-shadow-lg sm:text-9xl">
                      🧺
                    </div>
                    <p className="mt-3 font-serif text-xl font-black italic text-[#5A3325]">
                      Fill me up!
                    </p>
                  </div>

                  <div className="absolute -right-5 top-5 flex h-16 w-16 rotate-12 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl">
                    🍓
                  </div>

                  <div className="absolute -bottom-4 -left-5 flex h-16 w-16 -rotate-12 items-center justify-center rounded-2xl bg-[#E6D6C6] text-3xl shadow-xl">
                    🥑
                  </div>
                </div>

                <div className="absolute right-3 top-10 rotate-6 rounded-xl bg-white px-4 py-3 shadow-xl sm:right-10">
                  <p className="font-serif text-sm font-black text-[#5A3325]">
                    Fresh food
                  </p>
                  <p className="font-serif text-sm italic text-[#98543B]">
                    happy mood!
                  </p>
                </div>

                <div className="absolute bottom-8 left-3 -rotate-6 rounded-xl bg-[#EDC7B9] px-4 py-3 shadow-xl sm:left-10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#5A3325]">
                    Shop smart ♡
                  </p>
                </div>
              </div>
            </div>
          </section>

        ) : (

          <>
            {/* PROGRESS + STATS */}
            <section className="mb-8 grid gap-4 md:grid-cols-[1fr_250px]">

              <div className="relative overflow-hidden rounded-[18px] bg-[#5A3325] p-7 text-white sm:p-9">
                <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#EB9D81]/15 blur-3xl" />

                <div className="relative flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.25em] text-[#EDC7B9]">
                      THE SHOPPING REPORT
                    </p>

                    <h3 className="font-serif text-3xl font-black sm:text-4xl">
                      {progress === 100
                        ? 'Basket complete!'
                        : 'Your shopping progress'}
                    </h3>

                    <p className="mt-3 text-xs text-white/65">
                      {checkedCount} collected · {remainingCount} still to find
                    </p>
                  </div>

                  <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[5px] border-[#EB9D81] bg-white/5">
                    <span className="font-serif text-2xl font-black text-[#EDC7B9]">
                      {progress}%
                    </span>
                  </div>
                </div>

                <div className="relative mt-8 h-3 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#EDC7B9] via-[#EB9D81] to-[#E6D6C6] transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="relative mt-5 flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    START
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                    ALMOST THERE
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#EDC7B9]">
                    COMPLETE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">

                <div className="flex flex-col justify-between rounded-[18px] border border-[#EDC7B9] bg-[#F6E4DE] p-5 text-[#5A3325]">
                  <ShoppingBasket size={23} />
                  <div>
                    <p className="font-serif text-4xl font-black">
                      {ingredients.length}
                    </p>
                    <p className="mt-1 text-[9px] font-black uppercase tracking-widest">
                      Total items
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[18px] border border-[#E6D6C6]/50 bg-[#F7F2ED] p-5 text-[#6A5E51]">
                  <PackageCheck size={23} />
                  <div>
                    <p className="font-serif text-4xl font-black">
                      {remainingCount}
                    </p>
                    <p className="mt-1 text-[9px] font-black uppercase tracking-widest">
                      To collect
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* INGREDIENT CHECKLIST */}
            <section className="overflow-hidden rounded-[18px] border border-[#EDC7B9] bg-white shadow-sm dark:border-white/10 dark:bg-[#452B21]">

              <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#EDC7B9] bg-[#FCF3EF] px-6 py-7 sm:px-9 dark:border-white/10 dark:bg-[#3F261D]">

                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.25em] text-[#98543B]">
                    YOUR SHOPPING CHECKLIST
                  </p>

                  <h3 className="font-serif text-3xl font-black text-[#5A3325] dark:text-white">
                    On the list<span className="text-[#EB9D81]">.</span>
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={toggleAll}
                  className="inline-flex items-center gap-2 rounded-full bg-[#EB9D81] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#5A3325] transition-all hover:bg-[#EDC7B9]"
                >
                  <CheckCheck size={15} />
                  {checkedCount === ingredients.length
                    ? 'Uncheck all'
                    : 'Check all'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-px bg-[#F3E3DE] sm:grid-cols-2 dark:bg-white/10">
                {ingredients.map((ing, i) => (
                  <button
                    key={`${ing}-${i}`}
                    type="button"
                    onClick={() => toggleCheck(i)}
                    aria-pressed={!!checked[i]}
                    className={`group flex min-h-[92px] items-center gap-4 px-5 py-5 text-left transition-all duration-200 sm:px-7 ${
                      checked[i]
                        ? 'bg-[#F8EEEA] dark:bg-[#4A322A]'
                        : 'bg-white hover:bg-[#FCF6F3] dark:bg-[#452B21] dark:hover:bg-[#51342A]'
                    }`}
                  >
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-all group-hover:scale-110 ${
                      checked[i]
                        ? 'bg-[#EADFC8]'
                        : i % 3 === 0
                          ? 'bg-[#F6E4DE]'
                          : i % 3 === 1
                            ? 'bg-[#FBEEE9]'
                            : 'bg-[#F7F2ED]'
                    }`}>
                      {ingredientEmojis[i % ingredientEmojis.length]}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-black transition-all ${
                        checked[i]
                          ? 'text-[#A88679] line-through'
                          : 'text-[#5A3325] dark:text-white'
                      }`}>
                        {ing}
                      </span>

                      <span className={`mt-1 block text-[9px] font-black uppercase tracking-widest ${
                        checked[i]
                          ? 'text-[#A88679]'
                          : 'text-[#AF958B]'
                      }`}>
                        {checked[i] ? 'Collected ✓' : 'Tap to collect'}
                      </span>
                    </span>

                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      checked[i]
                        ? 'border-[#98543B] bg-[#98543B] text-white'
                        : 'border-[#E0C3B9] text-transparent group-hover:border-[#98543B] dark:border-white/20'
                    }`}>
                      <Check size={15} strokeWidth={3} />
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDC7B9] bg-[#FCF3EF] px-6 py-5 dark:border-white/10 dark:bg-[#3F261D] sm:px-9">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#815F53] dark:text-[#EDC7B9]">
                  <Leaf size={15} />
                  Shop fresh. Live well.
                </div>

                <span className="font-serif text-sm font-bold italic text-[#98543B]">
                  Made with love ♡
                </span>
              </div>
            </section>

            {/* ACTION BAR */}
            <section className="no-print mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[18px] border border-[#EDC7B9] bg-white p-5 dark:border-white/10 dark:bg-[#452B21]">

              <div>
                <p className="font-serif text-xl font-black text-[#5A3325] dark:text-white">
                  Ready to go shopping?
                </p>
                <p className="mt-1 text-xs text-[#A28A82] dark:text-gray-400">
                  Keep your list close while you shop.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-full border border-[#EDC7B9] px-5 py-3 text-xs font-black text-[#5A3325] transition-all hover:bg-[#FCF3EF] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                >
                  <Copy size={15} />
                  Copy
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5A3325] px-5 py-3 text-xs font-black text-white transition-all hover:bg-[#864F3B]"
                >
                  <Printer size={15} />
                  Print
                </button>

                <Link
                  to="/meal-planner"
                  className="inline-flex items-center gap-2 rounded-full bg-[#EB9D81] px-5 py-3 text-xs font-black text-[#5A3325] transition-all hover:bg-[#EDC7B9]"
                >
                  <CalendarDays size={15} />
                  Meal Planner
                </Link>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="mt-16 border-t border-[#EDC7B9] pt-9 text-center dark:border-white/10">
          <div className="mb-3 flex justify-center gap-3 text-2xl">
            <span>🍓</span>
            <span>🥑</span>
            <span>🍋</span>
            <span>🍅</span>
          </div>

          <p className="font-serif text-xl font-black italic text-[#5A3325] dark:text-[#EDC7B9]">
            Good food is always worth the trip.
          </p>

          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.25em] text-[#AF958B]">
            Made with love by Saveurs
          </p>
        </footer>
      </main>
    </div>
  );
}

export default ShoppingList;
