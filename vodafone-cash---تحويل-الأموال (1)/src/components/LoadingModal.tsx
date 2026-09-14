import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = 'جاري التحميل',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px]"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center justify-center w-48 h-40 rounded-2xl bg-neutral-900/90 text-white shadow-2xl border border-white/10 px-6 py-5"
          >
            {/* Spinning Vodafone Teardrop */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none">
                  {/* Circular partial track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                  />
                  {/* Glowing Vodafone Speechmark tail */}
                  <path
                    d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50C90 32.9 79.2 18.4 64.1 12.8C64.5 14.2 64.7 15.7 64.7 17.2C64.7 29.6 54.6 39.7 42.2 39.7C38.4 39.7 34.8 38.7 31.7 37.1C30.9 41.1 30.5 45.3 30.5 49.6C30.5 63.2 41.5 74.2 55.1 74.2C68.7 74.2 79.7 63.2 79.7 49.6C79.7 27.7 62.2 10 50 10Z"
                    fill="white"
                  />
                </svg>
              </motion.div>
            </div>

            <p className="text-base font-semibold tracking-wide text-neutral-100">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
