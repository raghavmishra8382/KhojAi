import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Code, Users, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const FooterLink = ({ to, children }) => (
    <li>
      <Link to={to} className="text-gray-500 hover:text-[#0052FF] group flex items-center transition-all duration-300 w-fit text-[14px]">
        {children}
        <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </Link>
    </li>
  );

  const FooterA = ({ href, children }) => (
    <li>
      <a href={href} className="text-gray-500 hover:text-[#0052FF] group flex items-center transition-all duration-300 w-fit text-[14px]">
        {children}
        <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </a>
    </li>
  );

  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-90"></div>
      <footer className="bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800/20 dark:to-gray-900 border-t border-slate-200 dark:border-gray-800 pt-16 pb-8 mt-auto relative overflow-hidden">
        
        {/* Subtle Background Radial Glows & Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-30 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-12 gap-y-10 mb-10">
            
            <div className="col-span-1 md:col-span-3 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3 group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-gradient-to-br from-[#00B4D8] to-blue-600 p-2 rounded-full text-white shadow-lg group-hover:shadow-[0_0_20px_rgba(0,180,216,0.6)] group-hover:rotate-12 transition-all duration-300">
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-2xl tracking-tight text-gradient">
                  KhojAI
                </span>
              </div>
              
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3 border border-blue-100">
                AI-Powered Campus Recovery Platform
              </div>

              <p className="text-gray-500 text-[14px] leading-relaxed max-w-[320px] mb-4">
                AI-powered platform helping students reconnect with lost items securely.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 font-medium">
                <a href="#" className="flex items-center gap-1.5 hover:text-[#0052FF] transition-colors group">
                  <Code size={15} className="text-gray-400 group-hover:text-[#0052FF] transition-colors" /> GitHub
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="flex items-center gap-1.5 hover:text-[#0A66C2] transition-colors group">
                  <Users size={15} className="text-gray-400 group-hover:text-[#0A66C2] transition-colors" /> LinkedIn
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="flex items-center gap-1.5 hover:text-red-500 transition-colors group">
                  <Mail size={15} className="text-gray-400 group-hover:text-red-500 transition-colors" /> Email
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="flex items-center gap-1.5 hover:text-[#00B4D8] transition-colors group">
                  <Globe size={15} className="text-gray-400 group-hover:text-[#00B4D8] transition-colors" /> Website
                </a>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-1">
              <h4 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-[12px]">Platform</h4>
              <ul className="space-y-3 text-[14px]">
                <FooterLink to="/search">Search Items</FooterLink>
                <FooterLink to="/post-lost">Report Lost</FooterLink>
                <FooterLink to="/post-found">Report Found</FooterLink>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-1">
              <h4 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-[12px]">Resources</h4>
              <ul className="space-y-3 text-[14px]">
                <FooterA href="#">How It Works</FooterA>
                <FooterA href="#">FAQ</FooterA>
                <FooterA href="#">Guidelines</FooterA>
                <FooterA href="#">AI Matching</FooterA>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-1">
              <h4 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-[12px]">Company</h4>
              <ul className="space-y-3 text-[14px]">
                <FooterA href="#">About Us</FooterA>
                <FooterA href="#">Privacy</FooterA>
                <FooterA href="#">Terms</FooterA>
                <FooterA href="#">Contact</FooterA>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 dark:text-gray-500 text-[13px] font-medium">
              &copy; {new Date().getFullYear()} KhojAI. All rights reserved.
            </p>
            
            {/* Premium System Status Pill aligned to right */}
            <div className="inline-flex items-center gap-2 bg-emerald-50/80 dark:bg-emerald-900/30 backdrop-blur-md text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[12px] font-bold border border-emerald-200 dark:border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:shadow-none cursor-help hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
