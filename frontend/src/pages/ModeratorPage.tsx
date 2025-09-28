import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { useWallet } from "../hooks/useWallet";
import { useToast, ToastProvider } from "../components/Toast";
import { ReportStorageService, type StoredReport } from "../services/reportStorageService";
import {
  FileText,
  Download,
  X,
  RefreshCw,
  Lock,
  Archive,
  AlertTriangle,
  Info,
  Check,
  File,
  Type,
  Paperclip,
  Wallet,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Users,
} from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

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
    <button
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
};


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

interface ZKProof {}
interface Report extends Omit<StoredReport, 'id'> {
  id: number | string;
  encryptedData?: string;
  proof?: ZKProof;
}
interface DecryptedReport {
  title: string;
  content: string;
  attachment?: string;
  attachmentName?: string;
}

const mockReports: Report[] = [
  {
    id: 1,
    title: "Mock Report 1",
    content: "Mock content 1",
    attachment: null,
    attachmentName: null,
    timestamp: Date.now() - 3600000 * 24,
    submitterAddress: "mock_address_1",
    txHash: "mock_tx_1",
    status: "pending",
    upvotes: 5,
    downvotes: 1,
    userVote: null,
    upvoters: ["mn_shield-addr_t1234567890abcdef", "mn_shield-addr_t0987654321fedcba"],
    downvoters: ["mn_shield-addr_tabcdef1234567890"],
    encryptedData: '{"data":"mock_data_1"}',
    proof: {},
  },
  {
    id: 2,
    title: "Mock Report 2",
    content: "Mock content 2",
    attachment: null,
    attachmentName: null,
    timestamp: Date.now() - 3600000 * 48,
    submitterAddress: "mock_address_2",
    txHash: "mock_tx_2",
    status: "reviewed",
    upvotes: 8,
    downvotes: 2,
    userVote: null,
    upvoters: ["mn_shield-addr_t1111111111111111", "mn_shield-addr_t2222222222222222", "mn_shield-addr_t3333333333333333"],
    downvoters: ["mn_shield-addr_t4444444444444444", "mn_shield-addr_t5555555555555555"],
    encryptedData: '{"data":"mock_data_2"}',
    proof: {},
  },
  {
    id: 3,
    title: "Mock Report 3",
    content: "Mock content 3",
    attachment: null,
    attachmentName: null,
    timestamp: Date.now() - 3600000 * 72,
    submitterAddress: "mock_address_3",
    txHash: "mock_tx_3",
    status: "pending",
    upvotes: 3,
    downvotes: 0,
    userVote: null,
    upvoters: ["mn_shield-addr_t6666666666666666", "mn_shield-addr_t7777777777777777", "mn_shield-addr_t8888888888888888"],
    downvoters: [],
    encryptedData: '{"data":"mock_data_3"}',
    proof: {},
  },
];

const getDecryptedContent = (report: StoredReport): DecryptedReport => ({
  title: report.title,
  content: report.content,
  attachment: report.attachment || undefined,
  attachmentName: report.attachmentName || undefined,
});

const decryptMessage = async (report: StoredReport, _privateKey: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return JSON.stringify(getDecryptedContent(report));
};
const validateEncryptedData = (data: any) => typeof data.data === 'string';
const verifyProof = async (_proof: ZKProof) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return true;
};

