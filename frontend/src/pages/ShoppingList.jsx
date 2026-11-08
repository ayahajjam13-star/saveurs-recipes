
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
  CheckCheck
} from 'lucide-react';

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
        }
      })
      .catch(err => {
        console.error('Shopping list error:', err);
        if (active) toast.error('Could not load your shopping list.');
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
      <div className="min-h-[70vh] flex items-center justify-center px-5 bg-[#FAF7F0] dark:bg-[#1A1512]">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-[#E88FA5]/10 flex items-center justify-center mx-auto mb-6">
            <Lock size={34} className="text-[#E88FA5]" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#1A1512] dark:text-white mb-4">
            Your shopping list awaits
          </h2>

          <p className="text-[#718B68] mb-8 leading-relaxed">
            Please sign in to access your personalized shopping list.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#E88FA5] text-white rounded-full font-sans font-bold hover:bg-[#718B68] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#1A1512] transition-colors">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1A1512] py-16 md:py-20 px-5">
        <div className="absolute -top-20 -right-10 w-72 h-72 bg-[#E88FA5]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-[#718B68]/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#F5D8C8] text-xs font-sans font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Smart Meal Planning
          </div>

          <div className="w-16 h-16 bg-[#E88FA5] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#E88FA5]/20">
            <ShoppingBasket size={32} className="text-white" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#FAF7F0] mb-5">
            Shopping List
          </h1>

          <p className="text-[#FAF7F0]/65 text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need for a delicious week, organized in one place.
          </p>

          <div className="flex justify-center gap-3 mt-8">
            <div className="bg-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold text-white">
                {ingredients.length}
              </p>
              <p className="text-xs text-[#F5D8C8]">Ingredients</p>
            </div>

            <div className="bg-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold text-[#E88FA5]">
                {checkedCount}
              </p>
              <p className="text-xs text-[#F5D8C8]">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-12">

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#E88FA5]/30 border-t-[#E88FA5] rounded-full animate-spin mx-auto" />
            <p className="mt-5 text-[#718B68] font-sans">
              Preparing your shopping list...
            </p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="bg-white dark:bg-[#28221E] rounded-3xl p-10 md:p-14 text-center shadow-sm border border-[#718B68]/10">
            <div className="w-20 h-20 bg-[#F5D8C8]/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBasket size={38} className="text-[#E88FA5]" />
            </div>

            <h3 className="font-serif text-3xl font-bold text-[#1A1512] dark:text-white mb-4">
              Your list is empty
            </h3>

            <p className="text-[#718B68] leading-relaxed mb-8 max-w-md mx-auto">
              Add delicious recipes to your Meal Planner and your shopping list will be ready here.
            </p>

            <Link
              to="/meal-planner"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#E88FA5] text-white rounded-full font-sans font-bold hover:bg-[#718B68] transition-colors"
            >
              <CalendarDays size={18} />
              Go to Meal Planner
            </Link>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="bg-white dark:bg-[#28221E] rounded-3xl p-6 md:p-8 mb-6 border border-[#718B68]/10 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[#718B68] text-xs font-sans font-bold uppercase tracking-widest mb-1">
                    Your progress
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1512] dark:text-white">
                    {checkedCount === ingredients.length
                      ? 'Everything is ready!'
                      : 'Keep going!'}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-full border-4 border-[#E88FA5] flex items-center justify-center text-[#E88FA5] font-bold text-sm">
                  {progress}%
                </div>
              </div>

              <div className="h-3 bg-[#F5D8C8]/50 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#718B68] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-5">
                <span className="text-sm text-[#718B68] font-sans">
                  {checkedCount} of {ingredients.length} items collected
                </span>

                <button
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-sm font-sans font-bold text-[#E88FA5] hover:text-[#718B68] transition-colors"
                >
                  <CheckCheck size={16} />
                  {checkedCount === ingredients.length
                    ? 'Uncheck all'
                    : 'Check all'}
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white dark:bg-[#28221E] rounded-3xl p-6 md:p-8 shadow-sm border border-[#718B68]/10 mb-7">

              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#718B68]/15">
                <div className="w-11 h-11 rounded-xl bg-[#E88FA5]/10 flex items-center justify-center">
                  <ShoppingBasket size={22} className="text-[#E88FA5]" />
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1A1512] dark:text-white">
                    Your ingredients
                  </h3>
                  <p className="text-xs text-[#718B68] font-sans mt-1">
                    Tap an item when you have it
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                      checked[i]
                        ? 'bg-[#718B68]/10'
                        : 'hover:bg-[#F5D8C8]/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleCheck(i)}
                      aria-label={checked[i] ? 'Uncheck ingredient' : 'Check ingredient'}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                        checked[i]
                          ? 'bg-[#718B68] border-[#718B68] text-white'
                          : 'border-[#E88FA5]/50 hover:border-[#E88FA5]'
                      }`}
                    >
                      {checked[i] && <Check size={17} strokeWidth={3} />}
                    </button>

                    <span
                      className={`flex-1 font-sans leading-relaxed transition-colors ${
                        checked[i]
                          ? 'line-through text-[#718B68]/60'
                          : 'text-[#1A1512]/85 dark:text-gray-200'
                      }`}
                    >
                      {ing}
                    </span>

                    {checked[i] && (
                      <span className="text-[#718B68] text-xs font-sans font-bold">
                        Done
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center no-print">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-[#28221E] border border-[#718B68]/20 text-[#1A1512] dark:text-white rounded-full font-sans font-bold hover:border-[#E88FA5] transition-all"
              >
                <Copy size={17} />
                Copy List
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E88FA5] text-white rounded-full font-sans font-bold hover:bg-[#718B68] transition-all shadow-lg shadow-[#E88FA5]/20"
              >
                <Printer size={17} />
                Print List
              </button>

              <Link
                to="/meal-planner"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-[#28221E] border border-[#718B68]/20 text-[#1A1512] dark:text-white rounded-full font-sans font-bold hover:border-[#E88FA5] transition-all"
              >
                <CalendarDays size={17} />
                Meal Planner
              </Link>
            </div>
          </>
        )}

        {/* Footer note */}
        {!loading && ingredients.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2 text-[#718B68] text-sm font-sans">
            <Leaf size={17} />
            <span>Shop smart, cook fresh, and enjoy every bite.</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default ShoppingList;
