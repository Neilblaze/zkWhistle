import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import { Navbar } from "./components/Navbar";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Shield,
  Lock,
} from "lucide-react";

type AppStep = "wallet" | "contract" | "action";

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Form data
  const [publicKey, setPublicKey] = useState("");
  const [publicKeyError, setPublicKeyError] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [txHash, setTxHash] = useState("");

  // Initialize the app with welcome message
  useEffect(() => {
    console.log("🚀 zkWhistle Anonymous Reporting System");
    console.log("Welcome to the zero-knowledge anonymous reporting system.");
    console.log(
      "This system allows you to submit reports while maintaining complete anonymity."
    );
  }, []);

  const handleNextStep = () => {
    if (currentStep === "wallet") {
      if (!publicKey) {
        setPublicKeyError("Public key is required");
        return;
      }
      if (publicKeyError) return;
    }

    if (currentStep === "contract") {
      if (!reportTitle.trim() || !reportContent.trim()) {
        setErrorMessage("Please fill in all required fields");
        return;
      }
    }

    if (currentStep === "wallet") {
      setCurrentStep("contract");
    } else if (currentStep === "contract") {
      setCurrentStep("action");
    }
    setErrorMessage("");
  };

  const handlePreviousStep = () => {
    if (currentStep === "contract") {
      setCurrentStep("wallet");
    } else if (currentStep === "action") {
      setCurrentStep("contract");
    }
    setErrorMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setAttachmentError("File size must be less than 10MB");
        setAttachment(null);
      } else {
        setAttachmentError("");
        setAttachment(file);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitStatus("idle");
      setErrorMessage("");

      // Simulate submission process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock transaction hash
      const mockTxHash =
        "0x" +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
      setTxHash(mockTxHash);
      setSubmitStatus("success");

      // Reset form after delay
      setTimeout(() => {
        setCurrentStep("wallet");
        setPublicKey("");
        setReportTitle("");
        setReportContent("");
        setAttachment(null);
        setSubmitStatus("idle");
      }, 5000);
    } catch (error: unknown) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "wallet":
        return "Public Key Setup";
      case "contract":
        return "Report Details";
      case "action":
        return "Review & Submit";
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
        {/* Page Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Submit Anonymous Report
          </motion.h1>
          <motion.p
            className="text-lg text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your identity is protected through zero-knowledge proofs and
            end-to-end encryption
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            {getStepTitle()}
          </h2>

          <div className="flex items-center justify-between bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
            <div
              className={`flex flex-col items-center transition-all duration-300 ${
                currentStep === "wallet"
                  ? "text-[#0000fe]"
                  : publicKey
                  ? "text-green-400"
                  : "text-white/40"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep === "wallet"
                    ? "bg-[#0000fe] shadow-lg"
                    : publicKey
                    ? "bg-green-400"
                    : "bg-white/[0.15]"
                } ${
                  currentStep === "wallet" || publicKey
                    ? "text-white"
                    : "text-white/60"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {publicKey && currentStep !== "wallet" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  "1"
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === "wallet"
                    ? "text-[#0000fe]"
                    : !currentStep && !publicKey
                    ? "text-white/40"
                    : "text-white/60"
                }`}
              >
                Public Key
              </span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                publicKey ? "bg-green-400" : "bg-white/20"
              }`}
            />

            <div
              className={`flex flex-col items-center transition-all duration-300 ${
                currentStep === "contract"
                  ? "text-[#0000fe]"
                  : reportTitle && reportContent
                  ? "text-green-400"
                  : "text-white/40"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep === "contract"
                    ? "bg-[#0000fe] shadow-lg"
                    : reportTitle && reportContent
                    ? "bg-green-400"
                    : "bg-white/[0.15]"
                } ${
                  currentStep === "contract" || (reportTitle && reportContent)
                    ? "text-white"
                    : "text-white/60"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {reportTitle && reportContent && currentStep !== "contract" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  "2"
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === "contract"
                    ? "text-[#0000fe]"
                    : !currentStep && !(reportTitle && reportContent)
                    ? "text-white/40"
                    : "text-white/60"
                }`}
              >
                Report Details
              </span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                reportTitle && reportContent ? "bg-green-400" : "bg-white/20"
              }`}
            />

            <div
              className={`flex flex-col items-center transition-all duration-300 ${
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
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === "action" ? "text-[#0000fe]" : "text-white/40"
                }`}
              >
                Review & Submit
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
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
            {/* Step 1: Public Key */}
            {currentStep === "wallet" && (
              <div className="space-y-6">
                <div className="flex items-start space-x-3 p-4 bg-blue-500/[0.1] border border-blue-500/[0.2] rounded-xl">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      Encryption Key Required
                    </h3>
                    <p className="text-white/60 text-sm">
                      Enter or import the moderator's public key to encrypt your
                      report. Only they will be able to decrypt it.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Moderator Public Key
                    </label>
                    <input
                      type="text"
                      placeholder="Enter or paste the public key provided by the moderator"
                      value={publicKey}
                      onChange={(e) => {
                        setPublicKey(e.target.value);
                        setPublicKeyError("");
                      }}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0000fe] transition-colors"
                    />
                    {publicKeyError && (
                      <p className="mt-2 text-sm text-red-400">
                        {publicKeyError}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-white/40">
                      This ensures only the intended recipient can read your
                      report
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="px-3 text-sm text-white/40">OR</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Import from File
                    </label>
                    <input
                      type="file"
                      accept=".txt,.json,.key"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const text = event.target?.result as string;
                            setPublicKey(text.trim());
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/[0.1] file:text-white hover:file:bg-white/[0.15] transition-colors duration-200"
                    />
                    <p className="mt-1 text-xs text-white/40">
                      Accepts .txt, .json, or .key files
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    onClick={handleNextStep}
                    disabled={!publicKey || !!publicKeyError}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0000fe] text-white text-sm font-medium rounded-xl hover:bg-[#0000cc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Step 2: Report Details */}
            {currentStep === "contract" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0000fe] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Report Details *
                  </label>
                  <textarea
                    placeholder="Provide detailed information about the issue..."
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0000fe] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Attachment (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/[0.1] file:text-white hover:file:bg-white/[0.15] transition-colors duration-200"
                  />
                  {attachmentError && (
                    <p className="mt-2 text-sm text-red-400">
                      {attachmentError}
                    </p>
                  )}
                  {attachment && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/[0.1] border border-white/[0.2] rounded-lg">
                      <FileText className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white/80">
                        {attachment.name} ({(attachment.size / 1024).toFixed(2)}{" "}
                        KB)
                      </span>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="flex items-start space-x-3 p-4 bg-red-500/[0.1] border border-red-500/[0.2] rounded-xl">
                    <div className="w-5 h-5 text-red-400 mt-0.5">⚠</div>
                    <div>
                      <p className="text-white text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <motion.button
                    onClick={handlePreviousStep}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.2] text-white text-sm font-medium rounded-xl hover:bg-white/[0.05] transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </motion.button>
                  <motion.button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0000fe] text-white text-sm font-medium rounded-xl hover:bg-[#0000cc] transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === "action" && (
              <div className="space-y-6">
                {submitStatus === "success" ? (
                  <div className="flex items-start space-x-3 p-4 bg-green-500/[0.1] border border-green-500/[0.2] rounded-xl">
                    <Check className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Report Submitted Successfully!
                      </h3>
                      <p className="text-white/60 text-sm mb-3">
                        Your anonymous report has been encrypted and submitted
                        to the smart contract.
                      </p>
                      {txHash && (
                        <div className="mt-3 p-3 bg-white/[0.05] rounded-lg">
                          <p className="text-xs text-white/60 mb-1">
                            Transaction Hash:
                          </p>
                          <p className="text-xs font-mono text-white break-all">
                            {txHash}
                          </p>
                        </div>
                      )}
                      <p className="text-sm text-white/60 mt-3">
                        The moderator will review it soon.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-4 bg-blue-500/[0.1] border border-blue-500/[0.2] rounded-xl">
                      <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">
                          Please review your report before submitting. Once
                          submitted, it cannot be edited.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-1">
                          Title
                        </h3>
                        <p className="text-sm text-white">{reportTitle}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-1">
                          Details
                        </h3>
                        <p className="text-sm text-white whitespace-pre-wrap">
                          {reportContent}
                        </p>
                      </div>

                      {attachment && (
                        <div>
                          <h3 className="text-sm font-medium text-white/60 mb-1">
                            Attachment
                          </h3>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.1] border border-white/[0.2] rounded-lg">
                            <FileText className="w-4 h-4 text-white/60" />
                            <span className="text-sm text-white/80">
                              {attachment.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-white/60">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span>Your report will be encrypted end-to-end</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-white/60">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>Zero-knowledge proof ensures your anonymity</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-white/60">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>
                          Report will be anchored on-chain with mock transaction
                        </span>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="flex items-start space-x-3 p-4 bg-red-500/[0.1] border border-red-500/[0.2] rounded-xl">
                        <div className="w-5 h-5 text-red-400 mt-0.5">⚠</div>
                        <div>
                          <p className="text-white text-sm">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <motion.button
                        onClick={handlePreviousStep}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.2] text-white text-sm font-medium rounded-xl hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </motion.button>
                      <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0000fe] text-white text-sm font-medium rounded-xl hover:bg-[#0000cc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
