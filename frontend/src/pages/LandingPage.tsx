import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Circle,
  ExternalLink,
  Shield,
  Eye,
  Lock,
  FileText,
  Zap,
  Globe,
  Menu,
  X,
  Github,
  Twitter,
  Mail,
  ArrowRight,
} from "lucide-react";

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

function DarkNavbar() {
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
    setIsOpen(false); // Close mobile menu after clicking
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
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-2 text-sm text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide"
            >
              Get Started
            </a>
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
                <a
                  href="#"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide"
                  onClick={toggleMenu}
                >
                  Get Started
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "How it Works", href: "#" },
        { name: "Features", href: "#" },
        { name: "Security", href: "#" },
        { name: "Pricing", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer
      id="footer"
      className="relative bg-[#030303] border-t border-white/[0.08] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.02] via-transparent to-rose-500/[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Midnight</span>
              </div>

              <p className="text-white/60 mb-6 leading-relaxed max-w-md">
                Secure, anonymous whistleblowing platform powered by
                zero-knowledge cryptography. Protect truth-tellers while
                ensuring verifiable reports.
              </p>

              {/* Newsletter signup */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Stay Updated</h4>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/[0.2] transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Copyright */}
          <div className="text-white/40 text-sm">
            © 2024 Midnight. All rights reserved.
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:border-white/[0.2] transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-midnight-black text-pure-white font-outfit">
      <DarkNavbar />
      <HeroGeometric title1="Uncover Truth." title2="Remain Unseen." />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
