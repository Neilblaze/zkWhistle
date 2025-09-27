import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { WalletSetup } from "./components/WalletSetup";
import { ContractManager } from "./components/ContractManager";
import { HealthProofSubmission } from "./components/HealthProofSubmission";
import { AdminPanel } from "./components/AdminPanel";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import { Shield, Menu, X, ArrowLeft } from "lucide-react";

type AppMode = "user" | "admin";
type AppStep = "wallet" | "contract" | "action";

function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsOpen(false);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 w-full py-4 px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="flex justify-center w-full">
        <div className="flex items-center justify-between px-6 py-3 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] w-full max-w-3xl relative">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              className="w-8 h-8 mr-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", id: "home" },
              { name: "Features", id: "features" },
              { name: "Footer", id: "footer" },
            ].map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-white hover:text-white/90 transition-colors font-medium tracking-wide"
                >
                  {item.name}
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center justify-center px-5 py-2 text-sm text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide"
            >
              Back to Home
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#030303]/95 backdrop-blur-xl z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {[
                { name: "Home", id: "home" },
                { name: "Features", id: "features" },
                { name: "Footer", id: "footer" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-lg text-white hover:text-white/90 font-medium tracking-wide transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <button
                  onClick={() => (window.location.href = "/")}
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide"
                >
                  Back to Home
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function App() {
  const [appMode, setAppMode] = useState<AppMode>("user");
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

  const handleModeSwitch = (mode: AppMode) => {
    setAppMode(mode);
    // Reset to wallet step when switching modes
    setCurrentStep("wallet");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "wallet":
        return <WalletSetup onWalletReady={handleWalletReady} />;
      case "contract":
        return <ContractManager onContractReady={handleContractReady} />;
      case "action":
        if (appMode === "admin") {
          return contract ? (
            <AdminPanel contractAddress={contract.contractAddress} />
          ) : null;
        } else {
          return contract ? (
            <HealthProofSubmission contractAddress={contract.contractAddress} />
          ) : null;
        }
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
        return appMode === "admin"
          ? "Admin Panel"
          : "Health Proof Verification";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <AppNavbar />

      <div className="relative z-10 p-8 max-w-4xl mx-auto mt-[100px]">
        {/* Step 1: Welcome & Mode Selection */}
        {currentStep === "wallet" && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Welcome Section */}
            <div className="text-center">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Welcome to zkWhistle
              </motion.h1>
              <motion.p
                className="text-lg text-white/60 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Choose your role to get started with secure, anonymous
                reporting.
              </motion.p>
            </div>

            {/* Mode Selection - Compact */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="inline-flex items-center space-x-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
                <motion.button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    appMode === "user"
                      ? "bg-[#0000fe] text-white shadow-lg"
                      : "bg-transparent text-white/60 hover:text-white/80"
                  }`}
                  onClick={() => handleModeSwitch("user")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  User Mode
                </motion.button>
                <div className="text-white/40">|</div>
                <motion.button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    appMode === "admin"
                      ? "bg-[#0000fe] text-white shadow-lg"
                      : "bg-transparent text-white/60 hover:text-white/80"
                  }`}
                  onClick={() => handleModeSwitch("admin")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Mode
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Other Steps Content */}
        {currentStep !== "wallet" && (
          <div className="space-y-8">
            {/* Mode Switcher for other steps */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
                <motion.button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    appMode === "user"
                      ? "bg-[#0000fe] text-white shadow-lg"
                      : "bg-transparent text-white/60 hover:text-white/80"
                  }`}
                  onClick={() => handleModeSwitch("user")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  User Mode
                </motion.button>
                <div className="text-white/40">|</div>
                <motion.button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    appMode === "admin"
                      ? "bg-[#0000fe] text-white shadow-lg"
                      : "bg-transparent text-white/60 hover:text-white/80"
                  }`}
                  onClick={() => handleModeSwitch("admin")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Mode
                </motion.button>
              </div>
            </motion.div>
          </div>
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
              <span className="font-semibold">
                {appMode === "admin" ? "Admin" : "Verify"}
              </span>
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
