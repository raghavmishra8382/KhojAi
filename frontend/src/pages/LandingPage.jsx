import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Bell, ArrowRight, FileText, UserCheck, Package, CheckCircle2, ChevronDown, Cpu, Headphones, MapPin, SearchCheck, Zap, Users, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const AiDemoSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-indigo-100">
          <Cpu size={16} className="animate-pulse" /> Live AI Demonstration
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Real-Time AI Matching</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-[18px] leading-relaxed">Watch how our algorithm connects lost and found reports by analyzing thousands of data points instantly.</p>
      </div>

      <div className="relative bg-white dark:bg-gray-800/60 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-[3rem] p-6 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        
        {/* Subtle Background Glow inside the container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gradient-to-r from-blue-100/50 via-indigo-100/50 to-purple-100/50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 blur-[100px] -z-10"></div>
        
        {/* Lost Item Card */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-[42%] bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700 relative z-10 hover:-translate-y-2 transition-transform duration-500"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg text-[13px] border border-red-100 shadow-sm">Reported Lost</div>
            <span className="text-gray-400 text-[13px] font-medium">2 mins ago</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
              <Headphones size={28} className="text-gray-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-xl tracking-tight">OnePlus Buds Pro</h4>
              <p className="text-gray-500 text-[14px] mt-1.5 leading-relaxed">Black Case, minor scratch on left side.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[14px] text-gray-500 font-medium bg-gray-50 dark:bg-gray-900/80 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <MapPin size={16} className="text-gray-400" /> Lost near Main Library
          </div>
        </motion.div>

        {/* AI Scanner Center */}
        <div className="flex-1 w-full flex justify-center items-center relative h-24 md:h-auto z-0 py-4">
           {/* Animated connection lines */}
           <div className="hidden md:block absolute left-[-20px] right-[-20px] h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent top-1/2 -translate-y-1/2 rounded-full overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "200%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)]"
             ></motion.div>
           </div>
           
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
             className="relative z-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-[2px] rounded-[1.2rem] shadow-[0_0_50px_rgba(99,102,241,0.4)]"
           >
             <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-[1.1rem] flex flex-col items-center min-w-[140px]">
               <SearchCheck size={28} className="text-indigo-500 mb-2" />
               <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">AI Match Score</div>
               <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                 94%
               </div>
             </div>
           </motion.div>
        </div>

        {/* Found Item Card */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-[42%] bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700 relative z-10 hover:-translate-y-2 transition-transform duration-500"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="bg-green-50 text-green-600 font-bold px-3 py-1 rounded-lg text-[13px] border border-green-100 shadow-sm">Reported Found</div>
            <span className="text-gray-400 text-[13px] font-medium">Just now</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
              <Headphones size={28} className="text-gray-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-xl tracking-tight">OnePlus Earbuds</h4>
              <p className="text-gray-500 text-[14px] mt-1.5 leading-relaxed">Black Charging Case, found on bench.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[14px] text-gray-500 font-medium bg-gray-50 dark:bg-gray-900/80 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <MapPin size={16} className="text-gray-400" /> Found near Main Library
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const faqs = [
  {
    question: "How does AI matching work?",
    answer: "Our AI scans lost and found reports in real-time, comparing thousands of data points including item categories, descriptions, brand names, colors, and location proximity to instantly suggest high-probability matches."
  },
  {
    question: "Is my contact information public?",
    answer: "Absolutely not. Your contact details are kept strictly private. Communication is handled securely through our platform until both parties agree to share information for the handover."
  },
  {
    question: "Can I edit a report after posting?",
    answer: "Yes, you can edit or retract your report at any time from your Dashboard. If you find your item on your own, you can simply mark it as resolved."
  },
  {
    question: "How do I verify ownership?",
    answer: "When claiming an item, you will be asked to provide specific details not visible in the public listing (such as a serial number, lock screen wallpaper, or specific damage marks) to prove ownership to the finder."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-500 max-w-xl mx-auto text-[18px]">Everything you need to know about using KhojAI.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-indigo-200 bg-indigo-50/30 shadow-[0_10px_30px_rgba(99,102,241,0.05)]' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-200 dark:border-gray-600 hover:shadow-[0_5px_15px_rgba(0,0,0,0.03)]'}`}
          >
            <button 
              className="w-full flex items-center justify-between p-6 text-left outline-none"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <span className={`font-bold text-[17px] ${openIndex === index ? 'text-indigo-600' : 'text-gray-900 dark:text-white'}`}>
                {faq.question}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'}`}>
                <ChevronDown 
                  className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={18} strokeWidth={2.5}
                />
              </div>
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px] max-w-3xl">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] relative overflow-hidden bg-[#fafcff]">
      
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

      {/* Dynamic Glow Orbs behind Hero */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[128px] animate-[pulse_6s_infinite]"></div>
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-[128px] animate-[pulse_8s_infinite]"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>

      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Column: Text & CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left pt-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-semibold text-sm mb-6"
          >
            <Sparkles size={16} /> <span>Now powered by Khoj AI</span>
          </motion.div>
          
          <h1 className="text-[48px] lg:text-[64px] font-extrabold tracking-tight text-[#111827] leading-[1.1] mb-6 max-w-xl mx-auto lg:mx-0">
            The Smartest Way To<br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 relative inline-block">
              Recover Lost Items
              <motion.span 
                animate={{ opacity: [0.3, 0.8, 0.3] }} 
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 blur-xl mix-blend-overlay"
              ></motion.span>
            </span>
          </h1>
          
          <p className="text-[18px] text-[#4B5563] mb-8 max-w-[560px] mx-auto lg:mx-0 leading-[1.8] font-medium">
            KHOJ is the ultimate campus platform that uses advanced AI to instantly match lost and found items securely across your university network.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link 
                to="/register" 
                aria-label="Get started with KhojAI - create a free account"
                className="w-full sm:w-auto btn-primary mobile-cta hover-rise press-press flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link 
                to="/search" 
                aria-label="Search lost and found items"
                className="w-full sm:w-auto btn-ghost mobile-cta hover-rise press-press flex items-center justify-center"
              >
                Search Items
              </Link>
            </motion.div>
          </div>

          {/* Interactive Statistics Cards */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[600px] mx-auto lg:mx-0"
          >
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800/60 backdrop-blur-lg border border-white dark:border-gray-800/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><ShieldCheck size={16}/></div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">10k+</div>
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">Items Recovered</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800/60 backdrop-blur-lg border border-white dark:border-gray-800/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3 mb-1 relative z-10">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"><Sparkles size={16}/></div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">95%</div>
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2 relative z-10">Match Accuracy</div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800/60 backdrop-blur-lg border border-white dark:border-gray-800/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform"><Bell size={16}/></div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">50+</div>
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">Campuses</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column: AI Product Mockup */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="flex-1 relative w-full max-w-lg mx-auto lg:mx-0 mt-16 lg:mt-0 lg:pl-10"
        >
          
          {/* AI Monitoring Active Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -top-12 -right-4 bg-white dark:bg-gray-800/90 backdrop-blur-xl border border-cyan-100 p-3 rounded-2xl shadow-[0_15px_30px_rgba(6,182,212,0.15)] z-20 flex items-center gap-3"
          >
            <div className="relative flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full">
              <Sparkles size={16} className="text-cyan-500" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">AI Monitoring Active</div>
              <div className="text-[10px] text-gray-500">Scanning 10,000+ reports...</div>
            </div>
          </motion.div>

          {/* Decorative background behind mockup */}
          <div className="absolute inset-0 bg-gradient-brand rounded-[2.5rem] transform rotate-3 scale-105 opacity-30 blur-2xl"></div>
          
          {/* Main Mockup Card */}
          <div className="relative bg-white dark:bg-gray-800/70 backdrop-blur-3xl border border-white dark:border-gray-800 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            
            {/* Mockup Top Nav */}
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
            </div>
            
            {/* Mockup Item Cards */}
            <div className="flex flex-col gap-5">
              
              {/* Highlighted AI Match Card */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex gap-4 items-center shadow-[0_10px_25px_rgba(0,82,255,0.15)] border border-blue-100 relative transform -translate-x-2 z-10 hover:scale-105 transition-transform duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-20 -z-10"></div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#0052FF] rounded-r-md"></div>
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=200&h=200" alt="Earbuds" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="h-5 bg-gray-800 rounded-md w-32 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded-md w-24 mb-3"></div>
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-[#0F172A] dark:to-[#0B1120] text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-md border border-blue-200 shadow-sm animate-pulse">
                    <Sparkles size={12} className="text-[#00B4D8]"/> AI Match: 98%
                  </div>
                </div>
              </div>

              {/* Secondary Card */}
              <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl flex gap-4 items-center shadow-sm opacity-80 backdrop-blur-md border border-white dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600">
                   <img src="https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=200&h=200" alt="Airpods" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
                <div className="flex-grow">
                  <div className="h-4 bg-gray-400 rounded-md w-28 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-md w-20"></div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Floating Action Badge */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex items-center gap-4 border border-white dark:border-gray-800 z-20"
          >
            <div className="bg-green-100 p-3 rounded-xl shadow-inner relative">
              <div className="absolute inset-0 bg-green-400 blur-md opacity-30"></div>
              <ShieldCheck className="text-green-600 relative z-10" size={24} />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-gray-900 dark:text-white">Item Recovered</div>
              <div className="text-[12px] font-semibold text-green-600">Verified Match</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Curved Wave Separator */}
      <div className="w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgba(255,255,255,0.4)"></path>
        </svg>
      </div>

      {/* Features Section - Premium Redesign */}
      <div className="w-full bg-white dark:bg-gray-800/40 backdrop-blur-3xl pt-12 pb-24 flex flex-col items-center border-t border-white dark:border-gray-800/50 px-4 relative z-10 overflow-hidden">
        
        {/* Modern Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:30px_30px] opacity-40"></div>
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 relative z-10 shadow-sm"
        >
          <Sparkles size={16} className="text-blue-500" /> Platform Features
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[40px] md:text-[52px] font-extrabold text-[#111827] dark:text-white mb-6 tracking-tight text-center relative z-10 leading-[1.1]"
        >
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">KhojAI</span>?
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#6B7280] dark:text-gray-400 text-[18px] mb-16 text-center max-w-[650px] font-medium leading-[1.8] relative z-10"
        >
          We've engineered a next-generation platform designed specifically for campus communities, utilizing artificial intelligence to reunite students with their belongings instantly.
        </motion.p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-[1200px] w-full items-stretch relative z-10"
        >
          {/* Card 1: AI (Wide - 60%) */}
          <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col items-start p-8 md:p-10 rounded-[2rem] bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/50 shadow-sm hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800/50 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors duration-500 shadow-inner">
              <Sparkles className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" size={28} />
            </div>
            
            <h3 className="text-[24px] font-extrabold text-gray-900 dark:text-white mb-3">AI-Powered Semantic Matching</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.7] text-[16px] font-medium max-w-2xl">
              Smart algorithms instantly cross-reference lost items with found inventory using natural language processing. It understands context—so a "black wallet" matches a "dark leather billfold."
            </p>
          </motion.div>

          {/* Card 2: Security (Narrow - 40%) */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col items-start p-8 rounded-[2rem] bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-800/50 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors duration-500 shadow-inner">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" size={28} />
            </div>
            
            <h3 className="text-[22px] font-extrabold text-gray-900 dark:text-white mb-3">Secure & Verified</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.7] text-[15px] font-medium">
              Strictly authenticated network. Only verified university students and faculty can access the community platform.
            </p>
          </motion.div>

          {/* Card 3: Lightning Fast (Narrow - 40%) */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col items-start p-8 rounded-[2rem] bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-500/50 shadow-sm hover:shadow-[0_20px_60px_rgba(245,158,11,0.12)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-6 border border-amber-100 dark:border-amber-800/50 group-hover:bg-amber-500 group-hover:border-amber-400 transition-colors duration-500 shadow-inner">
              <Zap className="text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" size={28} />
            </div>
            
            <h3 className="text-[22px] font-extrabold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.7] text-[15px] font-medium">
              Report an item in under 30 seconds. Our streamlined interface guarantees zero friction during high-stress situations.
            </p>
          </motion.div>

          {/* Card 4: Real-time Alerts (Wide - 60%) */}
          <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col items-start p-8 md:p-10 rounded-[2rem] bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-sm hover:shadow-[0_20px_60px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6 border border-purple-100 dark:border-purple-800/50 group-hover:bg-purple-500 group-hover:border-purple-400 transition-colors duration-500 shadow-inner">
              <Bell className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" size={28} />
            </div>
            
            <h3 className="text-[24px] font-extrabold text-gray-900 dark:text-white mb-3">Real-time Smart Alerts</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.7] text-[16px] font-medium max-w-2xl">
              Don't constantly refresh the page. Set up a background monitor and get instantly notified via email or push notification the exact moment a matching item is reported found.
            </p>
          </motion.div>

          {/* Card 5: Community Driven (Half - 50%) */}
          <motion.div variants={itemVariants} className="md:col-span-3 flex flex-col items-start p-8 rounded-[2rem] bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-500/50 shadow-sm hover:shadow-[0_20px_60px_rgba(6,182,212,0.12)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent dark:from-cyan-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center mb-6 border border-cyan-100 dark:border-cyan-800/50 group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-colors duration-500 shadow-inner">
              <Users className="text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors" size={28} />
            </div>
            
            <h3 className="text-[22px] font-extrabold text-gray-900 dark:text-white mb-3">Community Driven</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.7] text-[15px] font-medium">
              Built on the power of crowd-sourcing. Connect directly with honest finders on campus without any middlemen.
            </p>
          </motion.div>

          {/* Card 6: Mobile Optimized (Half - 50%) */}
          <motion.div variants={itemVariants} className="md:col-span-3 flex flex-col items-start p-8 rounded-[2rem] bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-500/50 shadow-sm hover:shadow-[0_20px_60px_rgba(244,63,94,0.12)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-6 border border-rose-100 dark:border-rose-800/50 group-hover:bg-rose-500 group-hover:border-rose-400 transition-colors duration-500 shadow-inner">
              <Smartphone className="text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" size={28} />
            </div>
            
            <h3 className="text-[22px] font-extrabold text-gray-900 dark:text-white mb-3">Mobile Optimized</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.7] text-[15px] font-medium">
              Seamlessly works on any device. Snap a photo of a found item and upload it straight from your phone camera.
            </p>
          </motion.div>

        </motion.div>
      </div>

      {/* How KhojAI Works Section */}
      <div className="w-full bg-white dark:bg-gray-800 pt-24 pb-32 flex flex-col items-center px-4 relative z-10 overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-[36px] font-extrabold text-[#111827] mb-20 tracking-tight text-center relative z-10"
        >
          How It Works
        </motion.h2>
        
        <div className="max-w-6xl w-full relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-green-100 rounded-full z-0">
            {/* Animated dot moving along the line */}
            <motion.div 
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 shadow-[0_0_10px_rgba(0,82,255,0.5)] rounded-full border-2 border-[#0052FF]"
            ></motion.div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-[4px] border-blue-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-[0_10px_30px_rgba(0,82,255,0.15)] transition-all duration-300 relative z-10">
                <FileText className="text-blue-500 group-hover:text-blue-600 transition-colors" size={36} strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-gray-800">1</div>
              </div>
              <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white mb-2">Report Item</h3>
              <p className="text-gray-500 text-[15px] font-medium max-w-[220px] leading-relaxed">Quickly log the lost or found item with details and images.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-[4px] border-indigo-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-indigo-200 group-hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition-all duration-300 relative z-10">
                <Sparkles className="text-indigo-500 group-hover:text-indigo-600 transition-colors" size={36} strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-gray-800">2</div>
              </div>
              <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white mb-2">AI Finds Matches</h3>
              <p className="text-gray-500 text-[15px] font-medium max-w-[220px] leading-relaxed">Our algorithm instantly scans the database for high-probability matches.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-[4px] border-purple-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-200 group-hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] transition-all duration-300 relative z-10">
                <UserCheck className="text-purple-500 group-hover:text-purple-600 transition-colors" size={36} strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-gray-800">3</div>
              </div>
              <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white mb-2">Verify Ownership</h3>
              <p className="text-gray-500 text-[15px] font-medium max-w-[220px] leading-relaxed">Securely connect with the finder or loser to confirm details.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-[4px] border-green-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-green-200 group-hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)] transition-all duration-300 relative z-10">
                <Package className="text-green-500 group-hover:text-green-600 transition-colors" size={36} strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-gray-800">4</div>
              </div>
              <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white mb-2">Recover Item</h3>
              <p className="text-gray-500 text-[15px] font-medium max-w-[220px] leading-relaxed">Meet safely on campus and retrieve your belongings.</p>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Real AI Matching Demo Section */}
      <AiDemoSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full py-24 flex flex-col items-center px-4 relative z-10"
      >
        {/* Background Glow Orbs Behind CTA */}
        <div className="absolute top-1/4 left-[15%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-[15%] w-[400px] h-[400px] bg-cyan-300/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="relative w-full max-w-5xl rounded-[3rem] p-[2px] shadow-[0_40px_80px_rgba(0,82,255,0.15)] hover:shadow-[0_40px_100px_rgba(0,82,255,0.25)] transition-shadow duration-700 overflow-hidden group">
          {/* Animated Border Gradient Overlay */}
          <motion.div 
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            style={{ backgroundSize: "200% auto" }}
          ></motion.div>
          
          <div className="bg-white dark:bg-gray-800/70 backdrop-blur-lg rounded-[2.9rem] p-16 md:p-24 text-center relative overflow-hidden z-10 border border-white dark:border-gray-800">
            {/* Bright background base for consistency */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/50 to-cyan-50/80 dark:from-[#0F172A] dark:via-[#111827] dark:to-[#0B1120] z-0"></div>

            {/* Subtle Grid Pattern inside CTA */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-60 z-0"></div>

            {/* Floating Background Icons */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-8 text-blue-500/25 z-0 hidden md:block"
            >
              <Sparkles size={64} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-8 right-8 text-cyan-500/25 z-0 hidden md:block"
            >
              <ShieldCheck size={72} />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center">
              
              <div className="inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-600 text-[12px] font-extrabold px-4 py-1.5 rounded-full mb-6 border border-blue-100/50 shadow-sm backdrop-blur-md">
                <span className="text-[14px]">⚡</span> AI-Powered Lost & Found Platform
              </div>

              <h2 className="text-[40px] md:text-[56px] font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                Ready to <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500"
                  style={{ backgroundSize: "200% auto" }}
                >
                  get started?
                </motion.span>
              </h2>
              
              <p className="text-gray-500 text-[18px] md:text-[20px] mb-12 max-w-2xl mx-auto font-medium leading-[1.8]">
                Report, match, and recover lost items in minutes.
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block relative">
                {/* Button Glow Aura */}
                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 rounded-full group-hover:opacity-60 group-hover:blur-2xl transition-all duration-500"></div>
                
                <Link 
                  to="/register" 
                  className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-5 rounded-full font-extrabold shadow-[0_10px_20px_rgba(0,82,255,0.2)] text-[18px] cursor-pointer hover:shadow-xl transition-all duration-300 group/btn border border-blue-400 overflow-hidden"
                >
                  <span className="relative z-10">Create Free Account</span>
                  <div className="bg-white dark:bg-gray-800/20 p-2 rounded-full relative z-10 group-hover/btn:bg-white dark:bg-gray-800 group-hover/btn:text-blue-600 transition-colors duration-300">
                    <ArrowRight size={20} className="text-white group-hover/btn:text-blue-600 group-hover/btn:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </motion.div>

              <div className="mt-10 flex items-center justify-center gap-5 text-[13.5px] font-bold text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Free to use</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Secure & Verified</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> AI-Powered Matching</span>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
