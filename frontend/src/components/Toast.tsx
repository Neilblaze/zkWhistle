import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onHide: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onHide }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onHide={onHide} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500/[0.1]',
          borderColor: 'border-green-500/[0.2]',
          textColor: 'text-green-400',
          icon: Check,
        };
      case 'error':
        return {
          bgColor: 'bg-red-500/[0.1]',
          borderColor: 'border-red-500/[0.2]',
          textColor: 'text-red-400',
          icon: X,
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500/[0.1]',
          borderColor: 'border-yellow-500/[0.2]',
          textColor: 'text-yellow-400',
          icon: AlertTriangle,
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-500/[0.1]',
          borderColor: 'border-blue-500/[0.2]',
          textColor: 'text-blue-400',
          icon: Info,
        };
    }
  };

  const styles = getToastStyles(toast.type);
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={`
        relative p-4 rounded-xl border backdrop-blur-sm
        ${styles.bgColor} ${styles.borderColor}
        shadow-lg hover:shadow-xl transition-shadow duration-300
        max-w-sm w-full
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative flex items-start space-x-3">
        <div className={`flex-shrink-0 ${styles.textColor}`}>
          <Icon className="w-5 h-5 mt-0.5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${styles.textColor} mb-1`}>
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-white/70 text-sm leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onHide(toast.id)}
          className="flex-shrink-0 text-white/40 hover:text-white/70 transition-colors duration-200 p-1 -m-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
