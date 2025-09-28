import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Users, FileText, CheckCircle } from "lucide-react";

export const ModeratorPage = () => {
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
            Moderator Dashboard
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Review and moderate submitted reports with advanced verification
            tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "Pending Reports",
              description: "Review and verify submitted reports",
              count: "12",
              color: "from-orange-500 to-red-500",
            },
            {
              icon: CheckCircle,
              title: "Verified Reports",
              description: "Approved and processed reports",
              count: "48",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Users,
              title: "Active Moderators",
              description: "Team members reviewing reports",
              count: "5",
              color: "from-blue-500 to-indigo-500",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border-white/[0.15] transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/60 mb-4">{item.description}</p>
              <div className="text-3xl font-bold text-white">{item.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPage;
