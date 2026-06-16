import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          
          const getIcon = () => {
            switch (toast.type) {
              case 'success': return <CheckCircle2 className="text-emerald-500" size={24} />;
              case 'error': return <XCircle className="text-rose-500" size={24} />;
              case 'warning': return <AlertCircle className="text-amber-500" size={24} />;
              case 'info': return <Info className="text-blue-500" size={24} />;
            }
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex items-start pointer-events-auto overflow-hidden relative group"
            >
              <div className="flex-shrink-0 mr-3">
                {getIcon()}
              </div>
              <div className="flex-1 text-sm font-medium text-gray-900 pt-0.5">
                {toast.message}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>

              {/* Progress bar for auto-closing toasts */}
              {toast.duration !== 0 && (
                <motion.div 
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: (toast.duration || 3000) / 1000, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 bg-gray-200 w-full origin-left ${
                    toast.type === 'success' ? 'bg-emerald-200' :
                    toast.type === 'error' ? 'bg-rose-200' :
                    toast.type === 'warning' ? 'bg-amber-200' : 'bg-blue-200'
                  }`}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
