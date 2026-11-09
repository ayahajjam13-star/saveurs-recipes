
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
    background: 'bg-[#EAF7F5]',
    number: 'text-[#55A49A]',
    quantity: 'text-[#397D75]',
    decoration: 'bg-[#BFE8C8]',
  },
  {
    background: 'bg-[#FFF0F5]',
    number: 'text-[#C18BB5]',
    quantity: 'text-[#A47791]',
    decoration: 'bg-[#F2C7DB]',
  },
  {
    background: 'bg-[#F1EDFA]',
    number: 'text-[#9983C6]',
    quantity: 'text-[#75619F]',
    decoration: 'bg-[#CBB7F5]',
  },
  {
    background: 'bg-[#EAF7FC]',
    number: 'text-[#58A9C1]',
    quantity: 'text-[#397D88]',
    decoration: 'bg-[#B8E8EE]',
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
      <div className="relative overflow-hidden border-b border-[#DCEBE8] pb-8 dark:border-white/10">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C18BB5]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A47791]">
                THE INGREDIENT COLLECTION
              </span>
            </div>

            <h3 className="font-serif text-4xl font-black leading-none tracking-tight text-[#294B55] sm:text-5xl dark:text-white">
              Ingredients<span className="text-[#7ADDF2]">.</span>
            </h3>

            <p className="mt-4 text-xs leading-6 text-[#789197] dark:text-gray-300">
              Every little detail makes the difference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B8E8EE]/40 text-[#397D88]">
              <Leaf size={20} />
            </div>

            <div>
              <p className="text-2xl font-black tabular-nums text-[#294B55] dark:text-white">
                {scaledIngredients.length.toString().padStart(2, '0')}
              </p>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#91A9AD]">
                Ingredients
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* COMPACT RECIPE CONTROLS */}
      <div className="flex flex-col gap-6 border-b border-[#DCEBE8] pb-7 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">

        {/* SERVINGS */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Users size={15} className="text-[#54BFD2]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#789197]">
              Servings
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setServings((prev) => Math.max(1, prev - 1))}
              disabled={servings <= 1}
              aria-label="Decrease servings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCEBE8] text-[#397D88] transition hover:border-[#7ADDF2] hover:bg-[#B8E8EE]/30 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/15"
            >
              <Minus size={15} />
            </button>

            <span className="min-w-[25px] text-center font-serif text-3xl font-black tabular-nums text-[#294B55] dark:text-white">
              {servings}
            </span>

            <button
              type="button"
              onClick={() => setServings((prev) => prev + 1)}
              aria-label="Increase servings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCEBE8] text-[#397D88] transition hover:border-[#7ADDF2] hover:bg-[#B8E8EE]/30 dark:border-white/15"
            >
              <Plus size={15} />
            </button>

            {servings !== baseServings && (
              <button
                type="button"
                onClick={() => setServings(baseServings)}
                className="ml-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#B987B4] transition hover:text-[#A47791]"
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
            <Ruler size={15} className="text-[#C18BB5]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#789197]">
              Measurement system
            </span>
          </div>

          <div className="inline-flex items-center gap-1 rounded-full bg-[#EDF4F2] p-1 dark:bg-white/10">

            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              aria-pressed={unitSystem === 'metric'}
              className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                unitSystem === 'metric'
                  ? 'bg-[#294B55] text-white shadow-sm dark:bg-[#7ADDF2] dark:text-[#24515B]'
                  : 'text-[#789197] hover:text-[#294B55] dark:text-gray-300'
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
                  ? 'bg-[#294B55] text-white shadow-sm dark:bg-[#7ADDF2] dark:text-[#24515B]'
                  : 'text-[#789197] hover:text-[#294B55] dark:text-gray-300'
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
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#91A9AD]">
            THE COMPOSITION
          </p>

          <span className="text-[9px] font-bold text-[#91A9AD]">
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

                    <p className="mt-2 break-words text-xs font-bold leading-5 text-[#45666C] sm:text-sm dark:text-[#294B55]">
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
          <div className="py-12 text-center text-sm text-[#789197]">
            No ingredients available.
          </div>
        )}

      </div>

      {/* SCALING FEEDBACK */}
      {servings !== baseServings && (
        <div className="flex items-start gap-3 border-l-2 border-[#CBB7F5] bg-[#F1EDFA] px-4 py-4 dark:bg-white/5">

          <Sparkles size={17} className="mt-0.5 shrink-0 text-[#9983C6]" />

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#75619F]">
              Recipe adjusted
            </p>

            <p className="mt-1 text-xs leading-6 text-[#75619F]">
              Quantities have been recalculated from{' '}
              <strong>{baseServings} servings</strong> to{' '}
              <strong>{servings} servings</strong>.
            </p>
          </div>

        </div>
      )}

      {/* FOOTNOTE */}
      <div className="flex items-center justify-between border-t border-[#DCEBE8] pt-5 dark:border-white/10">
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#91A9AD]">
          PREPARE WITH LOVE
        </span>

        <div className="flex items-center gap-2 text-[#B987B4]">
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
