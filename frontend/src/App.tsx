import { useState } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { Stepper } from './components/Stepper'

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Prepare Report",
      description: "Gather information and evidence",
    },
    {
      id: 2,
      title: "Submit Anonymously",
      description: "Upload your report securely",
    },
    {
      id: 3,
      title: "Zero-Knowledge Proof",
      description: "Cryptographic verification",
    },
    {
      id: 4,
      title: "Review Process",
      description: "Report under investigation",
    },
    {
      id: 5,
      title: "Resolution",
      description: "Case closed with updates",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleSubmitReport = () => {
    console.log('Submit report clicked');
  };

  return (
    <div className="min-h-screen bg-midnight-black text-pure-white font-outfit">
      <Navbar
        title="zkWhistle"
        buttonText="Submit Report"
        onButtonClick={handleSubmitReport}
      />

      <div className="p-8">
        <h2 className="text-2xl font-bold text-pure-white font-outfit mb-8 text-center">
          Whistleblowing Process
        </h2>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="flex justify-between mt-8 max-w-4xl mx-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-pure-white/10 text-pure-white rounded-lg font-outfit disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pure-white/20 transition-all duration-200"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className="px-6 py-2 bg-brand-blue text-pure-white rounded-lg font-outfit disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-blue/80 transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
