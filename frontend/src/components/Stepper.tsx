interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                currentStep >= step.id
                  ? "bg-brand-blue border-brand-blue text-pure-white"
                  : currentStep === step.id - 1
                  ? "bg-brand-blue/20 border-brand-blue text-brand-blue"
                  : "bg-midnight-black border-pure-white/30 text-pure-white/50"
              }`}
              onClick={() => onStepClick && onStepClick(step.id)}
            >
              {currentStep > step.id ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>

            {/* Step Label */}
            <div className="ml-3 min-w-0 flex-1">
              <p
                className={`text-sm font-medium transition-all duration-300 ${
                  currentStep >= step.id
                    ? "text-pure-white"
                    : "text-pure-white/50"
                }`}
              >
                {step.title}
              </p>
              {step.description && (
                <p
                  className={`text-xs transition-all duration-300 ${
                    currentStep >= step.id
                      ? "text-pure-white/70"
                      : "text-pure-white/30"
                  }`}
                >
                  {step.description}
                </p>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-px mx-4">
                <div
                  className={`h-full transition-all duration-500 ${
                    currentStep > step.id
                      ? "bg-brand-blue"
                      : "bg-pure-white/20"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};