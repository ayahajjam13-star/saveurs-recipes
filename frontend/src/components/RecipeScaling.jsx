import { useState, useEffect } from 'react';

// Unit conversions (approximate)
const CONVERSIONS = {
  g: { cup: 0.0042, tbsp: 0.067, tsp: 0.2 },
  ml: { cup: 0.0042, tbsp: 0.067, tsp: 0.2 },
  kg: { cup: 4.2, tbsp: 67, tsp: 200 },
  l: { cup: 4.2, tbsp: 67, tsp: 200 },
};

function RecipeScaling({ ingredients, baseServings = 4 }) {
  const [servings, setServings] = useState(baseServings);
  const [unitSystem, setUnitSystem] = useState('metric'); // metric | imperial
  const [scaledIngredients, setScaledIngredients] = useState([]);

  // Parse ingredient: "300 g chicken" → { quantity: 300, unit: 'g', name: 'chicken' }
  const parseIngredient = (ing) => {
    const match = ing.match(/^([\d.,/]+)\s*([a-zA-Z]+)?\s*(.+)?$/);
    if (!match) return { quantity: null, unit: null, name: ing };

    let quantityStr = match[1];
    // Handle fractions like "1/2"
    if (quantityStr.includes('/')) {
      const [num, den] = quantityStr.split('/').map(Number);
      quantityStr = num / den;
    } else {
      quantityStr = parseFloat(quantityStr.replace(',', '.'));
    }

    return {
      quantity: quantityStr,
      unit: match[2] || '',
      name: match[3] || '',
    };
  };

  // Format quantity nicely (e.g., 1.5 → "1 ½")
  const formatQuantity = (qty) => {
    if (!qty) return '';
    if (Number.isInteger(qty)) return qty.toString();
    
    const fractions = {
      '0.25': '¼',
      '0.5': '½',
      '0.75': '¾',
      '0.33': '⅓',
      '0.67': '⅔',
    };
    
    const decimal = qty - Math.floor(qty);
    const fracStr = fractions[decimal.toFixed(2)] || decimal.toFixed(1);
    
    if (qty < 1) return fracStr;
    return `${Math.floor(qty)} ${fracStr}`;
  };

  // Convert units
  const convertUnit = (quantity, unit) => {
    if (unitSystem === 'metric' || !unit) return { quantity, unit };
    
    const lowerUnit = unit.toLowerCase();
    const conversions = CONVERSIONS[lowerUnit];
    
    if (!conversions) return { quantity, unit };
    
    // Choose best imperial unit
    if (quantity >= 240 && conversions.cup) {
      return { quantity: quantity * conversions.cup, unit: 'cups' };
    }
    if (quantity >= 15 && conversions.tbsp) {
      return { quantity: quantity * conversions.tbsp, unit: 'tbsp' };
    }
    if (conversions.tsp) {
      return { quantity: quantity * conversions.tsp, unit: 'tsp' };
    }
    
    return { quantity, unit };
  };

  useEffect(() => {
    const scale = servings / baseServings;
    
    const scaled = ingredients.map(ing => {
      const parsed = parseIngredient(ing);
      
      if (parsed.quantity) {
        let newQty = parsed.quantity * scale;
        let { quantity, unit } = convertUnit(newQty, parsed.unit);
        
        return `${formatQuantity(quantity)} ${unit} ${parsed.name}`.trim().replace(/\s+/g, ' ');
      }
      
      return ing;
    });
    
    setScaledIngredients(scaled);
  }, [servings, ingredients, unitSystem, baseServings]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-cream/50 dark:bg-dark-bg/50 rounded-2xl">
        
        {/* Servings */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-warm-brown dark:text-dark-text">
            👥 Servings:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 bg-white dark:bg-dark-card border border-warm-brown/10 dark:border-dark-text/10 rounded-lg text-warm-brown dark:text-dark-text hover:bg-orange-accent hover:text-white transition-colors flex items-center justify-center font-bold"
            >
              −
            </button>
            <span className="w-10 text-center font-serif text-xl font-bold text-warm-brown dark:text-dark-text">
              {servings}
            </span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 bg-white dark:bg-dark-card border border-warm-brown/10 dark:border-dark-text/10 rounded-lg text-warm-brown dark:text-dark-text hover:bg-orange-accent hover:text-white transition-colors flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
          {servings !== baseServings && (
            <button
              onClick={() => setServings(baseServings)}
              className="text-xs text-orange-accent hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Unit System */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-warm-brown dark:text-dark-text">
            📏 Units:
          </span>
          <div className="flex bg-white dark:bg-dark-card rounded-lg border border-warm-brown/10 dark:border-dark-text/10 overflow-hidden">
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-orange-accent text-white'
                  : 'text-warm-brown dark:text-dark-text hover:bg-cream dark:hover:bg-dark-bg'
              }`}
            >
              Metric
            </button>
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-orange-accent text-white'
                  : 'text-warm-brown dark:text-dark-text hover:bg-cream dark:hover:bg-dark-bg'
              }`}
            >
              Imperial
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients List */}
      <ul className="space-y-4">
        {scaledIngredients.map((ing, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-warm-brown/80 dark:text-dark-text/80 pb-4 border-b border-warm-brown/5 dark:border-dark-text/5 last:border-0"
          >
            <span className="w-2 h-2 rounded-full bg-orange-accent mt-2 flex-shrink-0"></span>
            <span className="leading-relaxed">{ing}</span>
          </li>
        ))}
      </ul>

      {/* Note */}
      {servings !== baseServings && (
        <p className="text-xs text-warm-brown/50 dark:text-dark-text/50 mt-4 text-center">
          Quantities scaled from {baseServings} to {servings} servings
        </p>
      )}
    </div>
  );
}

export default RecipeScaling;