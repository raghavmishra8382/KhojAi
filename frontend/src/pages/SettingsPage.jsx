import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, Eye, Moon, Key, Trash2, Mail, Lock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { state, dispatch, logout } = useAppContext();
  const navigate = useNavigate();
  const user = state.user;

  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete Account State
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Must contain 8+ chars, 1 uppercase, 1 number, 1 special character");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Preferences Toggle
  const handleTogglePreference = async (key, value) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ [key]: value })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
    } catch (err) {
      console.error('Failed to update preference', err);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmText !== 'delete account') {
      setError('Please type "delete account" to confirm.');
      return;
    }
    if (!deletePassword) {
      setError('Password is required to delete your account.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') 
        },
        body: JSON.stringify({ password: deletePassword })
      });
      if (res.ok) {
        logout();
        navigate('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete account');
      }
    } catch (err) {
      setError('An error occurred while deleting account');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account & Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye size={18} /> }
  ];

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

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 px-4">Settings</h1>
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#0052FF] text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Dropdown Selector */}
        <div className="md:hidden w-full relative z-20">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 px-1">Settings</h1>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1E293B] shadow-sm rounded-2xl font-bold text-gray-900 dark:text-white"
          >
            <div className="flex items-center gap-3">
              {tabs.find(t => t.id === activeTab)?.icon}
              {tabs.find(t => t.id === activeTab)?.label}
            </div>
            <motion.div animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}>
              <ChevronDown size={20} className="text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-gray-200 dark:border-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden flex flex-col"
              >
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-5 py-4 font-semibold transition-all border-b border-gray-50 dark:border-[#1E293B]/50 last:border-0 ${
                      activeTab === tab.id 
                        ? 'bg-[#0052FF]/10 dark:bg-[#0052FF]/20 text-[#0052FF] dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1E293B]/30'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-10 min-h-[500px]">
          
          {message && (
            <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold border border-green-100">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold border border-red-100">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        type="password" required
                        value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        type="password" required
                        value={newPassword} onChange={e=>setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none" 
                      />
                    </div>
                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Password strength</span>
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${strength.color}`}>{strength.label}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${strength.score}%` }}
                            className={`h-1.5 rounded-full ${strength.bar}`}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        type="password" required
                        value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none" 
                      />
                    </div>
                  </div>
                  <button disabled={loading} type="submit" className="mt-4 px-6 py-2.5 bg-[#0052FF] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <hr className="my-10 border-gray-200 dark:border-gray-700" />

                <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-6">
                  <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    Once you delete your account, there is no going back. All of your data will be permanently wiped.
                  </p>
                  
                  {!showDeleteForm ? (
                    <button onClick={() => setShowDeleteForm(true)} className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2">
                      <Trash2 size={18} /> Delete My Account
                    </button>
                  ) : (
                    <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
                      <div className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-xs font-bold px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
                        <Shield size={14} /> Verification Required
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Enter your password</label>
                        <input 
                          type="password" required
                          value={deletePassword} onChange={e=>setDeletePassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Type <span className="text-red-600 dark:text-red-400 font-extrabold select-all">delete account</span> to confirm
                        </label>
                        <input 
                          type="text" required
                          value={deleteConfirmText} onChange={e=>setDeleteConfirmText(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none" 
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button disabled={loading} type="submit" className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                          {loading ? 'Deleting...' : 'Permanently Delete'}
                        </button>
                        <button type="button" onClick={() => setShowDeleteForm(false)} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Mail size={18}/> Email Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive emails when someone finds your lost item.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={user?.preferences?.emailNotifications ?? true} 
                        onChange={(e) => handleTogglePreference('emailNotifications', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0052FF]"></div>
                    </label>
                  </div>

                  {/* Coming Soon */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 opacity-60 pointer-events-none">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">Keyword Alerts <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">Coming Soon</span></h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get notified instantly when specific items are reported.</p>
                    </div>
                    <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Moon size={18}/> Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Toggle the application theme.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={user?.preferences?.darkMode ?? false} 
                      onChange={(e) => handleTogglePreference('darkMode', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0052FF]"></div>
                  </label>
                </div>

              </motion.div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <motion.div key="privacy" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#0052FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Privacy Controls</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  We're building advanced privacy controls so you can hide your email and communicate securely within KhojAI.
                </p>
                <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-sm uppercase tracking-wider">
                  Coming Soon
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
