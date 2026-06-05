import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const toastMessage = location.state?.message;
  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        login(data.user);
        navigate(from);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    }
  };

  return (
    <div className="flex justify-center items-center py-24 px-4 min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      <div className="glass-card p-10 rounded-3xl max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-[15px]">Please enter your details to sign in.</p>
        </div>
        
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }} 
              animate={{ opacity: 1, y: 0, height: 'auto' }} 
              className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-6 rounded-r-xl"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 font-medium">{toastMessage}</p>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }} 
              animate={{ opacity: 1, y: 0, height: 'auto' }} 
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={20} />
              </span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@university.edu" 
                className="w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all text-[15px]"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-[#111827]">Password</label>
              <Link to="/forgot-password" className="text-sm font-medium text-[#0052FF] hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={20} />
              </span>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••" 
                className="w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all text-[15px]"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-xl hover:opacity-90 shadow-sm mt-4 text-[15px] cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Sign In
          </button>

          <div className="text-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-[15px] text-gray-600 dark:text-gray-400">
              Don't have an account? <Link to="/register" state={{ from }} className="text-[#0052FF] font-semibold hover:underline cursor-pointer hover:scale-105 transition-all duration-300">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
