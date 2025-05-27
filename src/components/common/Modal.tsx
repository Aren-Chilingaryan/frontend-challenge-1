import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  closeButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, closeButton = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 20,
              mass: 1
            }}
            className="relative bg-white rounded-lg shadow-xl p-6 [@media(max-width:370px)]:p-0 max-w-lg w-full mx-4"
          >
            {closeButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 [@media(max-width:370px)]:top-2 [@media(max-width:370px)]:right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 [@media(max-width:370px)]:p-1 shadow-lg transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 [@media(max-width:370px)]:h-3 [@media(max-width:370px)]:w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 