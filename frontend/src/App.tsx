import { useState, useEffect } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { WalletSetup } from './components/WalletSetup'
import { ContractManager } from './components/ContractManager'
import { HealthProofSubmission } from './components/HealthProofSubmission'
import { AdminPanel } from './components/AdminPanel'
import { useWallet } from './hooks/useWallet'
import { useContract } from './hooks/useContract'

type AppMode = 'user' | 'admin';
type AppStep = 'wallet' | 'contract' | 'action';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('user');
  const [currentStep, setCurrentStep] = useState<AppStep>('wallet');
  const { wallet } = useWallet();
  const { contract } = useContract();

  // Initialize the app with welcome message
  useEffect(() => {
    console.log('🚀 zkWhistle Health Credential Verification System');
    console.log('Welcome to the zero-knowledge health proof verification system.');
    console.log('This system allows you to verify health credentials while maintaining privacy.');
    console.log('Choose your role: User (to verify credentials) or Admin (to manage contracts).');
  }, []);

  const handleWalletReady = () => {
    setCurrentStep('contract');
  };

  const handleContractReady = () => {
    setCurrentStep('action');
  };

  const handleModeSwitch = (mode: AppMode) => {
    setAppMode(mode);
    // Reset to wallet step when switching modes
    setCurrentStep('wallet');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'wallet':
        return <WalletSetup onWalletReady={handleWalletReady} />;
      case 'contract':
        return <ContractManager onContractReady={handleContractReady} />;
      case 'action':
        if (appMode === 'admin') {
          return contract ? <AdminPanel contractAddress={contract.contractAddress} /> : null;
        } else {
          return contract ? <HealthProofSubmission contractAddress={contract.contractAddress} /> : null;
        }
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'wallet':
        return 'Wallet Setup';
      case 'contract':
        return 'Contract Setup';
      case 'action':
        return appMode === 'admin' ? 'Admin Panel' : 'Health Proof Verification';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-midnight-black text-pure-white font-outfit">
      <Navbar
        title="zkWhistle - Health Credential Verification"
        buttonText={appMode === 'user' ? 'Switch to Admin' : 'Switch to User'}
        onButtonClick={() => handleModeSwitch(appMode === 'user' ? 'admin' : 'user')}
      />

      <div className="p-8 max-w-4xl mx-auto">
        {/* Mode Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-pure-white/10 rounded-lg p-4">
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              appMode === 'user' 
                ? 'bg-brand-blue text-pure-white' 
                : 'bg-transparent text-pure-white/60'
            }`}>
              User Mode
            </div>
            <div className="text-pure-white/40">|</div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              appMode === 'admin' 
                ? 'bg-brand-blue text-pure-white' 
                : 'bg-transparent text-pure-white/60'
            }`}>
              Admin Mode
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-pure-white font-outfit mb-4 text-center">
            {getStepTitle()}
          </h2>
          
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'wallet' ? 'text-brand-blue' : wallet ? 'text-green-400' : 'text-pure-white/40'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'wallet' ? 'bg-brand-blue' : wallet ? 'bg-green-400' : 'bg-pure-white/20'
              } ${currentStep === 'wallet' || wallet ? 'text-pure-white' : 'text-pure-white/60'}`}>
                1
              </div>
              <span className="font-semibold">Wallet</span>
            </div>
            
            <div className="w-8 h-0.5 bg-pure-white/20"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'contract' ? 'text-brand-blue' : contract ? 'text-green-400' : 'text-pure-white/40'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'contract' ? 'bg-brand-blue' : contract ? 'bg-green-400' : 'bg-pure-white/20'
              } ${currentStep === 'contract' || contract ? 'text-pure-white' : 'text-pure-white/60'}`}>
                2
              </div>
              <span className="font-semibold">Contract</span>
            </div>
            
            <div className="w-8 h-0.5 bg-pure-white/20"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'action' ? 'text-brand-blue' : 'text-pure-white/40'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'action' ? 'bg-brand-blue text-pure-white' : 'bg-pure-white/20 text-pure-white/60'
              }`}>
                3
              </div>
              <span className="font-semibold">{appMode === 'admin' ? 'Admin' : 'Verify'}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        {currentStep !== 'wallet' && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                if (currentStep === 'contract') {
                  setCurrentStep('wallet');
                } else if (currentStep === 'action') {
                  setCurrentStep('contract');
                }
              }}
              className="px-6 py-2 bg-pure-white/10 text-pure-white rounded-lg font-outfit hover:bg-pure-white/20 transition-all duration-200"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
