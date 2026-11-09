
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import RecipeTimer from './RecipeTimer';

function CookingMode({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timerOpen, setTimerOpen] = useState(false);

  // Get recipe steps
  const steps = Array.isArray(recipe?.steps)
    ? recipe.steps
    : [];

  const totalSteps = steps.length;

  // Support string and object instructions
  const getStepText = (step) => {
    if (typeof step === 'string') return step;

    if (typeof step === 'object' && step !== null) {
      return (
        step.instruction ||
        step.description ||
        step.text ||
        step.step ||
        ''
      );
    }

    return '';
  };

  const currentStepText = getStepText(steps[currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const progress =
    totalSteps > 0
      ? (completedSteps.length / totalSteps) * 100
      : 0;

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep)
          ? prev
          : [...prev, currentStep]
      );

      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    setCompletedSteps((prev) =>
      prev.includes(currentStep)
        ? prev
        : [...prev, currentStep]
    );

    onClose();
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#FAF7F0',
        display: 'flex',
        flexDirection: 'column',
        color: '#28221E'
      }}
    >
      {/* HEADER */}
      <header
        style={{
          backgroundColor: '#28221E',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <p style={{ color: '#E88FA5', fontSize: '12px' }}>
            COOKING MODE
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {recipe?.name || 'Cooking Mode'}
          </h2>

          <p style={{ fontSize: '13px', opacity: 0.7 }}>
            Step {totalSteps > 0 ? currentStep + 1 : 0} of {totalSteps}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setTimerOpen(true)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#A8B995',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ⏱ Timer
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#E88FA5',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>
      </header>

      {/* PROGRESS */}
      <div
        style={{
          height: '6px',
          backgroundColor: '#EEE7DF'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#E88FA5',
            transition: 'width 0.3s'
          }}
        />
      </div>

      {/* STEP NUMBERS */}
      {totalSteps > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '15px',
            backgroundColor: 'white'
          }}
        >
          {steps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentStep(index)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor:
                  index === currentStep
                    ? '#E88FA5'
                    : completedSteps.includes(index)
                    ? '#A8B995'
                    : '#F5D8C8',
                color:
                  index === currentStep ||
                  completedSteps.includes(index)
                    ? 'white'
                    : '#28221E',
                fontWeight: 'bold'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        {totalSteps === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <h2>No Cooking Steps</h2>
            <p>No instructions available for this recipe.</p>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              padding: '35px',
              borderRadius: '24px',
              backgroundColor: 'white',
              border: '1px solid #EEE7DF',
              boxShadow: '0 10px 35px rgba(40,34,30,0.08)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                color: '#E88FA5',
                fontWeight: 'bold',
                letterSpacing: '2px',
                marginBottom: '20px'
              }}
            >
              COOKING INSTRUCTIONS
            </p>

            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '18px',
                backgroundColor: '#FCE8ED',
                color: '#D77F96',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}
            >
              {currentStep + 1}
            </div>

            <h2
              style={{
                fontSize: '26px',
                fontWeight: 'bold',
                marginBottom: '25px'
              }}
            >
              Step {currentStep + 1}
            </h2>

            <div
              style={{
                backgroundColor: '#FAF7F0',
                borderRadius: '16px',
                padding: '25px',
                textAlign: 'left'
              }}
            >
              <p
                style={{
                  color: '#28221E',
                  fontSize: '20px',
                  lineHeight: 1.9,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere'
                }}
              >
                {currentStepText || 'No description available for this step.'}
              </p>
            </div>

            <p style={{ marginTop: '20px', color: '#8B8179' }}>
              {currentStep + 1} / {totalSteps} steps
            </p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      {totalSteps > 0 && (
        <footer
          style={{
            backgroundColor: 'white',
            borderTop: '1px solid #EEE7DF',
            padding: '16px 24px',
            display: 'flex',
            gap: '12px'
          }}
        >
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstStep}
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: '12px',
              border: '1px solid #EEE7DF',
              backgroundColor: '#FAF7F0',
              color: '#28221E',
              cursor: isFirstStep ? 'not-allowed' : 'pointer',
              opacity: isFirstStep ? 0.4 : 1
            }}
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={isLastStep ? handleFinish : handleNext}
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isLastStep ? '#A8B995' : '#E88FA5',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isLastStep ? '✓ Finish Cooking' : 'Next Step →'}
          </button>
        </footer>
      )}

      {/* TIMER */}
      {timerOpen && (
        <RecipeTimer
          onClose={() => setTimerOpen(false)}
        />
      )}
    </div>,
    document.body
  );
}

export default CookingMode;
