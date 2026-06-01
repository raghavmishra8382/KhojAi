import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, User, LogOut, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { state, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (state.user) {
      const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
          const res = await fetch('http://localhost:5000/api/notifications', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setNotifications(await res.json());
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchNotifications();
    }
  }, [state.user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative px-4 py-7 text-[15px] font-semibold transition-all duration-300 cursor-pointer flex items-center group ${
        isActive(to) ? 'text-[#0052FF]' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {children}
      {/* Animated Hover Underline for Non-Active Links */}
      {!isActive(to) && (
        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-300 rounded-t-md scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
      )}
      {/* Active Indicator */}
      {isActive(to) && (
        <motion.span 
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0052FF] rounded-t-md shadow-[0_-2px_10px_rgba(0,82,255,0.4)]"
        ></motion.span>
      )}
    </Link>
  );

  return (
    <header className="bg-white/70 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mr-8">
            <div className="bg-[#00B4D8] p-1.5 rounded-full text-white shadow-sm">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <Link to="/" className="font-bold text-2xl tracking-tight text-gradient cursor-pointer hover:scale-105 transition-all duration-300">
              KhojAI
            </Link>
          </div>

          {/* Center Navigation - Active Indicators */}
          <nav className="hidden md:flex items-center h-full flex-grow">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/search">AI Matches</NavLink>
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center gap-5">
            
            {/* Always visible Report Item button */}
            <button 
              onClick={(e) => {
                if (!state.user && !localStorage.getItem('token')) {
                  e.preventDefault();
                  navigate('/login', { state: { message: 'Please login to report an item', from: '/post-lost' } });
                } else {
                  navigate('/post-lost');
                }
              }}
              className="hidden sm:flex items-center gap-2 bg-gradient-brand hover:shadow-[0_0_20px_rgba(0,82,255,0.4)] hover:-translate-y-0.5 hover:opacity-90 cursor-pointer hover:scale-105 transition-all duration-300 text-white px-5 py-2.5 rounded-full font-bold text-[14px] shadow-md shadow-blue-500/20"
            >
              <Plus size={18} strokeWidth={3} /> Report Item
            </button>

            {state.user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title="View Notifications"
                    className="text-gray-500 hover:text-[#0052FF] cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 relative p-2"
                  >
                    <Bell size={24} strokeWidth={2} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">{unreadCount} New</span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">No notifications yet.</div>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title}</h4>
                                  {!notif.read && (
                                    <button 
                                      onClick={() => handleMarkAsRead(notif._id)}
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                      title="Mark as read"
                                    >
                                      <Check size={14} />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-gray-400 mt-2 block">
                                  {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex items-center gap-5 pl-6 border-l border-gray-200/50 ml-2">
                  <div className="flex items-center gap-3" title="Your Profile">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white shadow-md flex items-center justify-center text-[#0052FF] overflow-hidden hover:border-[#0052FF] cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300">
                       <User size={20} />
                    </div>
                  </div>
                  <button onClick={logout} className="text-gray-400 hover:text-red-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 p-2" title="Logout">
                    <LogOut size={22} strokeWidth={2} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-semibold text-[15px] px-3 cursor-pointer hover:scale-105 transition-all duration-300">Sign In</Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-800 hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:scale-105 transition-all duration-300 px-6 py-2 rounded-full font-bold text-[14px]"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
