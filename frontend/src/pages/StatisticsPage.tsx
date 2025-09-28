// import { motion } from "framer-motion";
// import { Navbar } from "../components/Navbar";
// import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

// export const StatisticsPage = () => {
//   return (
//     <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

//       <Navbar showHomeButton={true} />

//       <div className="relative z-10 pt-32 pb-16 px-8 max-w-6xl mx-auto">
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
//             Platform Statistics
//           </h1>
//           <p className="text-lg text-white/60 max-w-2xl mx-auto">
//             Comprehensive analytics and insights about platform usage and report
//             trends.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {[
//             {
//               icon: TrendingUp,
//               title: "Total Reports",
//               value: "1,247",
//               change: "+12%",
//               color: "from-blue-500 to-indigo-500",
//             },
//             {
//               icon: BarChart3,
//               title: "Success Rate",
//               value: "94.2%",
//               change: "+2.1%",
//               color: "from-green-500 to-emerald-500",
//             },
//             {
//               icon: PieChart,
//               title: "Active Users",
//               value: "3,891",
//               change: "+8.5%",
//               color: "from-purple-500 to-violet-500",
//             },
//             {
//               icon: Activity,
//               title: "Avg Response Time",
//               value: "2.3h",
//               change: "-15%",
//               color: "from-orange-500 to-red-500",
//             },
//           ].map((item, index) => (
//             <motion.div
//               key={item.title}
//               className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border-white/[0.15] transition-all duration-500"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//             >
//               <div
//                 className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}
//               >
//                 <item.icon className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-sm font-medium text-white/60 mb-2">
//                 {item.title}
//               </h3>
//               <div className="text-2xl font-bold text-white mb-1">
//                 {item.value}
//               </div>
//               <div className="text-sm text-green-400">{item.change}</div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           <h2 className="text-2xl font-bold text-white mb-6">Report Trends</h2>
//           <div className="h-64 bg-white/[0.02] rounded-xl border border-white/[0.08] flex items-center justify-center">
//             <p className="text-white/40">Chart visualization coming soon...</p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default StatisticsPage;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import {
  TrendingUp,
  BarChart3,
  Activity,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  RefreshCw,
  Info,
  Shield,
  Zap,
} from "lucide-react";

// --- START OF PLACEHOLDER UTILITIES AND COMPONENTS (STYLED FOR DARK THEME) ---

// Utility function from context
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// Placeholder for custom components (styled for the dark theme)
const Card: React.FC<
  React.ComponentProps<typeof motion.div> & { className?: string }
> = ({ children, className, ...props }) => (
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

const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3 className={cn("text-xl font-semibold text-white", className)}>
    {children}
  </h3>
);

// Placeholder for lib utilities and data modules
const mockStatsData = {
  totalReports: 1247,
  currentEpoch: Math.floor(Date.now() / 1000 / 86400),
  pendingReports: 120,
  reviewedReports: 1000,
  archivedReports: 127,
  reportsToday: 12,
  contractMode: true,
};

const contractManager = {
  isUsingContract: () => true,
  getAdapter: () => ({
    getContractState: async () => ({
      currentEpoch: mockStatsData.currentEpoch,
    }),
    listReports: async () => [], // Empty array since we use syncReports below for mock data
  }),
};

const syncManager = {
  getProvider: () => ({
    listReports: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Mock reports structure simplified for stats calculation
      const reports = [];
      for (let i = 0; i < mockStatsData.totalReports; i++) {
        let status: "pending" | "reviewed" | "archived" = "reviewed";
        if (i < mockStatsData.pendingReports) status = "pending";
        else if (
          i <
          mockStatsData.pendingReports + mockStatsData.reviewedReports
        )
          status = "reviewed";
        else status = "archived";

        reports.push({
          status,
          timestamp: Date.now() - Math.floor(Math.random() * 30 * 86400 * 1000), // Random timestamp in last 30 days
        });
      }
      return reports;
    },
  }),
};

// Stat Card Component (Dark Theme Adapted)
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // Tailwind gradient class string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  const isPositive =
    change.startsWith("+") ||
    change.includes("Active") ||
    change.includes("On-chain");
  const isNegative = change.startsWith("-");
  const changeClasses = isPositive
    ? "text-green-400"
    : isNegative
    ? "text-red-400"
    : "text-white/60";

  const changeIcon = isPositive ? TrendingUp : isNegative ? TrendingUp : null;

  return (
    <Card className="p-6 h-full flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            `w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-medium text-white/60 text-right">{title}</p>
      </div>

      <div className="mt-auto">
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className={cn("text-sm flex items-center", changeClasses)}>
          {changeIcon && (
            <span className="mr-1">
              {changeIcon === TrendingUp ? "▲" : "▼"}
            </span>
          )}
          <span className="text-white/60 mr-1">|</span>
          <span className="font-medium">{change}</span>
        </div>
      </div>
    </Card>
  );
};

