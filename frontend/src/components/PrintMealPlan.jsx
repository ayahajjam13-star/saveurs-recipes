
import { X, Printer, CalendarDays, Utensils, Leaf } from 'lucide-react';
import './PrintMealPlan.css';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

function PrintMealPlan({ meals, weekStart, onClose }) {
  const formattedDate = new Date(weekStart).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const renderMeals = (day) => {
    const dayMeals = meals?.[day.key] || [];

    return (
      <div key={day.key} className="meal-plan-day">
        <div className="meal-day-heading">
          <span className="meal-day-dot" />
          <h3>{day.label}</h3>
          <span className="meal-count">
            {dayMeals.length} {dayMeals.length === 1 ? 'meal' : 'meals'}
          </span>
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
                <h2 id="meal-print-title">Print Meal Plan</h2>
                <p>Your weekly menu, ready to print</p>
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

          {/* Preview */}
          <div className="meal-print-body">
            <div className="meal-preview-label">
              <span />
              PRINT PREVIEW
              <span />
            </div>

            <div className="meal-preview-paper">
              <div className="meal-paper-brand">
                <div className="meal-paper-logo">
                  <Leaf size={19} />
                </div>
                <span>SAVEURS</span>
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
                <Utensils size={14} />
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
