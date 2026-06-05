import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-24 px-4 min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background Orbs matching Login page */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      <div className="glass-card p-10 rounded-3xl max-w-md w-full relative z-10 border border-white dark:border-gray-800/50 shadow-[0_20px_60px_rgba(0,82,255,0.05)]">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Reset Password</h2>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Mail size={20} />
                    </span>
                    <input 
                      type="email" 
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@university.edu" 
                      className="w-full pl-10 pr-3 py-3.5 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all text-[15px] shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-xl hover:shadow-[0_10px_20px_rgba(0,82,255,0.2)] shadow-sm mt-6 text-[15px] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Check Your Email</h3>
              <p className="text-gray-500 text-[15px] mb-8 leading-relaxed">
                We've sent a password reset link to <br/>
                <span className="font-bold text-gray-800 dark:text-gray-100">{email}</span>
              </p>
              
              <Link 
                to="/login"
                className="w-full inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 dark:bg-gray-900 shadow-sm transition-all text-[15px]"
              >
                Return to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
