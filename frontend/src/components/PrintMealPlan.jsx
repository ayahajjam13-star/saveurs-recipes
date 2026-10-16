function PrintMealPlan({ meals, weekStart, onClose }) {
  const DAYS = [
    { key: 'monday', label: 'Monday', emoji: '1️⃣' },
    { key: 'tuesday', label: 'Tuesday', emoji: '2️⃣' },
    { key: 'wednesday', label: 'Wednesday', emoji: '3️⃣' },
    { key: 'thursday', label: 'Thursday', emoji: '4️⃣' },
    { key: 'friday', label: 'Friday', emoji: '5️⃣' },
    { key: 'saturday', label: 'Saturday', emoji: '6️⃣' },
    { key: 'sunday', label: 'Sunday', emoji: '7️⃣' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
        <div className="bg-white dark:bg-dark-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-warm-brown/10 dark:border-dark-text/10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text">
                🖨️ Print Meal Plan
              </h2>
              <p className="text-sm text-warm-brown/60 dark:text-dark-text/60">
                Week of {new Date(weekStart).toLocaleDateString('en-GB', { 
                  day: 'numeric', month: 'long', year: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-warm-brown/10 dark:bg-dark-text/10 text-warm-brown dark:text-dark-text flex items-center justify-center hover:bg-warm-brown/20 transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* Preview */}
          <div className="p-6 overflow-y-auto flex-1">
            <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 mb-4 text-center">
              Preview:
            </p>
            
            <div className="bg-cream dark:bg-dark-bg rounded-2xl p-4 border border-warm-brown/10 dark:border-dark-text/10">
              <h1 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text text-center mb-2">
                Saveurs — Meal Plan
              </h1>
              <p className="text-center text-sm text-warm-brown/60 dark:text-dark-text/60 mb-6">
                Week of {new Date(weekStart).toLocaleDateString('en-GB', { 
                  day: 'numeric', month: 'long', year: 'numeric' 
                })}
              </p>

              <div className="space-y-3">
                {DAYS.map(day => {
                  const dayMeals = meals[day.key] || [];
                  return (
                    <div key={day.key} className="bg-white dark:bg-dark-card rounded-xl p-3 border border-warm-brown/10 dark:border-dark-text/10">
                      <h3 className="font-serif text-base font-bold text-warm-brown dark:text-dark-text mb-2">
                        {day.emoji} {day.label}
                      </h3>
                      {dayMeals.length === 0 ? (
                        <p className="text-xs text-warm-brown/40 dark:text-dark-text/40 italic">
                          No meals planned
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {dayMeals.map(recipe => (
                            <li key={recipe.id} className="text-sm text-warm-brown/80 dark:text-dark-text/80 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-accent"></span>
                              {recipe.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs text-warm-brown/40 dark:text-dark-text/40 mt-6">
                Generated from saveurs-recipes.vercel.app
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-warm-brown/10 dark:border-dark-text/10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-warm-brown/10 dark:bg-dark-text/10 text-warm-brown dark:text-dark-text rounded-xl font-medium hover:bg-warm-brown/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-orange-accent text-white rounded-xl font-semibold hover:bg-orange-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-accent/30"
            >
              🖨️ Print Now
            </button>
          </div>
        </div>
      </div>

      {/* Print Content — Hidden on screen, visible when printing */}
      <div className="print-only hidden">
        <h1 style={{ textAlign: 'center', fontFamily: 'serif', fontSize: '28px', marginBottom: '8px' }}>
          Saveurs — Meal Plan
        </h1>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          Week of {new Date(weekStart).toLocaleDateString('en-GB', { 
            day: 'numeric', month: 'long', year: 'numeric' 
          })}
        </p>

        {DAYS.map(day => {
          const dayMeals = meals[day.key] || [];
          return (
            <div key={day.key} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                {day.label}
              </h3>
              {dayMeals.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                  No meals planned
                </p>
              ) : (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {dayMeals.map(recipe => (
                    <li key={recipe.id} style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {recipe.name} — <span style={{ color: '#666' }}>{recipe.cuisine}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#999', marginTop: '24px' }}>
          Generated from saveurs-recipes.vercel.app
        </p>
      </div>
    </>
  );
}

export default PrintMealPlan;