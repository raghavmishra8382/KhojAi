import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, MapPin, Calendar, Check } from 'lucide-react';
import ClaimVerificationModal from './ClaimVerificationModal';

export default function DetailedComparisonModal({ isOpen, onClose, lostItem, foundItem }) {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  if (!lostItem || !foundItem) return null;

  // Extract reasons from matchedAttributes
  const matchReasons = foundItem.matchedAttributes
    ? foundItem.matchedAttributes
        .filter(attr => attr.match)
        .map(attr => {
          if (attr.label === 'Category') return 'Same category';
          if (attr.label === 'Location Match') return 'Nearby location';
          if (attr.label === 'Confidence Label') return 'Similar description / High AI confidence';
          return attr.label;
        })
    : [];

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Review Match Details</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comparison Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left: Lost Item */}
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full border border-red-100 mb-2">
                    Your Lost Item
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={lostItem.image} alt="Lost" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{lostItem.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {lostItem.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {lostItem.location ? lostItem.location.split(',')[0] : 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Found Item */}
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100 mb-2">
                    Found Item Match
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={foundItem.image} alt="Found" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{foundItem.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {foundItem.dateFound}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {foundItem.locationFound ? foundItem.locationFound.split(',')[0] : 'Unknown'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* AI Explanation Section */}
              <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Info className="text-blue-500" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Matched because:</h4>
                  <ul className="space-y-1.5">
                    {matchReasons.length > 0 ? matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="mt-0.5"><Check size={14} className="text-blue-500" /></span>
                        {reason}
                      </li>
                    )) : (
                      <li className="text-sm text-blue-800">High semantic textual similarity in the descriptions.</li>
                    )}
                  </ul>
                  <p className="text-xs text-blue-600 mt-3 pt-3 border-t border-blue-100/50">NO claim is created yet. Please verify carefully.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button 
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsClaimModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                <CheckCircle size={18} /> Confirm & Claim Item
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    
    <ClaimVerificationModal 
      isOpen={isClaimModalOpen}
      onClose={() => setIsClaimModalOpen(false)}
      foundItem={foundItem}
      lostItem={lostItem}
    />
    </>
  );
}
