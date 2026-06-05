import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteReportModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Remove Report?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action will completely remove your report from active listings. You can't undo this action.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
