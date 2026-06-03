import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Image as ImageIcon, CheckCircle, Loader2, Info, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ClaimVerificationModal({ isOpen, onClose, foundItem, lostItem }) {
  const token = localStorage.getItem('token');
  const [identifyingDetail, setIdentifyingDetail] = useState('');
  const [message, setMessage] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [proofImagePreview, setProofImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Allow opening the modal when either a foundItem OR a lostItem is provided.
  if (!foundItem && !lostItem) return null;

  const itemContext = foundItem || lostItem;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!identifyingDetail) return;
    
    setIsSubmitting(true);
    
    try {
    const formData = new FormData();
    if (foundItem) formData.append('foundItemId', foundItem.id || foundItem._id);
    if (lostItem) formData.append('lostItemId', lostItem.id || lostItem._id);
    formData.append('identifyingDetail', identifyingDetail);
    if (message) formData.append('message', message);
    if (proofImage) formData.append('proofImage', proofImage);

      const res = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        setError('Failed to submit claim: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      setError('Error submitting claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Claim Verification</h2>
              {!isSubmitting && !submitted && (
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {submitted ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted!</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Your claim for "{itemContext.title}" has been securely sent. You will be notified in your Dashboard when the finder reviews your request.
                  </p>
                <button 
                  onClick={onClose}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Return to Matches
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 mb-6 flex items-start gap-3">
                  <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                  <p>
                    <strong>Secure Verification Process:</strong> To protect everyone's privacy, your contact information will only be shared with the finder <strong>after</strong> they review and approve your claim.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Identifying Detail <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">What is a specific detail about this item that only the owner would know? (e.g. "There's a scratch on the bottom left corner")</p>
                    <textarea 
                      required
                      value={identifyingDetail}
                      onChange={(e) => setIdentifyingDetail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                      rows="3"
                      placeholder="Enter a secret identifying detail..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Additional Message
                    </label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                      rows="2"
                      placeholder="Any message for the finder..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Proof Image (Optional)
                    </label>
                    
                    {!proofImagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> a receipt, old photo, or proof of purchase.</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    ) : (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <img src={proofImagePreview} alt="Proof" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <label className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-100">
                            Change Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !identifyingDetail}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                    ) : (
                      <><Send size={18} /> Submit Claim</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
