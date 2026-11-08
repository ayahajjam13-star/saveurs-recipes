
import { useState, useEffect } from 'react';
import RecipeTimer from './RecipeTimer';
import {
  ChefHat,
  Clock,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CircleCheck,
  Utensils
} from 'lucide-react';

function CookingMode({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timerOpen, setTimerOpen] = useState(false);

  const steps = Array.isArray(recipe?.steps) ? recipe.steps : [];
  const totalSteps = steps.length;

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const progress = totalSteps > 0
    ? ((completedSteps.length) / totalSteps) * 100
    : 0;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const markCompleted = (step) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      markCompleted(currentStep);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    markCompleted(currentStep);
    onClose();
  };

  const handleStepClick = (index) => {
    if (index < currentStep) {
      markCompleted(currentStep);
    }

    setCurrentStep(index);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#1A1512] text-[#FAF7F0] overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E88FA5]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#718B68]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-4 border-b border-white/10 bg-[#28221E]/80 backdrop-blur-xl">

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#E88FA5] flex items-center justify-center shadow-lg shadow-[#E88FA5]/20">
            <ChefHat size={23} className="text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#E88FA5] font-bold mb-1">
              Saveurs Cooking Mode
            </p>
            <h2 className="font-serif text-base sm:text-xl font-bold truncate">
              {recipe?.name || 'Cooking your recipe'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTimerOpen(true)}
            title="Set a timer"
            className="w-10 h-10 rounded-xl bg-[#718B68]/20 text-[#A8C49B] hover:bg-[#718B68]/40 flex items-center justify-center transition-all"
          >
            <Clock size={19} />
          </button>

          <button
            onClick={onClose}
            title="Exit cooking mode"
            className="w-10 h-10 rounded-xl bg-white/5 text-white/70 hover:bg-[#E88FA5] hover:text-white flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10">
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#E88FA5] to-[#718B68] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center px-5 sm:px-8 py-3">
          <span className="text-xs text-white/50">
            {totalSteps > 0
              ? `Step ${currentStep + 1} of ${totalSteps}`
              : 'No steps available'}
          </span>

          <span className="text-xs font-bold text-[#A8C49B]">
            {Math.round(progress)}% completed
          </span>
        </div>
      </div>

      {/* Step Navigation */}
      {totalSteps > 0 && (
        <div className="relative z-10 flex justify-center items-center gap-2 flex-wrap px-4 py-3">
          {steps.map((_, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep;

            return (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                title={`Go to step ${index + 1}`}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-9 h-9 bg-[#E88FA5] text-white shadow-lg shadow-[#E88FA5]/30 scale-110'
                    : isCompleted
                    ? 'w-8 h-8 bg-[#718B68] text-white'
                    : 'w-8 h-8 bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check size={15} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-5 sm:px-8 py-5 overflow-y-auto">

        {totalSteps === 0 ? (
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#E88FA5]/10 flex items-center justify-center">
              <Utensils size={35} className="text-[#E88FA5]" />
            </div>

            <h3 className="font-serif text-2xl font-bold mb-3">
              No cooking steps available
            </h3>

            <p className="text-sm text-white/50 mb-7">
              This recipe does not have any instructions yet.
            </p>

            <button
              onClick={onClose}
              className="px-7 py-3 rounded-full bg-[#E88FA5] text-white font-bold text-sm hover:bg-[#d87991] transition-all"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div
            key={currentStep}
            className="w-full max-w-3xl text-center animate-fade-in"
          >
            {/* Step Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E88FA5]/10 border border-[#E88FA5]/20 mb-7">
              <Sparkles size={14} className="text-[#E88FA5]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#E88FA5]">
                Cooking Step {currentStep + 1}
              </span>
            </div>

            {/* Step Number */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8">
              <div className="absolute inset-0 rounded-[2rem] bg-[#E88FA5]/20 blur-xl" />
              <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-br from-[#E88FA5] to-[#C96F87] flex items-center justify-center shadow-2xl shadow-[#E88FA5]/20">
                {completedSteps.includes(currentStep) ? (
                  <CircleCheck size={43} className="text-white" />
                ) : (
                  <span className="font-serif text-5xl font-bold text-white">
                    {currentStep + 1}
                  </span>
                )}
              </div>
            </div>

            {/* Instruction */}
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed text-[#FAF7F0] max-w-2xl mx-auto">
              {steps[currentStep]}
            </p>

            <div className="w-16 h-1 rounded-full bg-[#718B68] mx-auto mt-9" />

            <p className="text-xs text-white/40 mt-5">
              {getStepHint(currentStep, totalSteps)}
            </p>
          </div>
        )}
      </main>

      {/* Bottom Controls */}
      {totalSteps > 0 && (
        <footer className="relative z-10 px-4 sm:px-8 py-5 sm:py-6 border-t border-white/10 bg-[#28221E]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto flex items-center gap-3">

            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/10 transition-all disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {isLastStep ? (
              <button
                onClick={handleComplete}
                className="flex-[1.3] py-4 rounded-2xl bg-[#718B68] text-white font-bold text-sm hover:bg-[#829D78] transition-all shadow-lg shadow-[#718B68]/20 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Finish Cooking
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-[1.3] py-4 rounded-2xl bg-[#E88FA5] text-white font-bold text-sm hover:bg-[#d87991] transition-all shadow-lg shadow-[#E88FA5]/20 flex items-center justify-center gap-2"
              >
                Next Step
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          <p className="text-center text-[10px] text-white/30 mt-4">
            Take your time and enjoy the cooking experience.
          </p>
        </footer>
      )}

      {/* Timer */}
      {timerOpen && (
        <RecipeTimer onClose={() => setTimerOpen(false)} />
      )}
    </div>
  );
}

function getStepHint(currentStep, totalSteps) {
  if (currentStep === totalSteps - 1) {
    return 'You are almost there. Get ready to enjoy your dish!';
  }

  return 'Follow the instruction carefully before moving to the next step.';
}

export default CookingMode;
