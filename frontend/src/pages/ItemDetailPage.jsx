import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, ArrowLeft, ShieldCheck, CheckCircle, Trash2, Sparkles, Activity } from 'lucide-react';
import QuickFoundModal from '../components/QuickFoundModal';
import ContactOwnerModal from '../components/ContactOwnerModal';
import ClaimVerificationModal from '../components/ClaimVerificationModal';
import DeleteReportModal from '../components/DeleteReportModal';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { user } = state;
  const token = localStorage.getItem('token');

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQuickFoundOpen, setIsQuickFoundOpen] = useState(false);
  const [isContactOwnerOpen, setIsContactOwnerOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/${id}`);
        const data = await response.json();
        if (response.ok) {
          setItem({
            ...data,
            id: data._id,
            itemType: data.type.charAt(0).toUpperCase() + data.type.slice(1),
            dbStatus: data.status,
            displayStatus: data.status === 'resolved' ? (data.type === 'lost' ? 'Recovered' : 'Claimed') : 'Active',
            contact: {
              name: data.user?.name || 'Anonymous',
              email: data.user?.email || 'N/A',
              phone: 'N/A'
            }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center p-20">Loading...</div>;
  if (!item) return <div className="text-center p-20">Item not found</div>;

  const isOwner = user && item.user && (user.id || user._id) === (item.user.id || item.user._id);

  const handleMarkResolved = async () => {
    if (!window.confirm('Are you sure you want to mark this item as resolved?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/items/${item.id}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setItem({ 
          ...item, 
          dbStatus: 'resolved',
          displayStatus: item.itemType === 'Lost' ? 'Recovered' : 'Claimed'
        });
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/items/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setShowToast(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        alert('Failed to delete post.');
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 pt-8 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium cursor-pointer hover:scale-105 transition-all duration-300">
          <ArrowLeft size={20} />
          Back to Results
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row p-4 md:p-6 gap-6 md:gap-10">
            {/* Image */}
            <div className="w-full md:w-[45%] h-72 md:h-[500px] relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border border-slate-100 flex items-center justify-center">
              <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
            </div>

            {/* Details */}
            <div className="w-full md:w-[55%] flex flex-col justify-center">
              {/* Badge & Title */}
              <div className="mb-6">
                <div className={`inline-block mb-3 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,0,0,0.1)] ${item.itemType === 'Lost' ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-green-600 text-white shadow-green-500/30'}`}>
                  {item.itemType} Item
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 capitalize leading-tight">{item.title.replace(/One\s*Plus/i, 'OnePlus')}</h1>
              </div>
              
              <div className="flex flex-col gap-4 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <span className="font-medium text-lg">{item.location}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <span className="font-medium text-lg">
                    {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.date))}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">Description</h3>
                <p className="text-slate-600 leading-loose text-lg font-medium">
                  {item.description}
                </p>
              </div>

              {/* Contact Card (Glassmorphism) */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-500">
                <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-4 py-1.5 rounded-bl-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={14} /> Private Contact
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-5">Posted By</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <User size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {item.contact.name}
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Verified User</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    For privacy and safety, direct contact information is hidden. Use the secure messaging buttons below to reach out.
                  </p>
                </div>
              </div>

            {/* Actions / Buttons Section */}
            <div className="mt-10">
              
              {/* Status Indicator */}
              <div className="flex items-center gap-3 mb-4 text-slate-700 font-medium">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.dbStatus === 'resolved' ? 'bg-gray-400' : 'bg-cyan-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${item.dbStatus === 'resolved' ? 'bg-gray-500' : 'bg-cyan-500'}`}></span>
                </span>
                {item.dbStatus === 'resolved' ? `Status: Item ${item.displayStatus} Successfully` : 'Status: Searching for Matches'}
              </div>

              {/* AI Widget */}
              {item.dbStatus !== 'resolved' && (
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 mb-6 text-white shadow-lg border border-slate-700 flex items-start gap-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Activity className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2">AI Match Status <Sparkles size={16} className="text-yellow-400"/></h4>
                    <p className="text-slate-300 text-sm">AI is actively monitoring similar {item.itemType === 'Lost' ? 'found' : 'lost'} item reports. High confidence matches will be displayed here.</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                {item.dbStatus === 'resolved' ? (
                  <div className="w-full bg-green-50 text-green-700 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 border border-green-200 text-lg shadow-sm">
                    <CheckCircle size={24} /> This item has been successfully resolved and returned!
                  </div>
                ) : isOwner ? (
                  // Owner Controls
                  <>
                    <button onClick={() => navigate(`/matches/${item.id}`)} className="flex-[2] py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] cursor-pointer hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3 text-lg">
                      <Sparkles size={20} className="text-white" />
                      View AI Matching
                    </button>
                    
                    {item.itemType === 'Found' && (
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 py-4 px-6 rounded-2xl font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 shadow-sm cursor-pointer hover:-translate-y-1 transition-all duration-300"
                      >
                        Review Claims
                      </button>
                    )}
                    
                    <button 
                      onClick={handleMarkResolved}
                      className="flex-1 py-4 px-6 rounded-2xl font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 shadow-sm cursor-pointer hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={18} /> {item.itemType === 'Lost' ? 'Mark as Recovered' : 'Mark as Claimed'}
                    </button>
                    
                    <div className="w-full mt-2 border-t border-slate-100 pt-6">
                      <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full max-w-[200px] mx-auto py-2.5 px-4 rounded-xl font-semibold text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 cursor-pointer transition-all duration-300 flex justify-center items-center gap-2 text-sm"
                      >
                        <Trash2 size={16} /> Remove Report
                      </button>
                    </div>
                  </>
                ) : (
                  // Non-Owner Controls
                  <>
                    {item.itemType === 'Lost' ? (
                      <button 
                        onClick={() => setIsQuickFoundOpen(true)}
                        className="flex-[2] py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 flex items-center justify-center text-lg gap-2"
                      >
                        <Sparkles size={20}/> I Found This Item
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsClaimOpen(true)}
                        className="flex-[2] py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 flex items-center justify-center text-lg gap-2"
                      >
                        <ShieldCheck size={20}/> This is My Item
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setIsContactOwnerOpen(true)}
                      className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm cursor-pointer hover:-translate-y-1 transition-all duration-300 text-lg"
                    >
                      Contact Owner
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <QuickFoundModal 
        isOpen={isQuickFoundOpen} 
        onClose={() => setIsQuickFoundOpen(false)} 
        lostItem={item} 
      />
      
      <ContactOwnerModal 
        isOpen={isContactOwnerOpen} 
        onClose={() => setIsContactOwnerOpen(false)} 
        item={item} 
      />

      {item && (
        <ClaimVerificationModal 
          isOpen={isClaimOpen} 
          onClose={() => setIsClaimOpen(false)} 
          foundItem={item} 
        />
      )}

      <DeleteReportModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        loading={isDeleting}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm text-gray-300">Report removed successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
