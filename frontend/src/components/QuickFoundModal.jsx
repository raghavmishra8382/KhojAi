import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, CheckCircle, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function QuickFoundModal({ isOpen, onClose, lostItem, onSuccess }) {
  const token = localStorage.getItem('token');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!lostItem) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!location || !date || !imageFile) {
      setError('Please provide a location, date, and upload an image.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', lostItem.title); // Inherit from lost post
      formData.append('category', lostItem.category); // Inherit from lost post
      if (lostItem.itemType) formData.append('itemType', lostItem.itemType);
      if (lostItem.brand) formData.append('brand', lostItem.brand);
      if (lostItem.color) formData.append('color', lostItem.color);
      formData.append('lostItemId', lostItem.id || lostItem._id);
      formData.append('location', location);
      formData.append('date', date);
      if (details) formData.append('description', details);
      formData.append('image', imageFile);

      const res = await fetch('http://localhost:5000/api/items/quick-found', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        const errorData = await res.json();
        setError('Failed to post found item: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">I Found This Item!</h2>
              {!isSubmitting && !submitted && (
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="overflow-y-auto p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Item Reported Found!</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    A linked "Found" post has been created and the original owner has been automatically notified. They will contact you to review the match!
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                    <p className="text-sm text-blue-900 mb-2">You are reporting that you found an item matching:</p>
                    <div className="bg-white/60 p-3 rounded-lg border border-blue-200/50">
                      <p className="font-bold text-blue-900 text-lg mb-1">{lostItem.title.replace(/One\s*Plus/i, 'OnePlus')}</p>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{lostItem.category}</span>
                        {lostItem.itemType && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{lostItem.itemType}</span>}
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">We will automatically notify the owner.</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Where did you find it? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <MapPin size={18} />
                      </span>
                      <input 
                        required
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 border-2 border-gray-200 rounded-xl p-3 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                        placeholder="e.g. North Campus Library"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Found <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload an Image <span className="text-red-500">*</span>
                    </label>
                    
                    {!imagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> a photo of what you found</p>
                        </div>
                        <input required type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    ) : (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <img src={imagePreview} alt="Found Item" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <label className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-100">
                            Change Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Additional Details
                    </label>
                    <textarea 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                      rows="2"
                      placeholder="Any specific condition details..."
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-4">
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
                      disabled={isSubmitting || !location || !date || !imageFile}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={18} className="animate-spin" /> Reporting...</>
                      ) : (
                        <><Send size={18} /> Post Found Item</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
