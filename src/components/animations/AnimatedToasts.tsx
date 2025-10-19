import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface AnimatedToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function AnimatedToast({ 
  id, 
  type, 
  title, 
  description, 
  duration = 5000,
  onClose 
}: AnimatedToastProps) {
  React.useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, type, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/50',
          iconColor: 'text-green-400'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/50',
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/50',
          iconColor: 'text-orange-400'
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/50',
          iconColor: 'text-blue-400'
        };
      case 'loading':
        return {
          icon: Loader2,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/50',
          iconColor: 'text-purple-400'
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/50',
          iconColor: 'text-gray-400'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-lg border backdrop-blur-sm p-4 shadow-lg ${config.bgColor} ${config.borderColor}`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
            'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
            'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className={`flex-shrink-0 ${config.iconColor}`}
        >
          {type === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`font-semibold ${config.color}`}
          >
            {title}
          </motion.h4>
          
          {description && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-300 mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>

        {type !== 'loading' && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClose(id)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Progress bar for non-loading toasts */}
      {type !== 'loading' && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/20"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: AnimatedToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <AnimatedToast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing animated toasts
export function useAnimatedToast() {
  const [toasts, setToasts] = React.useState<AnimatedToastProps[]>([]);

  const addToast = React.useCallback((toast: Omit<AnimatedToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  }, [addToast]);

  const warning = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'warning', title, description });
  }, [addToast]);

  const info = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  }, [addToast]);

  const loading = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'loading', title, description });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    loading
  };
}
