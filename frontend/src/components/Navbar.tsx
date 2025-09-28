import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";

interface NavbarProps {
  showHomeButton?: boolean;
}

export const Navbar = ({ showHomeButton = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigateTo = (path: string) => {
    window.location.href = path;
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
              { name: "Home", path: "/" },
              { name: "Submit Report", path: "/app" },
              { name: "Moderator", path: "/moderator" },
              { name: "Statistics", path: "/statistics" },
            ].map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <button
                  onClick={() => navigateTo(item.path)}
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
            {showHomeButton ? (
              <button
                onClick={() => navigateTo("/")}
                className="inline-flex items-center justify-center px-5 py-2 text-sm text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide"
              >
                Back to Home
              </button>
            ) : (
              <button
                onClick={() => navigateTo("/app")}
                className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-[#0000fe] rounded-full hover:bg-blue-600 transition-all duration-300 font-medium tracking-wide"
              >
                Get Started
              </button>
            )}
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
                { name: "Home", path: "/" },
                { name: "Submit Report", path: "/app" },
                { name: "Moderator", path: "/moderator" },
                { name: "Statistics", path: "/statistics" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <button
                    onClick={() => navigateTo(item.path)}
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
                {showHomeButton ? (
                  <button
                    onClick={() => navigateTo("/")}
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide"
                  >
                    Back to Home
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo("/app")}
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-white bg-[#0000fe] rounded-full hover:bg-blue-600 transition-all duration-300 font-medium tracking-wide"
                  >
                    Get Started
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
