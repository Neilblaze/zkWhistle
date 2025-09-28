import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

export const StatisticsPage = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-outfit relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <Navbar showHomeButton={true} />

      <div className="relative z-10 pt-32 pb-16 px-8 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            Platform Statistics
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Comprehensive analytics and insights about platform usage and report
            trends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: TrendingUp,
              title: "Total Reports",
              value: "1,247",
              change: "+12%",
              color: "from-blue-500 to-indigo-500",
            },
            {
              icon: BarChart3,
              title: "Success Rate",
              value: "94.2%",
              change: "+2.1%",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: PieChart,
              title: "Active Users",
              value: "3,891",
              change: "+8.5%",
              color: "from-purple-500 to-violet-500",
            },
            {
              icon: Activity,
              title: "Avg Response Time",
              value: "2.3h",
              change: "-15%",
              color: "from-orange-500 to-red-500",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border-white/[0.15] transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                {item.title}
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                {item.value}
              </div>
              <div className="text-sm text-green-400">{item.change}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Report Trends</h2>
          <div className="h-64 bg-white/[0.02] rounded-xl border border-white/[0.08] flex items-center justify-center">
            <p className="text-white/40">Chart visualization coming soon...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsPage;
