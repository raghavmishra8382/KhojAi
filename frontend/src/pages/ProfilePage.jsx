import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, Edit2, LayoutDashboard, Settings, MapPin, Calendar, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const user = state.user;

  const [stats, setStats] = useState({ active: 0, resolved: 0, loading: true });

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5000/api/items/myitems', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const resolved = data.filter(i => i.status === 'resolved').length;
            const active = data.length - resolved;
            setStats({ active, resolved, loading: false });
          } else {
            setStats({ active: 0, resolved: 0, loading: false });
          }
        } catch (err) {
          console.error('Failed to fetch stats', err);
          setStats({ active: 0, resolved: 0, loading: false });
        }
      };
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You must be signed in to view your profile.</p>
          <button onClick={() => navigate('/login')} className="w-full bg-[#0052FF] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fafcff] pb-20">
      {/* Dynamic Header Background */}
      <div className="h-48 sm:h-64 bg-gradient-to-br from-[#0052FF] via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 dark:bg-gray-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Main Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/3 bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-800 rounded-[2rem] p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center relative"
          >
            <div className="relative inline-block mb-6 group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#0F172A] dark:to-[#0B1120] shadow-xl overflow-hidden flex items-center justify-center text-3xl sm:text-4xl font-black text-indigo-600 relative z-10 mx-auto">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              
              <Link to="/profile/edit" className="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#0052FF] hover:scale-110 transition-all z-20" title="Change Avatar">
                <Camera size={18} />
              </Link>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{user.name}</h1>
            <p className="text-gray-500 font-medium mb-4">{user.email}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 mb-8">
              <ShieldCheck size={14} /> Verified Member
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/profile/edit" className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm">
                <Edit2 size={18} /> Edit Profile
              </Link>
              <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:bg-gray-900 transition-colors shadow-sm">
                <LayoutDashboard size={18} /> My Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-2/3 flex flex-col gap-6"
          >
            {/* Personal Details */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-800 rounded-[2rem] p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Personal Information</h2>
                <Link to="/settings" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-[#0052FF] hover:bg-blue-50 transition-colors">
                  <Settings size={20} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <User size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Full Name</span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">{user.name}</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Joined Date</span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 sm:col-span-2">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Mail size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Email Address</span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg break-all">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Activity Overview */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-800 rounded-[2rem] p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Activity Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Active Reports</div>
                    <div className="font-extrabold text-gray-900 dark:text-white text-3xl">{stats.loading ? '-' : stats.active}</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <LayoutDashboard size={24} />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Items Recovered</div>
                    <div className="font-extrabold text-gray-900 dark:text-white text-3xl">{stats.loading ? '-' : stats.resolved}</div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#0F172A] dark:to-[#0B1120] border border-blue-100 rounded-[2rem] p-5 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Did you know?</h3>
              <p className="text-blue-800/80 leading-relaxed text-sm">
                Completing your profile with a detailed avatar and verified email helps increase trust when claiming found items. You can also configure keyword alerts in your settings to get notified instantly when items matching your interests are reported.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
