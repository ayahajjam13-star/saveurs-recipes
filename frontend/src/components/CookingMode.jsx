import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CookingMode({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const steps = recipe.steps;
  const totalSteps = steps.length;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    onClose();
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-warm-brown via-warm-brown to-orange-accent/20 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card flex flex-col">

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-warm-brown/50 dark:bg-dark-card/80 backdrop-blur-sm border-b border-cream/10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
            👨‍🍳
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-cream truncate">
              {recipe.name}
            </h2>
            <p className="text-xs text-cream/60">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition-colors text-xl"
          title="Exit cooking mode"
        >
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-orange-accent to-yellow-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step Dots */}
      <div className="flex items-center justify-center gap-2 py-4 px-4 flex-wrap">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentStep
                ? 'bg-orange-accent scale-150'
                : completedSteps.includes(i)
                ? 'bg-fresh-green'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            title={`Go to step ${i + 1}`}
          ></button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl w-full text-center animate-fade-in" key={currentStep}>
          
          {/* Step Number */}
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-accent to-red-500 text-white rounded-full mb-8 shadow-2xl shadow-orange-accent/30">
            <span className="font-serif text-3xl sm:text-4xl font-bold">
              {currentStep + 1}
            </span>
          </div>

          {/* Step Text */}
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream leading-relaxed sm:leading-relaxed mb-12">
            {steps[currentStep]}
          </p>

        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 sm:p-6 bg-warm-brown/50 dark:bg-dark-card/80 backdrop-blur-sm border-t border-cream/10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-cream rounded-2xl font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            ← Previous
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-4 bg-orange-accent hover:bg-orange-accent/90 text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-accent/30"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-4 bg-fresh-green hover:bg-fresh-green/90 text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-fresh-green/30"
            >
              ✓ Done!
            </button>
          )}

        </div>
      </div>

    </div>
  );
}

export default CookingMode;