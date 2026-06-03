import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight, MapPin, Calendar, ExternalLink, Activity, Sparkles, Eye } from 'lucide-react';
import DetailedComparisonModal from '../components/DetailedComparisonModal';
import { useAppContext } from '../context/AppContext';

export default function AIMatchResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const [lostItem, setLostItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useAppContext();
  const { user } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Lost Item
        const itemRes = await fetch(`http://localhost:5000/api/items/${id}`);
        const itemData = await itemRes.json();
        
        if (itemRes.ok) {
          setLostItem({
            id: itemData._id,
            title: itemData.title,
            date: itemData.date || new Date(itemData.createdAt).toLocaleDateString(),
            location: itemData.location,
            image: itemData.image || 'https://via.placeholder.com/150',
            category: itemData.category,
            user: itemData.user
          });
        }

        // Fetch Matches
        const matchesRes = await fetch(`http://localhost:5000/api/items/${id}/matches`);
        const matchesData = await matchesRes.json();

        if (matchesRes.ok) {
          const formattedMatches = matchesData.map(match => ({
            id: match.itemDetails._id,
            title: match.itemDetails.title,
            confidence: match.similarityPercentage,
            dateFound: match.itemDetails.date || new Date(match.itemDetails.createdAt).toLocaleDateString(),
            locationFound: match.itemDetails.location,
            image: match.itemDetails.image || 'https://via.placeholder.com/150',
            aiNote: `AI identified a ${match.similarityPercentage}% semantic match. Rated as: ${match.confidenceLabel}.`,
            matchedAttributes: [
              { label: 'Category', value: match.itemDetails.category || 'Unknown', match: itemData.category === match.itemDetails.category },
              { label: 'Location Match', value: match.itemDetails.location || 'Unknown', match: itemData.location?.toLowerCase() === match.itemDetails.location?.toLowerCase() },
              { label: 'Confidence Label', value: match.confidenceLabel, match: match.similarityPercentage >= 70 }
            ]
          }));
          setMatches(formattedMatches);
        }
      } catch (err) {
        console.error("Error fetching match data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center p-20 flex flex-col items-center justify-center min-h-screen text-indigo-600"><Activity className="animate-spin mb-4" size={32} /> Analyzing AI Matches...</div>;
  if (!lostItem) return <div className="text-center p-20 min-h-screen">Item not found</div>;

  const selectedMatch = matches[selectedMatchIndex];
  
  // Check ownership
  const isOwner = lostItem && user && (
    (typeof lostItem.user === 'object' && lostItem.user._id === user.id) || 
    (typeof lostItem.user === 'string' && lostItem.user === user.id) ||
    (lostItem.user === user.id)
  );

  // Circular Progress Component
  const CircularProgress = ({ percentage }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan 500 */}
              <stop offset="100%" stopColor="#14b8a6" /> {/* Teal 500 */}
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-teal-500">
            {percentage}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Match</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium cursor-pointer hover:scale-105 transition-all duration-300 w-max"
          >
            <ArrowLeft size={20} />
            Back to Item Details
          </button>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> AI Analysis Complete
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Your Lost Item Matches <span className="text-indigo-600">{matches.length} Found Items</span>
              </h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                Tracking ID: <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{lostItem.id}</span>
              </p>
            </div>
            
            {/* Lost Item Summary */}
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 w-full md:w-auto">
              <img src={lostItem.image} alt="Lost Item" className="w-16 h-16 rounded-lg object-cover shadow-sm" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Original Item</p>
                <p className="font-semibold text-gray-900">{lostItem.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {lostItem.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={12}/> {lostItem.location ? lostItem.location.split(',')[0] : 'Unknown location'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Match List Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Potential Matches</h3>
            
            {matches.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-inner relative">
                    <Sparkles size={24} />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full"></span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">AI Monitoring Active</h3>
                  <p className="text-xs text-gray-500 text-center leading-relaxed">We're continuously scanning new reports.<br/>No matches found yet.</p>
                </div>
              </div>
              ) : matches.map((match, idx) => (
              <motion.button
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMatchIndex(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                  selectedMatchIndex === idx 
                    ? 'border-cyan-500 bg-white shadow-[0_8px_30px_rgba(6,182,212,0.15)]' 
                    : 'border-transparent bg-white shadow-sm hover:border-gray-200 hover:shadow-md text-gray-500 hover:text-gray-900'
                }`}
              >
                {selectedMatchIndex === idx && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-teal-500 shadow-[2px_0_10px_rgba(6,182,212,0.5)]" 
                  />
                )}
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <img src={match.image} alt={match.title} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-white ${
                      match.confidence > 90 ? 'bg-gradient-to-br from-teal-400 to-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : match.confidence > 70 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-br from-red-400 to-rose-500'
                    }`}>
                      {match.confidence}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate ${selectedMatchIndex === idx ? 'text-gray-900' : ''}`}>
                      {match.title}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                      <MapPin size={12} className={selectedMatchIndex === idx ? 'text-cyan-500' : ''} /> {match.locationFound}
                    </p>
                  </div>
                  <ChevronRight size={20} className={`transition-transform duration-300 ${selectedMatchIndex === idx ? 'text-cyan-500 translate-x-1' : 'text-gray-300 group-hover:translate-x-1'}`} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right Column: Detailed Match View */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMatch ? selectedMatch.id : 'empty-state'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
              >
                {!selectedMatch ? (
                  <div className="p-12 text-center text-gray-500">
                    <Activity className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-lg">No matches available to display.</p>
                  </div>
                ) : (
                  <>
                    {/* Score Header */}
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  {/* Subtle Background Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
                  
                  <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                    <CircularProgress percentage={selectedMatch.confidence} />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Analysis</h2>
                      <p className="text-gray-500 max-w-sm">
                        Our AI semantic matching indicates a <strong className={selectedMatch.confidence > 90 ? 'text-green-600' : 'text-gray-700'}>
                          {selectedMatch.confidence > 90 ? 'highly probable' : selectedMatch.confidence > 70 ? 'moderate' : 'low'}
                        </strong> match based on textual similarity of the description, category, and location heuristics.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-full md:w-auto flex justify-end">
                    {isOwner ? (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all duration-300 border border-gray-700"
                      >
                        Review & Claim <ExternalLink size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/item/${selectedMatch.id}`)}
                        className="w-full md:w-auto bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all duration-300 border border-gray-200"
                      >
                        View Details <Eye size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Attribute Breakdown */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      Attribute Similarity
                    </h3>
                    <div className="space-y-4">
                      {selectedMatch.matchedAttributes.map((attr, i) => (
                        <motion.div 
                          key={`${selectedMatch.id}-attr-${i}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 + 0.3 }}
                          className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                          <div className="flex justify-between items-end mb-2 relative z-10">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">{attr.label}</p>
                              <p className="text-sm font-extrabold text-gray-900">{attr.value}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              {attr.match ? (
                                <span className="text-teal-600 font-bold text-sm bg-teal-50 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={14}/> High</span>
                              ) : (
                                <span className="text-orange-500 font-bold text-sm bg-orange-50 px-2 py-0.5 rounded">Low</span>
                              )}
                            </div>
                          </div>
                          {/* Confidence bar */}
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative z-10 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: attr.match ? '100%' : '30%' }}
                              transition={{ duration: 1, delay: i * 0.15 + 0.5, ease: "easeOut" }}
                              className={`h-full rounded-full ${attr.match ? 'bg-gradient-to-r from-teal-400 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gradient-to-r from-orange-400 to-red-400'}`}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Image Comparison */}
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-6">Visual Comparison</h3>
                     <div className="space-y-4">
                       {/* Side by side visual */}
                       <div className="flex gap-2 p-2 bg-gray-100 rounded-3xl border border-gray-200/50 shadow-inner">
                          <div className="relative flex-1 rounded-2xl overflow-hidden group/img">
                            <img src={lostItem.image} alt="Lost" className="w-full h-48 object-cover group-hover/img:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold text-sm backdrop-blur-sm">
                              Original Report
                            </div>
                          </div>
                          <div className="relative flex-1 rounded-2xl overflow-hidden group/img">
                            <img src={selectedMatch.image} alt="Found" className="w-full h-48 object-cover group-hover/img:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-teal-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold text-sm backdrop-blur-sm">
                              AI Match Found
                            </div>
                          </div>
                       </div>
                       
                       {/* AI Explanation Card */}
                       <motion.div 
                         key={`${selectedMatch.id}-note`}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.6 }}
                         className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl relative overflow-hidden shadow-2xl mt-6 border border-slate-700"
                       >
                         <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
                         <h4 className="text-cyan-400 font-bold flex items-center gap-2 mb-3">
                           <Sparkles size={18} /> AI Logic Explanation
                         </h4>
                         <p className="text-sm text-slate-300 leading-relaxed relative z-10 font-medium">
                           {selectedMatch.aiNote || "The found item shares a structural similarity with your original photo. Semantic textual analysis of the description strongly correlates with your reported attributes."}
                         </p>
                       </motion.div>
                     </div>
                  </div>

                </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      <DetailedComparisonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        lostItem={lostItem} 
        foundItem={selectedMatch} 
      />
    </div>
  );
}
