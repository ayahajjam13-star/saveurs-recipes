
import { useState, useEffect } from 'react';
import {
  Users,
  Ruler,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Scale,
} from 'lucide-react';

// Approximate unit conversions
const CONVERSIONS = {
  g: { cup: 0.0042, tbsp: 0.067, tsp: 0.2 },
  ml: { cup: 0.0042, tbsp: 0.067, tsp: 0.2 },
  kg: { cup: 4.2, tbsp: 67, tsp: 200 },
  l: { cup: 4.2, tbsp: 67, tsp: 200 },
};

function RecipeScaling({ ingredients = [], baseServings = 4 }) {
  const [servings, setServings] = useState(baseServings);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [scaledIngredients, setScaledIngredients] = useState([]);

  const parseIngredient = (ing) => {
    const match = ing.match(/^([\d.,/]+)\s*([a-zA-Z]+)?\s*(.+)?$/);

    if (!match) {
      return { quantity: null, unit: null, name: ing };
    }

    let quantityStr = match[1];
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

  return (
    <div className="space-y-6">

      {/* Scaling Controls */}
      <div className="rounded-[24px] border border-[#EEE7DF] bg-[#FAF7F0] p-5 sm:p-6">

        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#E88FA5]/15">
            <Scale size={19} className="text-[#D77F96]" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#28221E]">
              Adjust Your Recipe
            </h3>
            <p className="text-xs text-[#8B8179]">
              Customize quantities to your needs
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          {/* Servings Counter */}
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#51453D]">
              <Users size={16} className="text-[#718B68]" />
              Number of servings
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                disabled={servings <= 1}
                aria-label="Decrease servings"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#E8DED4] text-[#51453D] hover:bg-[#E88FA5] hover:text-white hover:border-[#E88FA5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Minus size={16} />
              </button>

              <span className="w-9 text-center font-serif text-2xl font-bold text-[#28221E] tabular-nums">
                {servings}
              </span>

              <button
                type="button"
                onClick={() => setServings((prev) => prev + 1)}
                aria-label="Increase servings"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#E8DED4] text-[#51453D] hover:bg-[#E88FA5] hover:text-white hover:border-[#E88FA5] transition-all"
              >
                <Plus size={16} />
              </button>

              {servings !== baseServings && (
                <button
                  type="button"
                  onClick={() => setServings(baseServings)}
                  className="flex items-center gap-1.5 ml-1 text-xs font-semibold text-[#D77F96] hover:text-[#B9657E] transition-colors"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Unit System */}
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#51453D]">
              <Ruler size={16} className="text-[#718B68]" />
              Measurement units
            </span>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E8DED4]">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  unitSystem === 'metric'
                    ? 'bg-[#718B68] text-white shadow-sm'
                    : 'text-[#8B8179] hover:text-[#28221E]'
                }`}
              >
                Metric
              </button>

              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  unitSystem === 'imperial'
                    ? 'bg-[#718B68] text-white shadow-sm'
                    : 'text-[#8B8179] hover:text-[#28221E]'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-bold text-[#28221E]">
            Adjusted Ingredients
          </h4>

          <span className="text-xs font-medium text-[#718B68] bg-[#718B68]/10 px-3 py-1.5 rounded-full">
            {scaledIngredients.length} ingredients
          </span>
        </div>

        <ul className="space-y-2">
          {scaledIngredients.map((ing, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFFEFC] border border-[#F0EAE3] hover:border-[#E88FA5]/40 transition-colors"
            >
              <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-[#E88FA5]/10 text-[#D77F96] text-xs font-bold">
                {index + 1}
              </span>

              <span className="text-sm leading-relaxed text-[#51453D]">
                {ing}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scaling Note */}
      {servings !== baseServings && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#718B68]/10 border border-[#718B68]/15">
          <Sparkles size={17} className="text-[#718B68] shrink-0 mt-0.5" />

          <p className="text-xs leading-relaxed text-[#596D52]">
            Ingredient quantities have been adjusted from{' '}
            <strong>{baseServings} servings</strong> to{' '}
            <strong>{servings} servings</strong>.
          </p>
        </div>
      )}

    </div>
  );
}

export default RecipeScaling;
