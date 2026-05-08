"use client";

import Link from "next/link";
import { 
  Github, 
  Linkedin, 
  Globe, 
  Heart, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Cookie,
  Info,
  Wallet
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-gray-900">CoverGen</span>
            </div>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
              Bornosoft by Nayeem. Empowering students with precision tools for academic excellence. 
              The ultimate generator for DIU assignment and lab report covers.
            </p>
            <div className="flex items-center gap-4">
               <a href="https://bornosoftnr.com" target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                 <Globe className="w-5 h-5" />
               </a>
               <a href="https://github.com/kazinayeem" target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-gray-900 text-gray-400 hover:text-white transition-all">
                 <Github className="w-5 h-5" />
               </a>
               <a href="https://www.linkedin.com/in/kazi-nayeem/" target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-[#0077B5] transition-all border border-transparent hover:border-blue-100">
                 <Linkedin className="w-5 h-5" />
               </a>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Manual Tools</h4>
            <ul className="space-y-3">
               <li><Link href="/assignment" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><FileText className="w-3.5 h-3.5 opacity-50" /> Assignment</Link></li>
               <li><Link href="/lab-report" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 opacity-50" /> Lab Report</Link></li>
               <li><Link href="/lab-performance" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><Globe className="w-3.5 h-3.5 opacity-50" /> Performance</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Policies</h4>
            <ul className="space-y-3">
               <li><Link href="/privacy-policy" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><Lock className="w-3.5 h-3.5 opacity-50" /> Privacy Policy</Link></li>
               <li><Link href="/cookie-policy" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><Cookie className="w-3.5 h-3.5 opacity-50" /> Cookie Policy</Link></li>
               <li><Link href="/refund-policy" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><Wallet className="w-3.5 h-3.5 opacity-50" /> Refund Policy</Link></li>
               <li><Link href="/security-policy" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 opacity-50" /> Secure Data</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Explore</h4>
            <ul className="space-y-3">
               <li><Link href="/about" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"><Info className="w-3.5 h-3.5 opacity-50" /> About Us</Link></li>
               <li>
                 <a href="https://bornosoftnr.com" target="_blank" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors group">
                    <span>bornosoftnr.com</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </a>
               </li>
               <li className="text-xs font-medium text-gray-400">Dhaka, Bangladesh</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col lg:flex-row items-center justify-between gap-8">
          <p className="text-xs text-gray-400 font-medium">
            © {currentYear} <span className="text-gray-900 font-black tracking-tight">Bornosoft</span>. Unofficial DIU Student Project.
          </p>
          
          <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              Developed with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by <span className="text-blue-600 font-black">Mohammad Ali Nayeem</span>
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-gray-400">
             <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy</Link>
             <Link href="/cookie-policy" className="hover:text-blue-600 transition-colors">Cookies</Link>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL FORMATS</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
