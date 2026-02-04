import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = ({ notifications }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <AnimatePresence>
        {notifications.map(({ id, message, type }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`px-4 py-3 rounded-lg shadow-lg max-w-md ${
              type === 'error' 
                ? 'bg-red-500 text-white' 
                : type === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-500 text-white'
            }`}
          >
            <div className="flex items-center">
              {type === 'error' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {type === 'success' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {type === 'info' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;