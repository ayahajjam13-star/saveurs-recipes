
import { useState, useEffect } from 'react';
import {
  Users,
  Ruler,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Scale,
  Leaf,
} from 'lucide-react';

// Approximate unit conversions
const CONVERSIONS = {
  g: { cup: 0.0042, tbsp: 0.067, tsp: 0.2 },
  ml: { cup: 0.0042, tbsp: 0.067, tsp: 0.2 },
  kg: { cup: 4.2, tbsp: 67, tsp: 200 },
  l: { cup: 4.2, tbsp: 67, tsp: 200 },
};

const ingredientStyles = [
  {
    background: 'bg-[#F7EEEA]',
    number: 'text-[#A26B57]',
    quantity: 'text-[#7B4C3B]',
    decoration: 'bg-[#EADFC8]',
  },
  {
    background: 'bg-[#FDF9F2]',
    number: 'text-[#B9AA93]',
    quantity: 'text-[#9D917E]',
    decoration: 'bg-[#ECE0CD]',
  },
  {
    background: 'bg-[#F7F3F0]',
    number: 'text-[#B5A494]',
    quantity: 'text-[#908070]',
    decoration: 'bg-[#E6D6C6]',
  },
  {
    background: 'bg-[#FCEFEA]',
    number: 'text-[#BE755B]',
    quantity: 'text-[#864F3B]',
    decoration: 'bg-[#EDC7B9]',
  },
];

