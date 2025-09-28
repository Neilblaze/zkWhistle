import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import {
  FileText,
  Key,
  Download,
  Upload,
  Clipboard,
  X,
  RefreshCw,
  Lock,
  Archive,
  AlertTriangle,
  Info,
  Check,
  ClipboardCheck,
  File,
  Type,
  Paperclip,
} from "lucide-react";

// --- START OF PLACEHOLDER UTILITIES AND COMPONENTS ---
// Note: In a real app, these would be imported from the 'ui' and 'lib' folders.

// Utility function from context
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// Placeholder for custom components (styled for the dark theme)
const Card: React.FC<React.ComponentProps<typeof motion.div> & { className?: string }> = ({
  children,
  className,
  ...props
}) => (
  <motion.div
    className={cn(
      "bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] transition-all duration-500 hover:border-white/[0.15]",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);
const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={cn("text-xl font-semibold text-white", className)}>
    {children}
  </h3>
);
const CardDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="text-sm text-white/60">{children}</p>;
const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn("mt-4", className)}>{children}</div>;

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
  }
> = ({ children, variant = "primary", size = "md", className, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  let variantClasses = "";
  let sizeClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-[#0000fe] text-white hover:bg-[#0000cc]";
      break;
    case "outline":
      variantClasses =
        "border border-white/[0.2] text-white/80 hover:bg-white/[0.05] hover:text-white";
      break;
    case "ghost":
      variantClasses = "text-white/60 hover:text-white hover:bg-white/[0.05]";
      break;
    case "danger":
      variantClasses = "bg-red-600 text-white hover:bg-red-700";
      break;
  }

  switch (size) {
    case "sm":
      sizeClasses = "px-3 py-1.5 text-sm";
      break;
    case "md":
      sizeClasses = "px-4 py-2 text-sm";
      break;
    case "lg":
      sizeClasses = "px-6 py-3 text-base";
      break;
  }

  return (
    <motion.button
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      whileHover={{ scale: props.disabled ? 1 : 1.05 }}
      whileTap={{ scale: props.disabled ? 1 : 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    helperText?: string;
  }
> = ({ label, error, helperText, className, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-white/80">
        {label}
      </label>
    )}
    <input
      className={cn(
        "w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-1 transition-colors",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
          : "border-white/[0.08] focus:border-[#0000fe] focus:ring-[#0000fe]/50",
        className
      )}
      {...props}
    />
    {(error || helperText) && (
      <p
        className={cn(
          "mt-1 text-xs",
          error ? "text-red-400" : "text-white/40"
        )}
      >
        {error || helperText}
      </p>
    )}
  </div>
);

type BadgeVariant = "primary" | "secondary" | "default" | "success" | "warning";
const Badge: React.FC<{ children: React.ReactNode; variant?: BadgeVariant }> = ({
  children,
  variant = "default",
}) => {
  let colorClasses = "";
  switch (variant) {
    case "primary":
      colorClasses = "bg-[#0000fe]/20 text-[#0000fe] border-[#0000fe]/30";
      break;
    case "secondary":
      colorClasses = "bg-orange-500/20 text-orange-400 border-orange-500/30";
      break;
    case "success":
      colorClasses = "bg-green-500/20 text-green-400 border-green-500/30";
      break;
    case "warning":
      colorClasses = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      break;
    case "default":
    default:
      colorClasses = "bg-white/10 text-white/80 border-white/20";
      break;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorClasses
      )}
    >
      {children}
    </span>
  );
};

type AlertVariant = "success" | "danger" | "info" | "warning";
const Alert: React.FC<{
  children: React.ReactNode;
  variant: AlertVariant;
  onClose?: () => void;
  className?: string;
}> = ({ children, variant, onClose, className }) => {
  let colorClasses = "";
  let Icon = Info;
  switch (variant) {
    case "success":
      colorClasses = "bg-green-500/[0.1] border-green-500/[0.2] text-green-400";
      Icon = Check;
      break;
    case "danger":
      colorClasses = "bg-red-500/[0.1] border-red-500/[0.2] text-red-400";
      Icon = X;
      break;
    case "warning":
      colorClasses =
        "bg-yellow-500/[0.1] border-yellow-500/[0.2] text-yellow-400";
      Icon = AlertTriangle;
      break;
    case "info":
    default:
      colorClasses = "bg-blue-500/[0.1] border-blue-500/[0.2] text-blue-400";
      Icon = Info;
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start p-4 rounded-xl border",
        colorClasses,
        className
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="ml-3 text-sm flex-1 text-white/90">
        {children}
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 flex-shrink-0 text-white/60 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

// Placeholder for lib utilities
const copyToClipboard = async (text: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.error("Failed to copy", e);
      return false;
    }
  }
  return false;
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString();
};

// Placeholder for encryption and data modules
interface ZKProof {}
interface Report {
  id: number | string;
  encryptedData: string;
  proof: ZKProof;
  timestamp: number;
  status: "pending" | "reviewed" | "archived";
}
interface DecryptedReport {
  title: string;
  content: string;
  attachment?: string;
}

const mockReports: Report[] = [
  {
    id: 1,
    encryptedData: '{"data":"mock_data_1"}',
    proof: {},
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    status: "pending",
  },
  {
    id: 2,
    encryptedData: '{"data":"mock_data_2"}',
    proof: {},
    timestamp: Date.now() - 3600000 * 48, // 2 days ago
    status: "reviewed",
  },
  {
    id: 3,
    encryptedData: '{"data":"mock_data_3"}',
    proof: {},
    timestamp: Date.now() - 3600000 * 72, // 3 days ago
    status: "pending",
  },
];

const mockDecryptedContent = (id: string | number): DecryptedReport => ({
    title: `Report Title #${id} - Corruption Evidence`,
    content: `Detailed report content for anonymous submission #${id}. The encrypted information was successfully decrypted. The incident occurred on [Date] at [Location]. We have verifiable data to prove the claim.

This is a sensitive matter and should be handled with extreme care due to the high-profile individuals involved. The zero-knowledge proof confirms the veracity of the claim while protecting the source.`,
    attachment:
      id === 1
        ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjRDAAAAAElFTkSuQmCC" // Mock Image
        : id === 3 ? "data:application/pdf;base64,JVBERi0xLjQKJ..." : undefined, // Mock PDF
});

const generateKeyPair = async () => ({
  publicKey:
    "PUB_KEY_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15),
  privateKey:
    "PRIV_KEY_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15),
});
const decryptMessage = async (encryptedData: any, privateKey: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const id = encryptedData.data.split('_').pop();
  return JSON.stringify(mockDecryptedContent(id));
};
const exportKeyPair = async (keyPair: any, password?: string) => {
  if (password && password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  return JSON.stringify({ ...keyPair, protected: !!password, password: password ? 'ENCRYPTED' : 'none' });
};
const importKeyPair = async (data: string, password?: string) => {
    const parsed = JSON.parse(data);
    if (parsed.protected && !password) throw new Error('Password required for encrypted key file');
    if (parsed.protected && parsed.password !== 'ENCRYPTED') throw new Error('Incorrect password'); // Simple mock check
    return { publicKey: parsed.publicKey, privateKey: parsed.privateKey };
};
const keyStorage = {
  loadKeyPair: (key: string) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },
  saveKeyPair: (keyPair: any, key: string) => localStorage.setItem(key, JSON.stringify(keyPair)),
  removeKeyPair: (key: string) => localStorage.removeItem(key),
};
const validatePasswordStrength = (password: string) => ({ valid: password.length >= 8, error: password.length < 8 ? 'Password must be at least 8 characters' : undefined });
const validateEncryptedData = (data: any) => typeof data.data === 'string';
const verifyProof = async (proof: ZKProof) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return true; // Always return true for mock
};

