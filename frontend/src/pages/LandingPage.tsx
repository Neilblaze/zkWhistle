import { motion } from "framer-motion";
import {
  Circle,
  ExternalLink,
  Shield,
  Eye,
  Lock,
  FileText,
  Zap,
  Globe,
} from "lucide-react";
import { Navbar } from "../components/Navbar";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({
  badge = "ZK Whistleblower",
  title1 = "Uncover Truth.",
  title2 = "Remain Unseen.",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-rose-500/80" />
            <span className="text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 "
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/60 mb-8 leading-relaxed font-light tracking-wide">
              Submit verifiable reports with zero-knowledge proofs — protect
              your identity while ensuring trust.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <button
              onClick={() => (window.location.href = "/app")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0000fe] text-white font-mono font-semibold tracking-wider rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Open App</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative p-8 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl hover:border-white/[0.15] transition-all duration-500 hover:bg-white/[0.04] hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/[0.15] to-rose-500/[0.15] flex items-center justify-center border border-white/[0.1] group-hover:border-white/[0.2] transition-all duration-500">
            <Icon className="w-7 h-7 text-white/80 group-hover:text-white transition-colors duration-500" />
          </div>

          {/* Animated glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/[0.2] to-rose-500/[0.2] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/95 transition-colors duration-500">
            {title}
          </h3>
          <p className="text-white/60 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
            {description}
          </p>
        </div>

        {/* Subtle border animation */}
        <div
          className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-indigo-500/[0.2] via-transparent to-rose-500/[0.2] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            maskImage:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskImage:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Zero-Knowledge Privacy",
      description:
        "Submit reports with cryptographic proofs that verify your claims without revealing your identity. Your anonymity is mathematically guaranteed.",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All communications and data are encrypted using advanced cryptographic protocols. Even we cannot access your personal information.",
    },
    {
      icon: Eye,
      title: "Anonymous Reporting",
      description:
        "Report misconduct, corruption, or illegal activities without fear of retaliation. Your identity remains completely hidden from all parties.",
    },
    {
      icon: FileText,
      title: "Verifiable Evidence",
      description:
        "Submit documents, images, and other evidence with cryptographic proofs that ensure authenticity without compromising your anonymity.",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description:
        "Our ZK-proof system provides instant verification of report authenticity while maintaining complete privacy of the whistleblower.",
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description:
        "Access our platform from anywhere in the world. Built on decentralized infrastructure that resists censorship and government interference.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <section
      id="features"
      className="relative py-24 px-4 bg-[#030303] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <Circle className="h-2 w-2 fill-indigo-500/80" />
            <span className="text-sm text-white/60 tracking-wide">
              Features
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
              Privacy-First
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Whistleblowing
            </span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Built on cutting-edge zero-knowledge cryptography to protect
            whistleblowers while ensuring the integrity of reported information.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-[#030303] border-t border-white/[0.08] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.02] via-transparent to-rose-500/[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-white/60 text-sm">
            Made for Midnight Hackathon hosted by MLH
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-midnight-black text-pure-white font-outfit">
      <Navbar />
      <HeroGeometric title1="Uncover Truth." title2="Remain Unseen." />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
