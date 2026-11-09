
import { X, Printer, CalendarDays, Utensils, Leaf, Clock3 } from 'lucide-react';
import './PrintMealPlan.css';

const DAYS = [
  { key: 'monday', label: 'Monday', short: 'MON' },
  { key: 'tuesday', label: 'Tuesday', short: 'TUE' },
  { key: 'wednesday', label: 'Wednesday', short: 'WED' },
  { key: 'thursday', label: 'Thursday', short: 'THU' },
  { key: 'friday', label: 'Friday', short: 'FRI' },
  { key: 'saturday', label: 'Saturday', short: 'SAT' },
  { key: 'sunday', label: 'Sunday', short: 'SUN' },
];

function PrintMealPlan({ meals, weekStart, onClose }) {
  const formattedDate = new Date(weekStart).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalMeals = DAYS.reduce(
    (total, day) => total + (meals?.[day.key]?.length || 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const renderMeals = (day) => {
    const dayMeals = meals?.[day.key] || [];

    return (
      <div key={day.key} className="meal-plan-day">
        <div className="meal-day-heading">
          <span className="meal-day-short">{day.short}</span>

          <div className="meal-day-title">
            <h3>{day.label}</h3>
            <span className="meal-count">
              {dayMeals.length} {dayMeals.length === 1 ? 'meal' : 'meals'}
            </span>
          </div>
        </div>

        {dayMeals.length === 0 ? (
          <p className="meal-empty">No meals planned yet</p>
        ) : (
          <ul className="meal-list">
            {dayMeals.map((recipe) => (
              <li key={recipe.id}>
                <span className="meal-bullet" />
                <span className="meal-name">{recipe.name}</span>
                {recipe.cuisine && (
                  <span className="meal-cuisine">{recipe.cuisine}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Modal */}
      <div className="meal-print-overlay no-print">
        <div
          className="meal-print-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="meal-print-title"
        >
          {/* Header */}
          <div className="meal-print-header">
            <div className="meal-print-heading">
              <div className="meal-print-icon">
                <Printer size={21} />
              </div>

              <div>
                <span className="meal-print-eyebrow">YOUR PLANNER</span>
                <h2 id="meal-print-title">Print Meal Plan</h2>
                <p>Your weekly menu, beautifully organized</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="meal-print-close"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Summary */}
          <div className="meal-print-summary">
            <div className="meal-summary-item">
              <div className="meal-summary-icon">
                <CalendarDays size={18} />
              </div>
              <div>
                <span>WEEK STARTING</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>

            <div className="meal-summary-divider" />

            <div className="meal-summary-item">
              <div className="meal-summary-icon meal-summary-icon-pink">
                <Utensils size={18} />
              </div>
              <div>
                <span>TOTAL MEALS</span>
                <strong>{totalMeals} {totalMeals === 1 ? 'meal' : 'meals'}</strong>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="meal-print-body">
            <div className="meal-preview-label">
              <span />
              <strong>PRINT PREVIEW</strong>
              <span />
            </div>

            <div className="meal-preview-paper">
              <div className="meal-paper-top">
                <div className="meal-paper-brand">
                  <div className="meal-paper-logo">
                    <Leaf size={19} />
                  </div>
                  <span>SAVEURS</span>
                </div>

                <span className="meal-paper-tag">WEEKLY PLANNER</span>
              </div>

              <h1>My Weekly Meal Plan</h1>

              <div className="meal-paper-date">
                <CalendarDays size={15} />
                <span>Week of {formattedDate}</span>
              </div>

              <div className="meal-paper-divider" />

              <div className="meal-paper-days">
                {DAYS.map(renderMeals)}
              </div>

              <div className="meal-paper-footer">
                <div className="meal-paper-footer-icon">
                  <Utensils size={14} />
                </div>
                <span>Made with love by Saveurs Recipes</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="meal-print-footer no-print">
            <button
              type="button"
              onClick={onClose}
              className="meal-cancel-btn"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="meal-print-btn"
            >
              <Printer size={17} />
              Print Now
            </button>
          </div>
        </div>
      </div>

      {/* Printable version */}
      <div className="print-meal-plan">
        <div className="print-brand">
          <Leaf size={22} />
          <span>SAVEURS</span>
        </div>

        <h1>My Weekly Meal Plan</h1>

        <p className="print-week-date">
          Week of {formattedDate}
        </p>

        <div className="print-divider" />

        <div className="print-days">
          {DAYS.map(renderMeals)}
        </div>

        <div className="print-footer">
          Made with love by Saveurs Recipes
          <br />
          saveurs-recipes.vercel.app
        </div>
      </div>
    </>
  );
}

export default PrintMealPlan;
