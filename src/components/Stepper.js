import React, { useState, Children, useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import './Stepper.css';

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const contentWrapperRef = useRef(null);
  const slidingRef = useRef(null);
  const heightRef = useRef(0);

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  // Animate slide transition and auto height
  useLayoutEffect(() => {
    const wrapper = contentWrapperRef.current;
    const slide = slidingRef.current;
    if (!wrapper || !slide) return;

    // Measure new height
    heightRef.current = slide.offsetHeight;
    gsap.to(wrapper, { height: isCompleted ? 0 : heightRef.current, duration: 0.4, ease: 'power2.out' });

    // Slide animation
    const fromX = direction >= 0 ? '100%' : '-100%';
    const exitX = direction >= 0 ? '-50%' : '50%';

    gsap.fromTo(slide, { x: fromX, opacity: 0 }, { x: '0%', opacity: 1, duration: 0.4, ease: 'power2.out' });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isCompleted, direction]);

  return (
    <div className="outer-container" {...rest}>
      <div className={`step-circle-container ${stepCircleContainerClassName}`} style={{ border: '1px solid #222' }}>
        <div className={`step-indicator-row ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <div
          ref={contentWrapperRef}
          className={`step-content-default ${contentClassName}`}
          style={{ position: 'relative', overflow: 'hidden', height: 0 }}
        >
          {!isCompleted && (
            <div ref={slidingRef} style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
              {stepsArray[currentStep - 1]}
            </div>
          )}
        </div>

        {!isCompleted && (
          <div className={`footer-container ${footerClassName}`}>
            <div className={`footer-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`back-button ${currentStep === 1 ? 'inactive' : ''}`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button onClick={isLastStep ? handleComplete : handleNext} className="next-button" {...nextButtonProps}>
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Step({ children }) {
  return <div className="step-default">{children}</div>;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <div onClick={handleClick} className={`step-indicator ${status}`}>
      <div className="step-indicator-inner">
        {status === 'complete' ? (
          <CheckIcon className="check-icon" />
        ) : status === 'active' ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </div>
    </div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="step-connector">
      <div className={`step-connector-inner ${isComplete ? 'complete' : 'incomplete'}`} />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