// Mock IndexedDB functions
const openDB = async () => ({
    transaction: () => ({
        objectStore: () => ({
            getAll: () => ({
                result: mockReports,
                onsuccess: (e: any) => e.target.result = mockReports,
                onerror: () => {},
            }),
            get: (id: string | number) => ({
                result: mockReports.find(r => r.id === id) || null,
                onsuccess: (e: any) => e.target.result = mockReports.find(r => r.id === id) || null,
                onerror: () => {},
            }),
            put: (report: Report) => console.log('Mock DB Update:', report),
        }),
    }),
});

// Mock SyncManager
const syncManager = {
    getProvider: () => ({
        listReports: async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return mockReports;
        },
        updateStatus: async (id: string | number, status: 'pending' | 'reviewed' | 'archived') => {
            console.log(`Mock Sync Update: Report ${id} status set to ${status}`);
            await new Promise((resolve) => setTimeout(resolve, 300));
        },
    }),
};
// --- END OF PLACEHOLDER UTILITIES AND COMPONENTS ---

const ModeratorPage: React.FC = () => {
  const [keyPair, setKeyPair] = useState<
    { publicKey: string; privateKey: string } | null
  >(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [decryptedContent, setDecryptedContent] =
    useState<DecryptedReport | null>(null);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [exportPassword, setExportPassword] = useState("");
  const [exportPasswordError, setExportPasswordError] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [importFileContent, setImportFileContent] = useState<string | null>(
    null
  );
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showManualInputDialog, setShowManualInputDialog] = useState(false);
  const [manualPublicKey, setManualPublicKey] = useState("");
  const [manualPrivateKey, setManualPrivateKey] = useState("");
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "danger" | "info" | "warning";
    message: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<"public" | "private" | false>(
    false
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    archived: 0,
  });

  // Load keys and reports on mount
  useEffect(() => {
    const storedKeys = keyStorage.loadKeyPair("moderator");
    if (storedKeys) {
      setKeyPair(storedKeys);
    }
    loadReports();
  }, []);

  // Clear decrypted content when keys are cleared
  useEffect(() => {
    if (!keyPair) {
      setDecryptedContent(null);
      setSelectedReport(null);
    }
  }, [keyPair]);

  // Update statistics when reports change
  useEffect(() => {
    setStats({
      total: reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
      reviewed: reports.filter((r) => r.status === "reviewed").length,
      archived: reports.filter((r) => r.status === "archived").length,
    });
  }, [reports]);

  const loadReports = async () => {
    setIsRefreshing(true);
    try {
      const provider = syncManager.getProvider();
      const syncedReports = await provider.listReports();

      const formattedReports: Report[] = syncedReports
        .map((r) => ({
          id: r.id || Date.now(),
          encryptedData: r.encryptedData,
          proof: r.proof,
          timestamp: r.timestamp,
          status: r.status,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setReports(formattedReports);
      setLastUpdated(Date.now());
    } catch (error) {
      console.error("Failed to load reports:", error);
      // Fallback to direct IndexedDB access (kept for completeness from original code)
      try {
        const db: any = await openDB();
        const tx = db.transaction(["reports"], "readonly");
        const store = tx.objectStore("reports");
        const allReports = await new Promise<Report[]>((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        setReports(allReports.sort((a, b) => b.timestamp - a.timestamp));
        setLastUpdated(Date.now());
      } catch (dbError) {
        console.error("Failed to load from IndexedDB:", dbError);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateKeys = async () => {
    setIsGeneratingKeys(true);
    try {
      const newKeyPair = await generateKeyPair();
      setKeyPair(newKeyPair);
      keyStorage.saveKeyPair(newKeyPair, "moderator");
      setAlertMessage({
        type: "success",
        message: "Key pair generated successfully and saved locally!",
      });
    } catch (error) {
      console.error("Failed to generate keys:", error);
      setAlertMessage({
        type: "danger",
        message: "Failed to generate keys. Please try again.",
      });
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const handleCopyPublicKey = async () => {
    if (keyPair) {
      const success = await copyToClipboard(keyPair.publicKey);
      if (success) {
        setCopiedKey("public");
        setTimeout(() => setCopiedKey(false), 2000);
      }
    }
  };

  const handleCopyPrivateKey = async () => {
    if (keyPair) {
      const success = await copyToClipboard(keyPair.privateKey);
      if (success) {
        setCopiedKey("private");
        setTimeout(() => setCopiedKey(false), 2000);
      }
    }
  };

  const handleExportKeys = async () => {
    if (!keyPair) return;

    if (exportPassword) {
      const validation = validatePasswordStrength(exportPassword);
      if (!validation.valid) {
        setExportPasswordError(validation.error || "Invalid password");
        return;
      }
    }

    try {
      const exportedData = await exportKeyPair(
        keyPair,
        exportPassword || undefined
      );
      const blob = new Blob([exportedData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `midnight-moderator-keys-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setShowExportDialog(false);
      setExportPassword("");
      setExportPasswordError("");
      setAlertMessage({ type: "success", message: "Keys exported successfully!" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Export failed";
      if (errorMessage.includes("Password must")) {
        setExportPasswordError(errorMessage);
      } else {
        setAlertMessage({ type: "danger", message: errorMessage });
      }
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportFileContent(content);
      setImportError(null);

      try {
        const parsed = JSON.parse(content);
        setNeedsPassword(parsed.protected === true);
      } catch {
        setImportError("Invalid key file format");
        setNeedsPassword(false);
      }
    };
    reader.readAsText(file);
  };

  const handleImportKeys = async () => {
    if (!importFileContent) return;

    if (needsPassword && !importPassword) {
      setImportError("Password is required for this encrypted key file");
      return;
    }

    try {
      const imported = await importKeyPair(
        importFileContent,
        importPassword || undefined
      );
      setKeyPair(imported);
      keyStorage.saveKeyPair(imported, "moderator");
      setShowImportDialog(false);
      setImportPassword("");
      setImportFileContent(null);
      setImportFileName(null);
      setNeedsPassword(false);
      setImportError(null);
      setAlertMessage({ type: "success", message: "Keys imported successfully!" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed";
      if (message.includes("password")) {
        setImportError("Incorrect password");
      } else {
        setImportError(message);
      }
    }
  };

  const updateReportStatus = async (
    id: number | string,
    status: "pending" | "reviewed" | "archived"
  ) => {
    try {
      const provider = syncManager.getProvider();
      await provider.updateStatus(id, status);
    } catch (error) {
      console.error("Failed to update report status:", error);
      // Fallback to IndexedDB (logic skipped for brevity but present in original)
    }
  };

  const handleDecryptReport = async (report: Report) => {
    if (!keyPair) {
      setAlertMessage({
        type: "danger",
        message: "Please generate or import your private key first.",
      });
      return;
    }

    if (selectedReport?.id === report.id) {
        // Toggle close/open if already selected
        setSelectedReport(null);
        setDecryptedContent(null);
        return;
    }

    setIsDecrypting(true);
    setDecryptedContent(null);
    setSelectedReport(report);

    try {
      const encryptedData = JSON.parse(report.encryptedData);

      if (!validateEncryptedData(encryptedData)) {
        throw new Error("Invalid encrypted data format");
      }

      const isProofValid = await verifyProof(report.proof);
      if (!isProofValid) {
        setAlertMessage({
          type: "warning",
          message: "Warning: Zero-Knowledge Proof verification failed for this report.",
        });
      } else {
         setAlertMessage({
          type: "info",
          message: "ZK-Proof verified. Decrypting content...",
        });
      }
      
      const decrypted = await decryptMessage(
        encryptedData,
        keyPair.privateKey
      );
      const reportData = JSON.parse(decrypted);

      setDecryptedContent(reportData);

      // Update report status to 'reviewed'
      await updateReportStatus(report.id, "reviewed");
      await loadReports();
    } catch (error) {
      console.error("Decryption error:", error);
      setAlertMessage({
        type: "danger",
        message: "Failed to decrypt report. Please check your private key and the report integrity.",
      });
      setDecryptedContent(null);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleArchiveReport = async (id: number | string) => {
    await updateReportStatus(id, "archived");
    setAlertMessage({ type: "info", message: `Report #${id} archived.` });
    await loadReports();
    setSelectedReport(null);
    setDecryptedContent(null);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <Navbar showHomeButton={true} />

      <div className="relative z-10 pt-32 pb-16 px-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            Moderator Dashboard
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Securely decrypt, verify, and manage reports using your private key.
          </p>
        </motion.div>

        {/* Alert Container */}
        <div className="mb-6 max-w-6xl mx-auto">
          {alertMessage && (
            <Alert
              variant={alertMessage.type}
              onClose={() => setAlertMessage(null)}
              className="mb-6"
            >
              {alertMessage.message}
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Key Management & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Management Card */}
            <Card
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardTitle className="mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2 text-white/70" />
                Encryption Key
              </CardTitle>
              <div className="space-y-4">
                {!keyPair ? (
                  <>
                    <Button
                      onClick={handleGenerateKeys}
                      disabled={isGeneratingKeys}
                      className="w-full"
                      size="md"
                    >
                      {isGeneratingKeys ? "Generating..." : "Generate New Key Pair"}
                    </Button>
                    <div className="flex items-center">
                      <div className="flex-1 h-px bg-white/20"></div>
                      <span className="px-3 text-xs text-white/40">OR</span>
                      <div className="flex-1 h-px bg-white/20"></div>
                    </div>
                    <div className="flex gap-2">
                       <Button
                        variant="outline"
                        onClick={() => setShowImportDialog(true)}
                        className="flex-1"
                        size="md"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowManualInputDialog(true)}
                        className="flex-1"
                        size="md"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Manual
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/[0.05] rounded-lg border border-white/[0.1]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-white/50">
                            Public Key
                          </span>
                          <button
                            onClick={handleCopyPublicKey}
                            className="text-xs text-[#0000fe] hover:text-[#0000cc] transition-colors duration-200 flex items-center"
                          >
                            {copiedKey === "public" ? (
                              <>
                                <ClipboardCheck className="w-3 h-3 mr-1 text-green-400" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Clipboard className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-white/80 break-all">
                          {keyPair.publicKey.substring(0, 40)}...
                        </p>
                      </div>

                      <div className="p-3 bg-white/[0.05] rounded-lg border border-white/[0.1]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-white/50">
                            Private Key
                          </span>
                          <button
                            onClick={handleCopyPrivateKey}
                            className="text-xs text-[#0000fe] hover:text-[#0000cc] transition-colors duration-200 flex items-center"
                          >
                            {copiedKey === "private" ? (
                              <>
                                <ClipboardCheck className="w-3 h-3 mr-1 text-green-400" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Clipboard className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-white/80 break-all">
                          {keyPair.privateKey.substring(0, 40)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/[0.1]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowExportDialog(true)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          keyStorage.removeKeyPair("moderator");
                          setKeyPair(null);
                          setAlertMessage({
                            type: "warning",
                            message:
                              "Keys cleared. You must re-import or generate new keys to decrypt reports.",
                          });
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Statistics Card */}
            <Card
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CardTitle className="mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-white/70" />
                Report Statistics
              </CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/[0.05] rounded-lg border border-white/[0.1]">
                  <div className="text-2xl font-bold text-white">
                    {stats.total}
                  </div>
                  <div className="text-xs text-white/60">Total Reports</div>
                </div>
                <div className="text-center p-3 bg-orange-500/[0.1] rounded-lg border border-orange-500/[0.2]">
                  <div className="text-2xl font-bold text-orange-400">
                    {stats.pending}
                  </div>
                  <div className="text-xs text-orange-400">Pending Review</div>
                </div>
                <div className="text-center p-3 bg-green-500/[0.1] rounded-lg border border-green-500/[0.2]">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.reviewed}
                  </div>
                  <div className="text-xs text-green-400">Decrypted/Reviewed</div>
                </div>
                <div className="text-center p-3 bg-white/[0.05] rounded-lg border border-white/[0.1]">
                  <div className="text-2xl font-bold text-white/60">
                    {stats.archived}
                  </div>
                  <div className="text-xs text-white/60">Archived</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Reports List & Decryption */}
          <div className="lg:col-span-2">
            <Card
              className="h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-white/70" />
                    Encrypted Reports
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadReports}
                    disabled={isRefreshing}
                    aria-label="Refresh reports"
                    title="Refresh reports"
                  >
                    {isRefreshing ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0000fe]" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span className="ml-1 hidden sm:inline">{isRefreshing ? 'Refreshing' : lastUpdated ? formatRelativeTime(new Date(lastUpdated)) : 'Refresh'}</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Select a report to attempt decryption and ZK-Proof verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-8rem)] overflow-y-auto">
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-white/50">
                    <File className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p>No reports yet</p>
                    <p className="text-sm mt-2">
                      Reports will appear here when submitted.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all cursor-pointer",
                          selectedReport?.id === report.id
                            ? "border-[#0000fe] bg-[#0000fe]/10 shadow-lg"
                            : "border-white/[0.1] hover:border-[#0000fe]/50 hover:bg-white/[0.05]"
                        )}
                        onClick={() => handleDecryptReport(report)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant={
                                  report.status === "pending"
                                    ? "secondary"
                                    : report.status === "reviewed"
                                    ? "success"
                                    : "default"
                                }
                              >
                                {report.status}
                              </Badge>
                              <span className="text-xs text-white/50">
                                {formatRelativeTime(new Date(report.timestamp))}
                              </span>
                            </div>

                            {selectedReport?.id === report.id &&
                            (decryptedContent || isDecrypting) ? (
                              <div className="mt-3 space-y-3">
                                {isDecrypting && (
                                    <div className="flex items-center text-sm text-[#0000fe]">
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        <span>Decrypting and Verifying Proof...</span>
                                    </div>
                                )}
                                {decryptedContent && (
                                  <>
                                    <div>
                                      <h4 className="font-medium text-white mb-1 flex items-center">
                                        <Type className="w-4 h-4 mr-2 text-white/70" />
                                        {decryptedContent.title}
                                      </h4>
                                      <p className="text-sm text-white/70 whitespace-pre-wrap mt-1 p-2 bg-white/[0.03] rounded-lg border border-white/[0.1]">
                                        {decryptedContent.content}
                                      </p>
                                    </div>

                                    {decryptedContent.attachment && (
                                      <div className="pt-2">
                                        <h4 className="font-medium text-white/70 mb-1 flex items-center">
                                            <Paperclip className="w-4 h-4 mr-2" />
                                            Attachment
                                        </h4>
                                        <a
                                          href={decryptedContent.attachment}
                                          download="attachment"
                                          className="inline-flex items-center px-3 py-2 bg-white/[0.05] rounded-lg text-sm text-white/80 hover:bg-white/[0.1] transition-colors"
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                          Download File
                                        </a>
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-3 border-t border-white/[0.1] mt-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleArchiveReport(report.id);
                                        }}
                                      >
                                        <Archive className="w-4 h-4 mr-1" />
                                        Archive Report
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-sm text-white/50">
                                <Lock className="w-4 h-4" />
                                <span>Encrypted Report #{report.id}</span>
                              </div>
                            )}
                          </div>

                          {selectedReport?.id === report.id &&
                            isDecrypting && (
                              <div className="ml-3">
                                <RefreshCw className="w-5 h-5 text-[#0000fe] animate-spin" />
                              </div>
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- Dialogs (Modals) --- */}
      
      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Export Keys</CardTitle>
              <CardDescription>
                Save a secure copy. Protect with a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                label="Password (optional)"
                placeholder="Enter password to encrypt keys"
                value={exportPassword}
                onChange={(e) => {
                  setExportPassword(e.target.value);
                  setExportPasswordError("");
                }}
                error={exportPasswordError}
                helperText={
                  !exportPasswordError ? "Leave empty for unencrypted export (NOT RECOMMENDED)" : undefined
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleExportKeys();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowExportDialog(false);
                    setExportPassword("");
                    setExportPasswordError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleExportKeys}
                  disabled={!!exportPasswordError}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manual Input Dialog */}
      {showManualInputDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enter Keys Manually</CardTitle>
              <CardDescription>
                Paste your existing Public and Private keys below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">
                  Public Key
                </label>
                <textarea
                  value={manualPublicKey}
                  onChange={(e) => setManualPublicKey(e.target.value)}
                  placeholder="Paste your public key here"
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0000fe] transition-colors resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">
                  Private Key
                </label>
                <textarea
                  value={manualPrivateKey}
                  onChange={(e) => setManualPrivateKey(e.target.value)}
                  placeholder="Paste your private key here"
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0000fe] transition-colors resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowManualInputDialog(false);
                    setManualPublicKey("");
                    setManualPrivateKey("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (manualPublicKey && manualPrivateKey) {
                      const newKeyPair = {
                        publicKey: manualPublicKey.trim(),
                        privateKey: manualPrivateKey.trim(),
                      };
                      setKeyPair(newKeyPair);
                      keyStorage.saveKeyPair(newKeyPair, "moderator");
                      setShowManualInputDialog(false);
                      setManualPublicKey("");
                      setManualPrivateKey("");
                      setAlertMessage({
                        type: "success",
                        message: "Keys added successfully!",
                      });
                    } else {
                      setAlertMessage({
                        type: "danger",
                        message: "Both keys are required",
                      });
                    }
                  }}
                  disabled={!manualPublicKey || !manualPrivateKey}
                >
                  Save Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Import Keys from File</CardTitle>
              <CardDescription>
                Select the previously exported JSON key file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Select Key File
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-white/60
                    file:mr-3 file:py-2 file:px-4
                    file:rounded-lg file:border file:border-white/[0.2]
                    file:text-sm file:font-medium
                    file:bg-white/[0.05] file:text-white/80
                    file:cursor-pointer
                    hover:file:bg-white/[0.1]
                    file:transition-all file:duration-200"
                />
                {importFileName && (
                  <p className="mt-1 text-xs text-white/50">
                    Selected: {importFileName}
                  </p>
                )}
                {importError && !needsPassword && (
                    <p className="mt-1 text-xs text-red-400">{importError}</p>
                )}
              </div>

              {needsPassword && (
                <div className="p-3 bg-yellow-500/[0.1] border border-yellow-500/[0.2] rounded-xl">
                  <p className="text-sm text-yellow-400 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Key file is password-protected.
                  </p>
                </div>
              )}

              <Input
                type="password"
                label="Password (if protected)"
                placeholder="Enter password if keys are encrypted"
                value={importPassword}
                onChange={(e) => {
                  setImportPassword(e.target.value);
                  setImportError(null);
                }}
                error={importError || undefined}
                required={needsPassword}
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportPassword("");
                    setImportFileContent(null);
                    setImportFileName(null);
                    setNeedsPassword(false);
                    setImportError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleImportKeys}
                  disabled={
                    !importFileContent || (needsPassword && !importPassword) || !!importError
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModeratorPage;