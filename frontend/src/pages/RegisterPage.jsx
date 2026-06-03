import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [shakeField, setShakeField] = useState(null);
  const [serverError, setServerError] = useState('');
  
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Indian mobile format: ^[6-9]\d{9}$)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number";
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = "Must contain 8+ chars, 1 uppercase, 1 number, 1 special character";
    }

    // Confirm password
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
  }, [formData]);

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/\d/.test(pass)) score += 25;
    if (/[@$!%*?&#]/.test(pass)) score += 25;

    if (score < 50) return { score, label: 'Weak', color: 'text-red-500', bar: 'bg-red-500' };
    if (score < 100) return { score, label: 'Medium', color: 'text-yellow-500', bar: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'text-green-500', bar: 'bg-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    if (serverError) setServerError('');
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const triggerShake = (fieldName) => {
    setShakeField(fieldName);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Touch all fields on submit to show errors immediately if skipped
    const allTouched = { name: true, email: true, phone: true, password: true, confirmPassword: true };
    setTouched(allTouched);

    if (Object.keys(errors).length > 0) {
      // Find the first error field and shake it
      const firstErrorField = Object.keys(errors)[0];
      triggerShake(firstErrorField);
      return;
    }

    if (!formData.agree) {
      setServerError("Please agree to the Terms of Service.");
      triggerShake('serverError');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
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
        setServerError(data.message);
        triggerShake('serverError');
      }
    } catch (err) {
      console.error(err);
      setServerError('Error connecting to server. Please try again.');
      triggerShake('serverError');
    }
  };

  const shakeAnimation = {
    shake: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } }
  };

  return (
    <div className="flex justify-center items-center py-16 px-4 min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      <div className="glass-card p-8 rounded-3xl max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-500 text-[15px]">Join the smartest campus community today.</p>
        </div>
        
        <AnimatePresence>
          {serverError && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }} 
              animate={{ opacity: 1, y: 0, height: 'auto' }} 
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded-r-xl"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{serverError}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.form animate={shakeField === 'serverError' ? 'shake' : ''} variants={shakeAnimation} onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Johnson" 
                className="w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all text-[15px]"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <motion.div animate={shakeField === 'email' ? 'shake' : ''} variants={shakeAnimation}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center transition-colors ${touched.email && errors.email ? 'text-red-400' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="alex.johnson@university.edu" 
                className={`w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none transition-all text-[15px] ${touched.email && errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF]'}`}
                required
              />
            </div>
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.p initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phone Field */}
          <motion.div animate={shakeField === 'phone' ? 'shake' : ''} variants={shakeAnimation}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center transition-colors ${touched.phone && errors.phone ? 'text-red-400' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </span>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="9876543210" 
                className={`w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none transition-all text-[15px] ${touched.phone && errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF]'}`}
                required
              />
            </div>
            <AnimatePresence>
              {touched.phone && errors.phone && (
                <motion.p initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.phone}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Field */}
          <motion.div animate={shakeField === 'password' ? 'shake' : ''} variants={shakeAnimation}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center transition-colors ${touched.password && errors.password ? 'text-red-400' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••••" 
                className={`w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none transition-all text-[15px] ${touched.password && errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF]'}`}
                required
              />
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Password strength</span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${strength.color}`}>{strength.label}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.score}%` }}
                    className={`h-1.5 rounded-full ${strength.bar}`}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
            
            <AnimatePresence>
              {touched.password && errors.password && (
                <motion.p initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div animate={shakeField === 'confirmPassword' ? 'shake' : ''} variants={shakeAnimation}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center transition-colors ${touched.confirmPassword && errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••••" 
                className={`w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none transition-all text-[15px] ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF]'}`}
                required
              />
            </div>
            <AnimatePresence>
              {touched.confirmPassword && errors.confirmPassword && (
                <motion.p initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.confirmPassword}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex items-center pt-2">
            <input 
              type="checkbox" 
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              id="agree" 
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-xl hover:opacity-90 shadow-sm mt-4 text-[15px] cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Create Account
          </button>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <span className="text-gray-500 text-sm">or</span>
            <p className="mt-4 text-sm text-gray-600">
              Already have an account? <Link to="/login" state={{ from }} className="text-blue-600 font-medium hover:underline cursor-pointer hover:scale-105 transition-all duration-300">Sign In</Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
