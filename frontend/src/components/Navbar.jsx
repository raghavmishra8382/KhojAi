import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, User, LogOut, Check, CheckCheck, LayoutDashboard, Settings, HelpCircle, UserCircle, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { state, logout, setIsHelpWidgetOpen } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNotifOpen, setIsMobileNotifOpen] = useState(false);

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

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative px-4 py-7 text-[15px] font-semibold transition-all duration-300 cursor-pointer flex items-center group ${
        isActive(to) ? 'text-[#0052FF]' : 'text-gray-500 hover:text-gray-900 dark:text-white'
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
    <header className="bg-white dark:bg-gray-800/70 backdrop-blur-2xl border-b border-white dark:border-gray-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mr-8">
            <div className="bg-[#00B4D8] p-1.5 rounded-full text-white shadow-sm">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-2xl tracking-tight text-gradient cursor-pointer hover:scale-105 transition-all duration-300">
              KhojAI
            </Link>
          </div>

          {/* Center Navigation - Active Indicators */}
          <nav className="hidden md:flex items-center h-full flex-grow">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/search">AI Matches</NavLink>
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Always visible Report Item button (desktop) */}
            <button 
              onClick={(e) => {
                if (!state.user && !localStorage.getItem('token')) {
                  e.preventDefault();
                  navigate('/login', { state: { message: 'Please login to report an item', from: '/post-lost' } });
                } else {
                  navigate('/post-lost');
                }
              }}
              className="hidden md:flex items-center gap-2 bg-gradient-brand hover:shadow-[0_0_20px_rgba(0,82,255,0.4)] hover:-translate-y-0.5 hover:opacity-90 cursor-pointer hover:scale-105 transition-all duration-300 text-white px-5 py-2.5 rounded-full font-bold text-[14px] shadow-md shadow-blue-500/20 desktop-only-sm"
            >
              <Plus size={18} strokeWidth={3} /> Report Item
            </button>



            {state.user ? (
              <>
                <div className="hidden md:block relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title="View Notifications"
                    className="text-gray-500 hover:text-[#0052FF] cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 relative p-2"
                  >
                    <Bell size={24} strokeWidth={2} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <button onClick={handleMarkAllAsRead} className="text-xs font-semibold text-[#0052FF] hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1" title="Mark all as read">
                                <CheckCheck size={14} /> Mark all read
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">No notifications yet.</div>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 dark:bg-gray-900 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-sm ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{notif.title}</h4>
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
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{notif.message}</p>
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
                
                <div className="hidden md:flex items-center gap-5 pl-6 border-l border-gray-200 dark:border-gray-600/50 ml-2">
                  <div className="relative">
                    <button
                      aria-label={state.user?.name ? `Open profile menu for ${state.user.name}` : 'Open profile menu'}
                      title={state.user?.name || 'Profile'}
                      onClick={() => setIsProfileOpen(p => !p)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsProfileOpen(p => !p); } }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6F7FF] to-[#E6FBF2] border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center text-[#0052FF] overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-200"
                    >
                      {state.user?.avatarUrl ? (
                        <img src={state.user.avatarUrl} alt={state.user.name} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='';}} />
                      ) : (
                        (() => {
                          const name = state.user?.name || '';
                          const parts = name.split(' ').filter(Boolean);
                          const initials = parts.length === 0 ? '' : (parts.length === 1 ? parts[0][0] : (parts[0][0] + parts[parts.length-1][0]));
                          return (initials ? initials.toUpperCase() : <User size={18} />);
                        })()
                      )}
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }} className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="font-bold text-gray-900 dark:text-white truncate">{state.user?.name || 'Profile'}</div>
                            <div className="text-xs text-gray-500">{state.user?.email}</div>
                          </div>
                          <div className="flex flex-col p-2 gap-0.5">
                            <Link to="/dashboard" onClick={()=>setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                              <LayoutDashboard size={16} /> Dashboard
                            </Link>
                            <Link to="/profile" onClick={()=>setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                              <UserCircle size={16} /> My Profile
                            </Link>
                            <Link to="/settings" onClick={()=>setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                              <Settings size={16} /> Settings
                            </Link>
                            <div className="h-px bg-gray-100 my-1 mx-2"></div>
                            <button onClick={()=>{setIsProfileOpen(false); setIsHelpWidgetOpen(true);}} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors w-full text-left">
                              <HelpCircle size={16} /> Help & Support
                            </button>
                            <button onClick={() => { setIsProfileOpen(false); logout(); }} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors text-left w-full mt-0.5">
                              <LogOut size={16} /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-600">
                  <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white font-semibold text-[15px] px-3 cursor-pointer hover:scale-105 transition-all duration-300">Sign In</Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:scale-105 transition-all duration-300 px-6 py-2 rounded-full font-bold text-[14px]"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}

            {/* Hamburger Menu (Mobile) */}
            <button 
              className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:text-[#0052FF] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
            >
              <nav className="flex flex-col py-4 px-2 space-y-1 overflow-y-auto max-h-[80vh]">
                
                {state.user && (
                  <div className="mb-2 pb-4 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E6F7FF] to-[#E6FBF2] border border-gray-200 dark:border-gray-600 flex items-center justify-center text-[#0052FF] overflow-hidden">
                        {state.user?.avatarUrl ? (
                          <img src={state.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-gray-900 dark:text-white truncate">{state.user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{state.user.email}</div>
                      </div>
                    </div>
                    
                    <button onClick={()=>{setIsMobileMenuOpen(false); navigate('/post-lost');}} className="px-4 py-3 mx-2 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md mb-2">
                      <Plus size={18} strokeWidth={3} /> Report Lost/Found Item
                    </button>

                    <Link to="/profile" onClick={()=>setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-3 ${isActive('/profile') ? 'bg-blue-50 text-[#0052FF]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}>
                      <UserCircle size={18} /> My Profile
                    </Link>
                    
                    <button 
                      onClick={() => setIsMobileNotifOpen(!isMobileNotifOpen)}
                      className="w-full px-4 py-3 rounded-xl font-semibold flex items-center justify-between text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={18} /> Notifications
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>
                        )}
                        {isMobileNotifOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isMobileNotifOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {unreadCount > 0 && (
                            <div className="mx-4 flex justify-end">
                              <button onClick={handleMarkAllAsRead} className="text-xs font-bold text-[#0052FF] py-1 px-2 mb-1 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <CheckCheck size={14} /> Mark all read
                              </button>
                            </div>
                          )}
                          {notifications.length > 0 ? (
                            <div className="mx-4 my-1 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 p-2 space-y-2">
                              {notifications.slice(0, 5).map(notif => (
                                 <div key={notif._id} className="p-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                   <div className="flex justify-between items-start">
                                     <h4 className={`text-xs ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>{notif.title}</h4>
                                     {!notif.read && (
                                        <button onClick={() => handleMarkAsRead(notif._id)} className="text-blue-500 p-1 hover:bg-blue-100 rounded-full transition-colors"><Check size={12}/></button>
                                     )}
                                   </div>
                                   <p className="text-[10px] text-gray-500 line-clamp-1 mt-1">{notif.message}</p>
                                 </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mx-4 my-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 text-center text-xs text-gray-500">
                              No notifications yet.
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <Link to="/dashboard" onClick={()=>setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-3 ${isActive('/dashboard') ? 'bg-blue-50 text-[#0052FF]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/search" onClick={()=>setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-3 ${isActive('/search') ? 'bg-blue-50 text-[#0052FF]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}>
                  <Search size={18} /> AI Matches
                </Link>
                
                {state.user && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Link to="/settings" onClick={()=>setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-3 ${isActive('/settings') ? 'bg-blue-50 text-[#0052FF]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}>
                      <Settings size={18} /> Settings
                    </Link>
                    <button onClick={() => { setIsMobileMenuOpen(false); setIsHelpWidgetOpen(true); }} className="w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900 transition-colors text-left">
                      <HelpCircle size={18} /> Help & Support
                    </button>
                    <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                )}

                {!state.user && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 px-2">
                    <Link to="/login" onClick={()=>setIsMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 hover:bg-gray-100">Sign In</Link>
                    <Link to="/register" onClick={()=>setIsMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl font-bold bg-[#0052FF] text-white hover:bg-blue-600 shadow-md">Get Started</Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
