import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ContactOwnerModal({ isOpen, onClose, item }) {
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!message) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: item.id || item._id,
          message
        })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        setError('Failed to send message: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-green-500" /> Secure Message
              </h2>
              {!isSubmitting && !submitted && (
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    The owner has been notified. They can read your message and reply via the platform.
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-gray-900 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer w-full"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send a private message to the owner of <span className="font-semibold text-gray-900 dark:text-white">"{item.title}"</span>. Your contact information is kept private.
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                      rows="4"
                      placeholder="e.g. Hi, I think I saw your item near the library cafe..."
                    ></textarea>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || !message}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={18} className="animate-spin" /> Sending...</>
                      ) : (
                        <><Send size={18} /> Send Message</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
