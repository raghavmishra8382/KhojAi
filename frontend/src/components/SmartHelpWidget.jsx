import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, Sparkles, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SmartHelpWidget() {
  const { state, setIsHelpWidgetOpen, isHelpWidgetOpen } = useAppContext();
  const [mode, setMode] = useState('chat'); // 'chat' or 'ticket'
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! I am your KhojAI Assistant. How can I help you today?' }
  ]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketError, setTicketError] = useState('');
  
  const messagesEndRef = useRef(null);

  const faqs = [
    {
      q: 'How does AI matching work?',
      a: 'Our AI scans images and text descriptions from reported lost and found items. It cross-references categories, colors, and keywords to generate a match percentage.'
    },
    {
      q: 'How do I contact an owner?',
      a: 'If you find a high-probability match, click "Claim Item" or "Contact Owner". The owner will be notified securely, and if they approve, you will receive their contact details.'
    },
    {
      q: 'What if someone stole my item?',
      a: 'If you suspect theft, please submit a direct support ticket below so our moderation team can freeze the item listing immediately.'
    }
  ];

  const handleFaqClick = (faq) => {
    setMessages(prev => [...prev, { type: 'user', text: faq.q }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: faq.a }]);
    }, 600);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    setTicketError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ subject: ticketSubject, message: ticketMessage })
      });

      if (res.ok) {
        setTicketSuccess(true);
        setTimeout(() => {
          setIsHelpWidgetOpen(false);
          // reset state after closing
          setTimeout(() => {
            setMode('chat');
            setTicketSuccess(false);
            setTicketSubject('');
            setTicketMessage('');
          }, 300);
        }, 2500);
      } else {
        const data = await res.json();
        setTicketError(data.message || 'Failed to submit ticket');
      }
    } catch (err) {
      setTicketError('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isHelpWidgetOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[380px] h-[100dvh] sm:h-[600px] max-h-[100dvh] sm:max-h-[85vh] z-[100] flex flex-col shadow-2xl sm:rounded-3xl rounded-none overflow-hidden glass-card dark:glass-card sm:border border-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white flex justify-between items-center shadow-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            {mode === 'ticket' ? (
              <button onClick={() => setMode('chat')} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={20} className="text-white" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-[16px] leading-tight">{mode === 'chat' ? 'KhojAI Assistant' : 'Human Support'}</h3>
              <p className="text-[12px] text-blue-100 font-medium">
                {mode === 'chat' ? 'Instant AI Help' : 'Submit a Ticket'}
              </p>
            </div>
          </div>
          <button onClick={() => setIsHelpWidgetOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0B1120] p-4 flex flex-col relative scrollbar-hide">
          {mode === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-[14.5px] shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="shrink-0 space-y-2 mb-4">
                <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">Quick Questions</p>
                <div className="flex flex-wrap gap-2">
                  {faqs.map((faq, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleFaqClick(faq)}
                      className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left shadow-sm"
                    >
                      {faq.q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Switch to Ticket */}
              <div className="shrink-0 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => setMode('ticket')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-xl font-bold transition-all shadow-sm border border-gray-800 dark:border-gray-600"
                >
                  <MessageSquare size={16} /> Contact Human Support
                </button>
              </div>
            </>
          ) : (
            /* Ticket Form Mode */
            <div className="flex flex-col h-full justify-center">
              {ticketSuccess ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 dark:bg-emerald-900/30 text-green-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ticket Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-[15px]">Our moderation team will review this shortly.</p>
                </motion.div>
              ) : (
                <motion.form onSubmit={submitTicket} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 mb-5">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-1 flex items-center gap-2">
                      <ShieldAlert size={16} /> Submit Support Request
                    </h4>
                    <p className="text-[13px] text-blue-600 dark:text-blue-400/80">Use this to report bugs, request account help, or report stolen items.</p>
                  </div>

                  {ticketError && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-4 border border-red-100">
                      {ticketError}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <input 
                      type="text" required
                      value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g., Found a bug"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#1E293B] dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none text-[15px]"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Detailed Message</label>
                    <textarea 
                      required
                      value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Please explain your issue in detail..."
                      className="w-full min-h-[140px] px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#1E293B] dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none resize-none text-[15px]"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Ticket'} <Send size={16} />
                  </button>
                </motion.form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