const AttachmentPreview: React.FC<{ 
  attachment: string; 
  attachmentName?: string; 
  onClose: () => void 
}> = ({ attachment, attachmentName, onClose }) => {
  const isImage = attachment.startsWith('data:image/');
  const isPdf = attachment.startsWith('data:application/pdf');
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Preview: {attachmentName || 'Attachment'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="bg-white/[0.05] rounded-xl p-4">
          {isImage ? (
            <img 
              src={attachment} 
              alt={attachmentName || 'Attachment'} 
              className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg"
            />
          ) : isPdf ? (
            <div className="text-center py-8">
              <File className="w-16 h-16 mx-auto text-white/40 mb-4" />
              <p className="text-white/60 mb-4">PDF Preview not available</p>
              <a
                href={attachment}
                download={attachmentName || 'document.pdf'}
                className="inline-flex items-center px-4 py-2 bg-[#0000fe] text-white rounded-xl hover:bg-[#0000cc] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </div>
          ) : (
            <div className="text-center py-8">
              <File className="w-16 h-16 mx-auto text-white/40 mb-4" />
              <p className="text-white/60 mb-4">Preview not available for this file type</p>
              <a
                href={attachment}
                download={attachmentName || 'file'}
                className="inline-flex items-center px-4 py-2 bg-[#0000fe] text-white rounded-xl hover:bg-[#0000cc] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModeratorPageContent: React.FC = () => {
  const { showToast } = useToast();
  const { 
    wallet, 
    isLoading: walletLoading, 
    error: walletError, 
    connectLaceWallet,
    disconnectLaceWallet,
    laceWalletState 
  } = useWallet();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [decryptedContent, setDecryptedContent] =
    useState<DecryptedReport | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<{
    data: string;
    name?: string;
  } | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "danger" | "info" | "warning";
    message: string;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    archived: 0,
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (laceWalletState.isConnected) {
      loadReports();
    }
  }, [laceWalletState.isConnected]);

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
      const storedReports = laceWalletState.isConnected && wallet
        ? ReportStorageService.loadUserVotesForReports(wallet.address)
        : ReportStorageService.getAllReports();

      const formattedReports: Report[] = storedReports
        .map((r) => ({
          ...r,
          id: r.id,
          encryptedData: JSON.stringify({ data: `mock_data_${r.id}` }),
          proof: {},
          upvoters: r.upvoters || [],
          downvoters: r.downvoters || [],
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setReports(formattedReports);
      setLastUpdated(Date.now());
      console.log(`📊 Loaded ${formattedReports.length} reports`);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setReports(mockReports);
        setLastUpdated(Date.now());
    } finally {
      setIsRefreshing(false);
    }
  };


  const updateReportStatus = async (
    id: number | string,
    status: "pending" | "reviewed" | "archived"
  ) => {
    try {
      ReportStorageService.updateReportStatus(id.toString(), status);
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  };

  const handleDecryptReport = async (report: Report) => {
    console.log('🔍 Attempting to decrypt report:', report.id);
    
    if (!laceWalletState.isConnected) {
      setAlertMessage({
        type: "danger",
        message: "Please connect your wallet to view report details.",
      });
      return;
    }

    if (selectedReport?.id === report.id) {
        setSelectedReport(null);
        setDecryptedContent(null);
        return;
    }

    setIsDecrypting(true);
    setDecryptedContent(null);
    setSelectedReport(report);

    try {
      const encryptedData = report.encryptedData ? JSON.parse(report.encryptedData) : null;

      if (encryptedData && !validateEncryptedData(encryptedData)) {
        throw new Error("Invalid encrypted data format");
      }

      const isProofValid = await verifyProof(report.proof || {});
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
      
      console.log('📋 Looking for stored report with ID:', report.id.toString());
      const storedReport = ReportStorageService.getAllReports().find(r => r.id === report.id.toString());
      
      if (!storedReport) {
        console.log('⚠️ Report not found in storage, using report data directly');
        // If not found in storage, use the report data directly
        const reportData = {
          title: report.title || `Report #${report.id}`,
          content: report.content || 'No content available',
          attachment: report.attachment || undefined,
          attachmentName: report.attachmentName || undefined,
        };
      setDecryptedContent(reportData);
      } else {
        console.log('✅ Found stored report, decrypting...');
        const decrypted = await decryptMessage(storedReport, "mock_private_key");
        const reportData = JSON.parse(decrypted);
        setDecryptedContent(reportData);
      }

      await updateReportStatus(report.id, "reviewed");
      await loadReports();
    } catch (error) {
      console.error("Decryption error:", error);
      setAlertMessage({
        type: "danger",
        message: "Failed to decrypt report. Please check your wallet connection and try again.",
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

  const handleWalletConnect = async () => {
    try {
      await connectLaceWallet();
      showToast({
        type: 'success',
        title: 'Wallet Connected Successfully',
        message: 'Your Midnight Lace wallet is connected and ready.',
        duration: 4000
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Wallet Connection Failed',
        message: err instanceof Error ? err.message : "Failed to connect wallet",
        duration: 5000
      });
    }
  };

  const handleVote = async (reportId: number | string, voteType: "up" | "down") => {
    if (!laceWalletState.isConnected) {
      showToast({
        type: 'warning',
        title: 'Wallet Required',
        message: 'Please connect your wallet to vote on reports.',
        duration: 4000
      });
      return;
    }

    try {
      if (wallet) {
        ReportStorageService.voteOnReport(reportId.toString(), voteType, wallet.address);
      }
      
      await loadReports();

      showToast({
        type: 'success',
        title: 'Vote Recorded',
        message: `Your ${voteType}vote has been recorded on the blockchain.`,
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Vote Failed',
        message: 'Failed to record your vote. Please try again.',
        duration: 4000
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <Navbar showHomeButton={true} />

      <div className="relative z-10 pt-32 pb-16 px-4 max-w-7xl mx-auto">
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
          <div className="lg:col-span-1 space-y-6">
            <Card
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardTitle className="mb-4 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-white/70" />
                Wallet Connection
              </CardTitle>
              <div className="space-y-4">
                {!laceWalletState.isConnected ? (
                  <>
                    <div className="p-3 bg-yellow-500/[0.1] border border-yellow-500/[0.2] rounded-xl">
                      <p className="text-sm text-yellow-400 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Wallet connection required to vote on reports
                      </p>
                    </div>
                    <Button
                      onClick={handleWalletConnect}
                      disabled={walletLoading}
                      className="w-full"
                      size="md"
                    >
                      {walletLoading ? "Connecting..." : "Connect Midnight Lace Wallet"}
                    </Button>
                    {walletError && (
                      <p className="text-sm text-red-400">{walletError}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-green-500/[0.1] border border-green-500/[0.2] rounded-xl">
                      <p className="text-sm text-green-400 flex items-center">
                        <Check className="w-4 h-4 mr-2" />
                        Wallet connected successfully
                        </p>
                      </div>
                    {wallet && (
                      <div className="p-3 bg-white/[0.05] rounded-lg border border-white/[0.1]">
                        <div className="text-xs font-medium text-white/50 mb-1">
                          Address
                        </div>
                        <p className="text-xs font-mono text-white/80 break-all">
                          {wallet.address.slice(0, 16)}...{wallet.address.slice(-8)}
                        </p>
                      </div>
                    )}
                      <Button
                        variant="outline"
                        size="sm"
                      className="w-full"
                      onClick={disconnectLaceWallet}
                      >
                        <X className="w-4 h-4 mr-1" />
                      Disconnect Wallet
                      </Button>
                  </>
                )}
              </div>
            </Card>

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
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
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
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVote(report.id, "up");
                                  }}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
                                    report.userVote === "up"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : "bg-white/[0.05] text-white/60 hover:bg-green-500/10 hover:text-green-400"
                                  }`}
                                  disabled={!laceWalletState.isConnected}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{report.upvotes || 0}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVote(report.id, "down");
                                  }}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
                                    report.userVote === "down"
                                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                      : "bg-white/[0.05] text-white/60 hover:bg-red-500/10 hover:text-red-400"
                                  }`}
                                  disabled={!laceWalletState.isConnected}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>{report.downvotes || 0}</span>
                                </button>
                              </div>
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
                                        <h4 className="font-medium text-white/70 mb-2 flex items-center">
                                            <Paperclip className="w-4 h-4 mr-2" />
                                            Attachment: {decryptedContent.attachmentName || 'Unknown file'}
                                        </h4>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              setPreviewAttachment({
                                                data: decryptedContent.attachment!,
                                                name: decryptedContent.attachmentName
                                              });
                                              setShowPreview(true);
                                            }}
                                            className="inline-flex items-center px-3 py-2 bg-white/[0.05] rounded-lg text-sm text-white/80 hover:bg-white/[0.1] transition-colors"
                                          >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Preview
                                          </button>
                                        <a
                                          href={decryptedContent.attachment}
                                            download={decryptedContent.attachmentName || "attachment"}
                                          className="inline-flex items-center px-3 py-2 bg-white/[0.05] rounded-lg text-sm text-white/80 hover:bg-white/[0.1] transition-colors"
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </a>
                                        </div>
                                      </div>
                                    )}

                                    {((report.upvoters && report.upvoters.length > 0) || (report.downvoters && report.downvoters.length > 0)) && (
                                      <div className="pt-3 border-t border-white/[0.1] mt-4">
                                        <h4 className="font-medium text-white/70 mb-2 flex items-center">
                                          <Users className="w-4 h-4 mr-2" />
                                          Voting Details
                                        </h4>
                                        
                                        {report.upvoters && report.upvoters.length > 0 && (
                                          <div className="mb-2">
                                            <p className="text-sm text-green-400 mb-1 flex items-center">
                                              <ThumbsUp className="w-3 h-3 mr-1" />
                                              Upvoted by ({report.upvoters.length}):
                                            </p>
                                            <div className="space-y-1">
                                              {report.upvoters.map((address, index) => (
                                                <div key={index} className="text-xs font-mono text-white/60 bg-white/[0.03] px-2 py-1 rounded">
                                                  {address.slice(0, 16)}...{address.slice(-8)}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {report.downvoters && report.downvoters.length > 0 && (
                                          <div className="mb-2">
                                            <p className="text-sm text-red-400 mb-1 flex items-center">
                                              <ThumbsDown className="w-3 h-3 mr-1" />
                                              Downvoted by ({report.downvoters.length}):
                                            </p>
                                            <div className="space-y-1">
                                              {report.downvoters.map((address, index) => (
                                                <div key={index} className="text-xs font-mono text-white/60 bg-white/[0.03] px-2 py-1 rounded">
                                                  {address.slice(0, 16)}...{address.slice(-8)}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-3 border-t border-white/[0.1] mt-4">
                                      {wallet && wallet.address === report.submitterAddress && (
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
                                      )}
                                      {wallet && wallet.address !== report.submitterAddress && (
                                        <div className="text-xs text-white/40 py-2">
                                          Only the report submitter can archive this report
                                        </div>
                                      )}
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

      {showPreview && previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment.data}
          attachmentName={previewAttachment.name}
          onClose={() => {
            setShowPreview(false);
            setPreviewAttachment(null);
          }}
        />
      )}

              </div>
  );
};

const ModeratorPage: React.FC = () => {
  return (
    <ToastProvider>
      <ModeratorPageContent />
    </ToastProvider>
  );
};

export default ModeratorPage;