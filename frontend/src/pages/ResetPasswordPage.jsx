import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        // Automatically log them in with the new token
        localStorage.setItem('token', data.token);
        login(data.user);
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
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      <div className="glass-card p-10 rounded-3xl max-w-md w-full relative z-10 border border-white dark:border-gray-800/50 shadow-[0_20px_60px_rgba(99,102,241,0.05)]">
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Create New Password</h2>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Your new password must be different from previous used passwords.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock size={20} />
                    </span>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••" 
                      className="w-full pl-10 pr-3 py-3.5 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-[15px] shadow-inner"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock size={20} />
                    </span>
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••" 
                      className="w-full pl-10 pr-3 py-3.5 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-[15px] shadow-inner"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_10px_20px_rgba(99,102,241,0.2)] shadow-sm mt-6 text-[15px] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Reset Password"
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
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Password Reset!</h3>
              <p className="text-gray-500 text-[15px] mb-8 leading-relaxed">
                Your password has been successfully reset. You are now logged in.
              </p>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full flex justify-center items-center gap-2 bg-gradient-brand text-white font-bold py-3 rounded-xl hover:opacity-90 shadow-sm transition-all text-[15px] hover:scale-[1.02]"
              >
                Go to Dashboard <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