function RecipeScaling({ ingredients = [], baseServings = 4 }) {
  const [servings, setServings] = useState(baseServings);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [scaledIngredients, setScaledIngredients] = useState([]);

  const parseIngredient = (ing) => {
    const match = ing.match(/^([\d.,/]+)\s*([a-zA-Z]+)?\s*(.+)?$/);

    if (!match) {
      return { quantity: null, unit: null, name: ing };
    }

    const quantityStr = match[1];
    let quantity;

    if (quantityStr.includes('/')) {
      const [num, den] = quantityStr.split('/').map(Number);
      quantity = den !== 0 ? num / den : null;
    } else {
      quantity = parseFloat(quantityStr.replace(',', '.'));
    }

    return {
      quantity,
      unit: match[2] || '',
      name: match[3] || '',
    };
  };

  const formatQuantity = (qty) => {
    if (qty == null || !Number.isFinite(qty)) return '';

    if (Number.isInteger(qty)) return qty.toString();

    const fractions = {
      '0.25': '¼',
      '0.33': '⅓',
      '0.5': '½',
      '0.67': '⅔',
      '0.75': '¾',
    };

    const whole = Math.floor(qty);
    const decimal = qty - whole;
    const fraction = fractions[decimal.toFixed(2)];

    if (fraction) {
      return whole > 0 ? `${whole} ${fraction}` : fraction;
    }

    return Number(qty.toFixed(2)).toString();
  };

  const convertUnit = (quantity, unit) => {
    if (unitSystem === 'metric' || !unit) {
      return { quantity, unit };
    }

    const lowerUnit = unit.toLowerCase();
    const conversions = CONVERSIONS[lowerUnit];

    if (!conversions) {
      return { quantity, unit };
    }

    if (quantity >= 240) {
      return { quantity: quantity * conversions.cup, unit: 'cups' };
    }

    if (quantity >= 15) {
      return { quantity: quantity * conversions.tbsp, unit: 'tbsp' };
    }

    return { quantity: quantity * conversions.tsp, unit: 'tsp' };
  };

  useEffect(() => {
    const scale = servings / baseServings;

    const scaled = ingredients.map((ing) => {
      const parsed = parseIngredient(ing);

      if (parsed.quantity == null || !Number.isFinite(parsed.quantity)) {
        return ing;
      }

      const newQty = parsed.quantity * scale;
      const converted = convertUnit(newQty, parsed.unit);
      const formattedQty = formatQuantity(converted.quantity);

      return `${formattedQty} ${converted.unit} ${parsed.name}`
        .trim()
        .replace(/\s+/g, ' ');
    });

    setScaledIngredients(scaled);
  }, [servings, ingredients, unitSystem, baseServings]);

  // Separate the quantity from the ingredient name for visual display
  const getIngredientDisplay = (ingredient) => {
    const match = ingredient.match(
      /^((?:\d+\s)?[¼⅓½⅔¾]|\d+(?:\.\d+)?|[¼⅓½⅔¾])\s*(.*)$/
    );

    if (!match) {
      return {
        quantity: '',
        name: ingredient,
      };
    }

    return {
      quantity: match[1],
      name: match[2],
    };
  };

  return (
    <div className="space-y-10">

      {/* EDITORIAL HEADER */}
      <div className="relative overflow-hidden border-b border-[#EBE0DC] pb-8 dark:border-white/10">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B9AA93]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#9D917E]">
                THE INGREDIENT COLLECTION
              </span>
            </div>

            <h3 className="font-serif text-4xl font-black leading-none tracking-tight text-[#54352A] sm:text-5xl dark:text-white">
              Ingredients<span className="text-[#EB9D81]">.</span>
            </h3>

            <p className="mt-4 text-xs leading-6 text-[#968179] dark:text-gray-300">
              Every little detail makes the difference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDC7B9]/40 text-[#864F3B]">
              <Leaf size={20} />
            </div>

            <div>
              <p className="text-2xl font-black tabular-nums text-[#54352A] dark:text-white">
                {scaledIngredients.length.toString().padStart(2, '0')}
              </p>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#AC9992]">
                Ingredients
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* COMPACT RECIPE CONTROLS */}
      <div className="flex flex-col gap-6 border-b border-[#EBE0DC] pb-7 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">

        {/* SERVINGS */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Users size={15} className="text-[#CF7757]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#968179]">
              Servings
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setServings((prev) => Math.max(1, prev - 1))}
              disabled={servings <= 1}
              aria-label="Decrease servings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EBE0DC] text-[#864F3B] transition hover:border-[#EB9D81] hover:bg-[#EDC7B9]/30 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/15"
            >
              <Minus size={15} />
            </button>

            <span className="min-w-[25px] text-center font-serif text-3xl font-black tabular-nums text-[#54352A] dark:text-white">
              {servings}
            </span>

            <button
              type="button"
              onClick={() => setServings((prev) => prev + 1)}
              aria-label="Increase servings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EBE0DC] text-[#864F3B] transition hover:border-[#EB9D81] hover:bg-[#EDC7B9]/30 dark:border-white/15"
            >
              <Plus size={15} />
            </button>

            {servings !== baseServings && (
              <button
                type="button"
                onClick={() => setServings(baseServings)}
                className="ml-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#B2A38E] transition hover:text-[#9D917E]"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* MEASUREMENT SYSTEM */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Ruler size={15} className="text-[#B9AA93]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#968179]">
              Measurement system
            </span>
          </div>

          <div className="inline-flex items-center gap-1 rounded-full bg-[#F4EFED] p-1 dark:bg-white/10">

            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              aria-pressed={unitSystem === 'metric'}
              className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                unitSystem === 'metric'
                  ? 'bg-[#54352A] text-white shadow-sm dark:bg-[#EB9D81] dark:text-[#5A3325]'
                  : 'text-[#968179] hover:text-[#54352A] dark:text-gray-300'
              }`}
            >
              Metric
            </button>

            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              aria-pressed={unitSystem === 'imperial'}
              className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-[#54352A] text-white shadow-sm dark:bg-[#EB9D81] dark:text-[#5A3325]'
                  : 'text-[#968179] hover:text-[#54352A] dark:text-gray-300'
              }`}
            >
              Imperial
            </button>

          </div>
        </div>

      </div>

      {/* INGREDIENT COMPOSITION BOARD */}
      <div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#AC9992]">
            THE COMPOSITION
          </p>

          <span className="text-[9px] font-bold text-[#AC9992]">
            {servings} servings · {unitSystem}
          </span>
        </div>

        {scaledIngredients.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {scaledIngredients.map((ingredient, index) => {
              const display = getIngredientDisplay(ingredient);
              const style = ingredientStyles[index % ingredientStyles.length];

              return (
                <article
                  key={index}
                  className={`group relative flex min-h-[150px] flex-col justify-between overflow-hidden p-4 transition duration-300 hover:-translate-y-1 sm:min-h-[175px] sm:p-5 ${style.background}`}
                >

                  {/* DECORATIVE NUMBER */}
                  <div className="flex items-start justify-between">
                    <span className={`font-serif text-xs font-black ${style.number}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className={`h-2 w-2 rounded-full ${style.decoration}`} />
                  </div>

                  {/* QUANTITY */}
                  <div className="relative z-10 mt-6">
                    {display.quantity && (
                      <p className={`break-words font-serif text-2xl font-black leading-tight sm:text-3xl ${style.quantity}`}>
                        {display.quantity}
                      </p>
                    )}

                    <p className="mt-2 break-words text-xs font-bold leading-5 text-[#6B5046] sm:text-sm dark:text-[#54352A]">
                      {display.name}
                    </p>
                  </div>

                  {/* SUBTLE DECORATION */}
                  <div className={`absolute -bottom-8 -right-8 h-20 w-20 rounded-full opacity-30 transition duration-500 group-hover:scale-150 ${style.decoration}`} />

                </article>
              );
            })}

          </div>
        ) : (
          <div className="py-12 text-center text-sm text-[#968179]">
            No ingredients available.
          </div>
        )}

      </div>

      {/* SCALING FEEDBACK */}
      {servings !== baseServings && (
        <div className="flex items-start gap-3 border-l-2 border-[#E6D6C6] bg-[#F7F3F0] px-4 py-4 dark:bg-white/5">

          <Sparkles size={17} className="mt-0.5 shrink-0 text-[#B5A494]" />

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#908070]">
              Recipe adjusted
            </p>

            <p className="mt-1 text-xs leading-6 text-[#908070]">
              Quantities have been recalculated from{' '}
              <strong>{baseServings} servings</strong> to{' '}
              <strong>{servings} servings</strong>.
            </p>
          </div>

        </div>
      )}

      {/* FOOTNOTE */}
      <div className="flex items-center justify-between border-t border-[#EBE0DC] pt-5 dark:border-white/10">
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#AC9992]">
          PREPARE WITH LOVE
        </span>

        <div className="flex items-center gap-2 text-[#B2A38E]">
          <Scale size={13} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">
            Measure · Prepare · Enjoy
          </span>
        </div>
      </div>

    </div>
  );
}

export default RecipeScaling;
