import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import { WalletSetup } from "./components/WalletSetup";
import { ContractManager } from "./components/ContractManager";
import { HealthProofSubmission } from "./components/HealthProofSubmission";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import { Navbar } from "./components/Navbar";
import { ArrowLeft } from "lucide-react";

type AppStep = "wallet" | "contract" | "action";

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("wallet");
  const { wallet } = useWallet();
  const { contract } = useContract();

  // Initialize the app with welcome message
  useEffect(() => {
    console.log("🚀 zkWhistle Health Credential Verification System");
    console.log(
      "Welcome to the zero-knowledge health proof verification system."
    );
    console.log(
      "This system allows you to verify health credentials while maintaining privacy."
    );
    console.log(
      "Choose your role: User (to verify credentials) or Admin (to manage contracts)."
    );
  }, []);

  const handleWalletReady = () => {
    setCurrentStep("contract");
  };

  const handleContractReady = () => {
    setCurrentStep("action");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "wallet":
        return <WalletSetup onWalletReady={handleWalletReady} />;
      case "contract":
        return <ContractManager onContractReady={handleContractReady} />;
      case "action":
        return contract ? (
          <HealthProofSubmission contractAddress={contract.contractAddress} />
        ) : null;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "wallet":
        return "Wallet Setup";
      case "contract":
        return "Contract Setup";
      case "action":
        return "Submit Report";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <Navbar showHomeButton={true} />

      <div className="relative z-10 p-8 max-w-4xl mx-auto mt-[100px]">
        {/* Step 1: Welcome */}
        {currentStep === "wallet" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Submit Anonymous Report
            </motion.h1>
            <motion.p
              className="text-lg text-white/60 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Set up your wallet to get started with secure, anonymous
              reporting.
            </motion.p>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl mt-10 font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            {getStepTitle()}
          </h2>

          <div className="flex items-center justify-center space-x-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
            <div
              className={`flex items-center space-x-2 transition-all duration-300 ${
                currentStep === "wallet"
                  ? "text-[#0000fe]"
                  : wallet
                  ? "text-green-400"
                  : "text-white/40"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep === "wallet"
                    ? "bg-[#0000fe] shadow-lg"
                    : wallet
                    ? "bg-green-400"
                    : "bg-white/[0.15]"
                } ${
                  currentStep === "wallet" || wallet
                    ? "text-white"
                    : "text-white/60"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                1
              </motion.div>
              <span className="font-semibold">Wallet</span>
            </div>

            <div className="w-12 h-0.5 bg-gradient-to-r from-white/20 via-white/10 to-white/20"></div>

            <div
              className={`flex items-center space-x-2 transition-all duration-300 ${
                currentStep === "contract"
                  ? "text-[#0000fe]"
                  : contract
                  ? "text-green-400"
                  : "text-white/40"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep === "contract"
                    ? "bg-[#0000fe] shadow-lg"
                    : contract
                    ? "bg-green-400"
                    : "bg-white/[0.15]"
                } ${
                  currentStep === "contract" || contract
                    ? "text-white"
                    : "text-white/60"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                2
              </motion.div>
              <span className="font-semibold">Contract</span>
            </div>

            <div className="w-12 h-0.5 bg-gradient-to-r from-white/20 via-white/10 to-white/20"></div>

            <div
              className={`flex items-center space-x-2 transition-all duration-300 ${
                currentStep === "action" ? "text-[#0000fe]" : "text-white/40"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep === "action"
                    ? "bg-[#0000fe] shadow-lg text-white"
                    : "bg-white/[0.15] text-white/60"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                3
              </motion.div>
              <span className="font-semibold">Submit</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderCurrentStep()}
        </motion.div>

        {/* Navigation */}
        {currentStep !== "wallet" && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              onClick={() => {
                if (currentStep === "contract") {
                  setCurrentStep("wallet");
                } else if (currentStep === "action") {
                  setCurrentStep("contract");
                }
              }}
              className="inline-flex items-center gap-3 px-8 py-3 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] text-white rounded-xl font-outfit hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
