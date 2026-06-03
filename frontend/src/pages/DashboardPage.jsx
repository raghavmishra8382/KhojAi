import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, AlertCircle, CheckCircle, Search, Sparkles, User, Mail, Phone, Inbox, Send, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function DashboardPage() {
  const { state } = useAppContext();
  const { user } = state;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('items'); // 'items', 'received', 'submitted', 'received_msgs', 'submitted_msgs'
  const [items, setItems] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [submittedMessages, setSubmittedMessages] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]); // Can be populated from API later
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [itemsRes, sentClaimsRes, receivedClaimsRes, sentMsgsRes, receivedMsgsRes, matchesRes] = await Promise.all([
          fetch('http://localhost:5000/api/items'),
          fetch('http://localhost:5000/api/claims/submitted', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/claims/received', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/contact/submitted', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/contact/received', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/items/my/matches', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (itemsRes.ok) {
          const allItems = await itemsRes.json();
          // Filter items by current user
          const userId = user?.id || user?._id;
          if (userId) {
            setItems(allItems.filter(item => {
              const itemUserId = typeof item.user === 'object' ? item.user._id : item.user;
              return itemUserId === userId;
            }));
          } else {
            setItems(allItems);
          }
        }

        // Fetch Received Claims
        const recRes = await fetch('http://localhost:5000/api/claims/received', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recRes.ok) setReceivedClaims(await recRes.json());

        // Fetch Submitted Claims
        const subRes = await fetch('http://localhost:5000/api/claims/submitted', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (subRes.ok) setSubmittedClaims(await subRes.json());

        // Fetch Received Messages
        const recMsgRes = await fetch('http://localhost:5000/api/contact/received', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recMsgRes.ok) setReceivedMessages(await recMsgRes.json());

        // Fetch Submitted Messages
        const subMsgRes = await fetch('http://localhost:5000/api/contact/submitted', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (subMsgRes.ok) setSubmittedMessages(await subMsgRes.json());

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token, navigate]);

  const handleUpdateClaimStatus = async (claimId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/claims/${claimId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        // Refresh received claims
        const recRes = await fetch('http://localhost:5000/api/claims/received', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recRes.ok) setReceivedClaims(await recRes.json());
        setError(null);
      } else {
        setError('Failed to update claim status');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    }
  };

  const handleUpdateMessageStatus = async (msgId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/contact/${msgId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        const recRes = await fetch('http://localhost:5000/api/contact/received', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recRes.ok) setReceivedMessages(await recRes.json());
        setError(null);
      } else {
        setError('Failed to update message status');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    }
  };

  const lostItems = items.filter(item => item.type === 'lost').map(item => ({...item, id: item._id, status: item.status === 'resolved' ? 'Resolved' : 'Active'})).slice(0, 3);
  const foundItems = items.filter(item => item.type === 'found').map(item => ({...item, id: item._id, status: item.status === 'resolved' ? 'Claimed' : 'Active'})).slice(0, 3);

  const ItemCard = ({ item }) => {
    const getBadgeStyles = (status) => {
      switch(status) {
        case 'Active': return 'bg-white/90 text-[#0052FF] border border-blue-100 shadow-[0_0_15px_rgba(0,82,255,0.2)]';
        case 'Matched': return 'bg-white/90 text-[#00C853] border border-green-100 shadow-[0_0_15px_rgba(0,200,83,0.2)]';
        case 'Claimed': return 'bg-white/90 text-[#8B5CF6] border border-purple-100 shadow-[0_0_15px_rgba(139,92,246,0.2)]';
        case 'Resolved': return 'bg-white/90 text-amber-500 border border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
        default: return 'bg-white/90 text-gray-600 border border-gray-200';
      }
    };
  
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to={`/item/${item.id}`} className="block bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-500 group cursor-pointer relative overflow-hidden h-full">
          <div className="w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100">
            <img src={item.image || 'https://via.placeholder.com/300?text=No+Image'} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-3 left-3">
              <span className={`text-[11px] px-3 py-1.5 rounded-full font-bold backdrop-blur-xl flex items-center gap-1.5 uppercase tracking-wider ${getBadgeStyles(item.status)}`}>
                {item.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping relative"><span className="absolute inset-0 rounded-full bg-current"></span></span>}
                {item.status}
              </span>
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-[#0052FF] transition-colors capitalize line-clamp-1 mb-2">
              {item.title.replace(/One\s*Plus/i, 'OnePlus')}
            </h3>
          <div className="text-sm text-slate-500 flex items-center gap-1.5 mb-1 mt-auto font-medium">
            <MapPin size={14} className="text-slate-400" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 text-lg">Welcome back, <span className="font-semibold text-gray-800">{user?.name || 'User'}</span>!</p>
        
        {/* Header Stats */}
        <div className="flex flex-wrap gap-4 md:gap-6 mt-6">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 min-w-[200px] hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shadow-inner"><AlertCircle size={24}/></div>
            <div><p className="text-2xl font-extrabold text-gray-900">{items.filter(item => item.status !== 'resolved').length}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Reports</p></div>
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 min-w-[200px] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-3 rounded-xl text-teal-700 shadow-inner"><Sparkles size={24}/></div>
            <div className="relative z-10"><p className="text-2xl font-extrabold text-gray-900">{recentMatches.length}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">AI Matches Found</p></div>
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 min-w-[200px] hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600 shadow-inner"><ShieldCheck size={24}/></div>
            <div><p className="text-2xl font-extrabold text-gray-900">{items.filter(item => item.status === 'resolved').length}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Resolved Items</p></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8 relative overflow-x-auto hide-scrollbar">
        {[
          { id: 'items', label: 'Community Items', icon: null },
          { id: 'received', label: 'Claims on My Items', icon: <Inbox size={16} />, badge: receivedClaims.filter(c => c.status === 'pending').length },
          { id: 'submitted', label: 'My Claims', icon: <Send size={16} /> },
          { id: 'received_msgs', label: 'Inbox', icon: <Mail size={16} />, badge: receivedMessages.filter(m => m.status === 'pending').length },
          { id: 'submitted_msgs', label: 'Sent Messages', icon: <Send size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-4 px-2 font-bold text-sm cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="dashboard-tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-t-full shadow-[0_-2px_10px_rgba(6,182,212,0.5)]"></motion.div>
            )}
            {tab.icon} {tab.label}
            {tab.badge > 0 && (
              <span className="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your data...</div>
      ) : (
        <>
          {/* TAB: ITEMS */}
          {activeTab === 'items' && (
            <>
              {/* AI Presence Widget */}
              <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-3xl p-1 mb-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-xl group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>
                <div className="bg-gray-900/90 rounded-[1.4rem] p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="relative w-14 h-14 bg-cyan-950 rounded-2xl flex items-center justify-center border border-cyan-800/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      <Sparkles className="text-cyan-400" size={28} />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full"></span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">AI Monitoring Active <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Online</span></h3>
                      <p className="text-gray-400 text-sm mt-1">Our AI is continuously scanning community reports to find your lost items.</p>
                    </div>
                  </div>
                  <Link to="/search" className="relative group/btn overflow-hidden rounded-xl bg-white/10 border border-white/20 text-white px-6 py-3 font-bold cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:border-cyan-400/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                    <Sparkles size={18} className="text-cyan-400" /> View Recent Matches
                  </Link>
                </div>
              </div>

              {/* Match Preview Showcase */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-500" /> Recent AI Matches
                </h3>
                
                {recentMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentMatches.map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] hover:border-cyan-100 transition-all duration-300 cursor-pointer group/match">
                        <div className="flex -space-x-3">
                          <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs text-slate-500 shadow-sm z-10 overflow-hidden"><img src={m.itemDetails?.image || "https://via.placeholder.com/100?text=No+Image"} className="w-full h-full object-cover" /></div>
                          <div className="w-12 h-12 rounded-full border-2 border-white bg-cyan-100 flex items-center justify-center text-xs text-cyan-600 font-bold shadow-sm z-0 overflow-hidden text-[10px] text-center">AI<br/>Match</div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-gray-900 text-sm group-hover/match:text-cyan-600 transition-colors truncate">{m.itemDetails?.title}</p>
                          <p className="text-xs text-gray-500">{new Date(m.itemDetails?.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-cyan-500" strokeWidth="3" strokeDasharray={`${m.similarityPercentage || 0}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <span className="absolute text-[10px] font-extrabold text-cyan-600">{m.similarityPercentage}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-inner flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Sparkles size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No recent AI matches</p>
                  </div>
                )}
              </div>

              {/* Quick Actions Banner */}
              <div className="bg-gradient-to-br from-[#0052FF] via-[#0066FF] to-cyan-500 rounded-3xl p-8 text-white mb-10 shadow-[0_10px_30px_rgba(0,82,255,0.3)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-[2000ms]"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-extrabold mb-2">Quick Actions</h2>
                  <p className="text-white/80 mb-6 font-medium">Report or search for items in just a few clicks</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Link to="/post-lost" className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-transparent rounded-2xl p-5 flex items-center gap-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer group/card active:scale-95 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <div className="p-3 bg-white/20 group-hover/card:bg-red-500 group-hover/card:shadow-[0_0_20px_rgba(239,68,68,0.5)] rounded-xl transition-all duration-500 relative z-10">
                        <AlertCircle size={26} className="text-white transition-colors" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-lg text-white">Report Lost</div>
                        <div className="text-sm text-white/80">Lost something?</div>
                      </div>
                    </Link>
                    
                    <Link to="/post-found" className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-transparent rounded-2xl p-5 flex items-center gap-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer group/card active:scale-95 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <div className="p-3 bg-white/20 group-hover/card:bg-green-500 group-hover/card:shadow-[0_0_20px_rgba(34,197,94,0.5)] rounded-xl transition-all duration-500 relative z-10">
                        <CheckCircle size={26} className="text-white transition-colors" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-lg text-white">Report Found</div>
                        <div className="text-sm text-white/80">Found something?</div>
                      </div>
                    </Link>
          
                    <Link to="/search" className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-transparent rounded-2xl p-5 flex items-center gap-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer group/card active:scale-95 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <div className="p-3 bg-white/20 group-hover/card:bg-cyan-500 group-hover/card:shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-xl transition-all duration-500 relative z-10">
                        <Search size={26} className="text-white transition-colors" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-lg text-white">Search Items</div>
                        <div className="text-sm text-white/80">Browse all items</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
        
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900">Recent Lost Items</h2>
                      <p className="text-gray-500 text-sm mt-1">Community members are looking for these.</p>
                    </div>
                    <Link to="/search?type=lost" className="text-[#0052FF] text-sm font-bold hover:underline cursor-pointer bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                    {lostItems.map(item => <ItemCard key={item.id} item={item} />)}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900">Recent Found Items</h2>
                      <p className="text-gray-500 text-sm mt-1">Items waiting to be claimed.</p>
                    </div>
                    <Link to="/search?type=found" className="text-[#0052FF] text-sm font-bold hover:underline cursor-pointer bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                    {foundItems.map(item => <ItemCard key={item.id} item={item} />)}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: RECEIVED CLAIMS */}
          {activeTab === 'received' && (
            <div className="space-y-6">
              {receivedClaims.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                      <Inbox size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Claims Received</h3>
                    <p className="text-gray-500 max-w-sm mb-8">When someone claims an item you found, you will see their verification requests here.</p>
                    <Link to="/post-found" className="bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold shadow-sm cursor-pointer transition-all hover:-translate-y-1 active:scale-95">
                      Report Another Found Item
                    </Link>
                  </div>
                </div>
              ) : (
                receivedClaims.map(claim => (
                  <div key={claim._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-full md:w-48 aspect-video md:aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={claim.foundItemId.image} className="w-full h-full object-cover" alt="Found Item" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Claim on: {claim.foundItemId.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                        <p className="text-sm text-blue-900 font-semibold mb-1">Claimant's Secret Identifier:</p>
                        <p className="text-gray-700 italic">"{claim.identifyingDetail}"</p>
                      </div>

                      {claim.message && (
                        <p className="text-sm text-gray-600 mb-4"><strong>Message:</strong> {claim.message}</p>
                      )}

                      {claim.proofImage && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Proof Uploaded:</p>
                          <img src={claim.proofImage} alt="Proof" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                        </div>
                      )}

                      {claim.status === 'pending' ? (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => handleUpdateClaimStatus(claim._id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <ShieldCheck size={18} /> Approve & Share Contact
                          </button>
                          <button 
                            onClick={() => handleUpdateClaimStatus(claim._id, 'rejected')}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <XCircle size={18} /> Reject Claim
                          </button>
                        </div>
                      ) : claim.status === 'approved' ? (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500 mb-2">Contact Details Shared with Claimant:</p>
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900"><User size={16} className="text-gray-400" /> {claim.claimantId?.name}</span>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900"><Mail size={16} className="text-gray-400" /> {claim.claimantId?.email}</span>
                            {claim.claimantId?.phone && (
                              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900"><Phone size={16} className="text-gray-400" /> {claim.claimantId?.phone}</span>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: SUBMITTED CLAIMS */}
          {activeTab === 'submitted' && (
            <div className="space-y-6">
              {submittedClaims.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-inner">
                      <Send size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Claims Submitted</h3>
                    <p className="text-gray-500 max-w-sm mb-8">You haven't submitted any claims to prove ownership of found items yet.</p>
                    <Link to="/search?type=found" className="bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold shadow-sm cursor-pointer transition-all hover:-translate-y-1 active:scale-95">
                      Browse Found Items
                    </Link>
                  </div>
                </div>
              ) : (
                submittedClaims.map(claim => (
                  <div key={claim._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-full md:w-32 aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={claim.foundItemId?.image} className="w-full h-full object-cover" alt="Found Item" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Your Claim: {claim.foundItemId?.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {claim.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">Submitted on: {new Date(claim.createdAt).toLocaleDateString()}</p>

                      {claim.status === 'approved' && claim.foundItemId?.user ? (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                          <h4 className="text-green-900 font-bold flex items-center gap-2 mb-3">
                            <ShieldCheck size={18} /> Claim Approved! Finder's Contact Info:
                          </h4>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-green-800 text-sm"><User size={16}/> {claim.foundItemId.user.name}</p>
                            <p className="flex items-center gap-2 text-green-800 text-sm"><Mail size={16}/> {claim.foundItemId.user.email}</p>
                            {claim.foundItemId.user.phone && (
                              <p className="flex items-center gap-2 text-green-800 text-sm"><Phone size={16}/> {claim.foundItemId.user.phone}</p>
                            )}
                          </div>
                        </div>
                      ) : claim.status === 'pending' ? (
                        <p className="text-sm text-gray-600 italic">Waiting for the finder to review your claim request...</p>
                      ) : (
                        <p className="text-sm text-red-600 italic">The finder rejected this claim request.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: INBOX (MESSAGES) */}
          {activeTab === 'received_msgs' && (
            <div className="space-y-6">
              {receivedMessages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                      <Mail size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Inbox Empty</h3>
                    <p className="text-gray-500 max-w-sm mb-8">You have no incoming secure messages right now.</p>
                    <button onClick={() => setActiveTab('items')} className="bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold shadow-sm cursor-pointer transition-all hover:-translate-y-1 active:scale-95">
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                receivedMessages.map(msg => (
                  <div key={msg._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-full md:w-32 aspect-video md:aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={msg.itemId?.image} className="w-full h-full object-cover" alt="Item" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Message regarding: {msg.itemId?.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          msg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          msg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                        <p className="text-sm text-gray-600 mb-2"><strong>Message from {msg.senderId?.name || 'User'}:</strong></p>
                        <p className="text-gray-900">"{msg.message}"</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                      </div>

                      {msg.status === 'pending' ? (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => handleUpdateMessageStatus(msg._id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <ShieldCheck size={18} /> Accept & Share My Contact Info
                          </button>
                          <button 
                            onClick={() => handleUpdateMessageStatus(msg._id, 'rejected')}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <XCircle size={18} /> Decline
                          </button>
                        </div>
                      ) : msg.status === 'approved' ? (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500 mb-2">You accepted this message. Your contact details are visible to this user.</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: SENT MESSAGES */}
          {activeTab === 'submitted_msgs' && (
            <div className="space-y-6">
              {submittedMessages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <Send size={40} className="ml-1" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages Sent</h3>
                    <p className="text-gray-500 max-w-sm mb-8">You haven't contacted any owners regarding their items.</p>
                    <Link to="/search" className="bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold shadow-sm cursor-pointer transition-all hover:-translate-y-1 active:scale-95">
                      Explore Items
                    </Link>
                  </div>
                </div>
              ) : (
                submittedMessages.map(msg => (
                  <div key={msg._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-full md:w-32 aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={msg.itemId?.image} className="w-full h-full object-cover" alt="Item" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Message sent regarding: {msg.itemId?.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          msg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          msg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                        <p className="text-sm text-gray-900 italic">"{msg.message}"</p>
                        <p className="text-xs text-gray-400 mt-2">Sent on {new Date(msg.createdAt).toLocaleString()}</p>
                      </div>

                      {msg.status === 'approved' && msg.recipientId ? (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                          <h4 className="text-green-900 font-bold flex items-center gap-2 mb-3">
                            <ShieldCheck size={18} /> Owner Accepted! Contact Info:
                          </h4>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-green-800 text-sm"><User size={16}/> {msg.recipientId.name}</p>
                            <p className="flex items-center gap-2 text-green-800 text-sm"><Mail size={16}/> {msg.recipientId.email}</p>
                            {msg.recipientId.phone && (
                              <p className="flex items-center gap-2 text-green-800 text-sm"><Phone size={16}/> {msg.recipientId.phone}</p>
                            )}
                          </div>
                        </div>
                      ) : msg.status === 'pending' ? (
                        <p className="text-sm text-gray-600 italic">Waiting for the owner to review your message...</p>
                      ) : (
                        <p className="text-sm text-red-600 italic">The owner declined to share contact details.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