// Progress Bar Component (Dark Theme Adapted)
interface ProgressBarProps {
  label: string;
  percentage: number;
  color: "gray" | "green" | "yellow" | "brand" | "red";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  color = "gray",
}) => {
  const colorClasses = {
    gray: "bg-white/40",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    brand: "bg-[#0000fe]",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-white/[0.08] rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${colorClasses[color]} h-2 rounded-full`}
        />
      </div>
    </div>
  );
};
// --- END OF PLACEHOLDER UTILITIES AND COMPONENTS ---

export const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    currentEpoch: 0,
    pendingReports: 0,
    reviewedReports: 0,
    archivedReports: 0,
    reportsToday: 0,
    contractMode: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const contractAdapter = contractManager.getAdapter();
      const contractState = await contractAdapter.getContractState();

      // Using mock data calculation as per original intent
      const mockReports = await syncManager.getProvider().listReports();
      const reports = mockReports.length > 0 ? mockReports : [];

      const contractMode = contractManager.isUsingContract();

      const currentEpoch = contractMode
        ? contractState.currentEpoch
        : Math.floor(Date.now() / 1000 / 86400); // Daily epoch mock

      const todayReports = reports.filter((r: any) => {
        const reportEpoch = Math.floor(r.timestamp / 1000 / 86400);
        return reportEpoch === currentEpoch;
      });

      const pending = reports.filter((r: any) => r.status === "pending").length;
      const reviewed = reports.filter(
        (r: any) => r.status === "reviewed"
      ).length;
      const archived = reports.filter(
        (r: any) => r.status === "archived"
      ).length;

      setStats({
        totalReports: reports.length,
        currentEpoch,
        pendingReports: pending,
        reviewedReports: reviewed,
        archivedReports: archived,
        reportsToday: todayReports.length,
        contractMode,
      });
      setLastUpdated(Date.now());
    } catch (error) {
      console.error("Failed to load statistics:", error);
      setError(
        "Failed to load statistics. Check network or local configuration."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTimeRemaining = () => {
    const now = Date.now();
    const epochStart = Math.floor(now / 1000 / 86400) * 86400 * 1000;
    const epochEnd = epochStart + 86400 * 1000;
    const remaining = epochEnd - now;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const getStatusPercentages = () => {
    const total = stats.totalReports || 1;
    return {
      pending: Math.round((stats.pendingReports / total) * 100),
      reviewed: Math.round((stats.reviewedReports / total) * 100),
      archived: Math.round((stats.archivedReports / total) * 100),
    };
  };

  const percentages = getStatusPercentages();

  return (
    <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <Navbar showHomeButton={true} />

      <div className="relative z-10 pt-32 pb-16 px-4 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            Platform Statistics
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Privacy-preserving insights into system usage and report status.
          </p>
          {lastUpdated && (
            <p className="text-sm text-white/40 mt-2">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/[0.1] border border-red-500/[0.2] rounded-xl max-w-lg mx-auto"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm text-white/80">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Reports"
            value={stats.totalReports.toLocaleString()}
            change={stats.contractMode ? "On-chain Mode" : "Local Mode"}
            icon={FileText}
            color="from-blue-500 to-indigo-500"
          />
          <StatCard
            title="Reports Today"
            value={stats.reportsToday.toString()}
            change="Rate Limited"
            icon={Activity}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Current Epoch"
            value={stats.currentEpoch.toString()}
            change={getTimeRemaining()}
            icon={Calendar}
            color="from-purple-500 to-violet-500"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReports.toLocaleString()}
            change={`${percentages.pending}% of total`}
            icon={Clock}
            color="from-orange-500 to-red-500"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Report Status & Progress Bar Card */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-8 h-full">
              <CardTitle className="mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-white/70" />
                Report Status Distribution
              </CardTitle>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <ProgressBar
                      label="Reviewed/Verified"
                      percentage={percentages.reviewed}
                      color="green"
                    />
                    <ProgressBar
                      label="Pending Review"
                      percentage={percentages.pending}
                      color="yellow"
                    />
                    <ProgressBar
                      label="Archived"
                      percentage={percentages.archived}
                      color="gray"
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-4">
                    Total Reports: {stats.totalReports.toLocaleString()}
                  </p>
                </div>
                {/* Visualization Placeholder */}
                <div className="h-40 bg-white/[0.02] rounded-xl border border-white/[0.08] flex items-center justify-center">
                  <p className="text-white/40 text-sm">
                    Pie Chart visualization coming soon...
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* System Status Card */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 h-full">
              <CardTitle className="mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-white/70" />
                System Health
              </CardTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                  <span className="text-sm text-white/60 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    Smart Contract Mode
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      stats.contractMode ? "text-green-400" : "text-orange-400"
                    }`}
                  >
                    {stats.contractMode ? "Active (On-chain)" : "Local (Mock)"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                  <span className="text-sm text-white/60">Epoch Duration</span>
                  <span className="text-sm font-medium text-white">
                    24 Hours
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                  <span className="text-sm text-white/60">Rate Limit</span>
                  <span className="text-sm font-medium text-white/80">
                    1 per Identity/Epoch
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-white/60">Privacy Level</span>
                  <span className="text-sm font-medium text-[#0000fe]">
                    Maximum (ZK-Proofs)
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Info & Refresh */}
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-white/60 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">
                  About These Statistics
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Statistics are aggregated using zero-knowledge principles.
                  **No individual report details or reporter identities are ever
                  exposed.** Data sources:{" "}
                  {stats.contractMode
                    ? "Smart Contract Events & Sync Provider."
                    : "Local Mock Data & Sync Provider."}
                </p>
              </div>
            </div>
          </div>

          {/* Refresh button */}
          <div className="flex justify-center">
            <button
              onClick={loadStats}
              disabled={isRefreshing}
              aria-busy={isRefreshing}
              aria-label="Refresh statistics"
              title="Refresh statistics"
              className="px-4 py-2 text-sm text-white/60 hover:text-[#0000fe] hover:bg-white/[0.05] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center font-medium"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 text-[#0000fe] animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRefreshing ? "Refreshing Data..." : "Refresh Statistics"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsPage;
