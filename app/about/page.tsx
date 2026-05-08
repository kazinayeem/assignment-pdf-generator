import React from "react";
import { FileText, Heart, ShieldCheck, Zap, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission of CoverGen and Bornosoft. Built for Daffodil International University students by Mohammad Ali Nayeem.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <FileText className="w-4 h-4 text-white" />
             </div>
             <h1 className="font-bold text-gray-900">About CoverGen</h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Empowering DIU Students</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            CoverGen is a dedicated toolkit built by students, for students. 
            Our mission is to simplify the academic workflow at Daffodil International University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Precision Automation</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Stop wasting time manually typing course details. CoverGen automates your cover pages with 100% accuracy based on official university standards.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Integrity</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your academic records are safe. We use secure cloud infrastructure to ensure your profile data is available whenever you need it.
            </p>
          </div>
        </div>

        <div className="bg-blue-600 rounded-[3rem] p-10 md:p-16 text-white text-center shadow-2xl shadow-blue-200">
           <Heart className="w-12 h-12 text-red-400 fill-red-400 mx-auto mb-8" />
           <h3 className="text-3xl font-bold mb-6">Built by Mohammad Ali Nayeem</h3>
           <p className="text-blue-100 text-lg max-w-xl mx-auto leading-relaxed mb-10">
             As a fellow student, I know the struggle of formatting reports. 
             CoverGen was born out of a desire to help our community thrive through 
             technology and better design.
           </p>
           <a 
             href="https://bornosoftnr.com" 
             target="_blank"
             className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
           >
             <Globe className="w-5 h-5" />
             Visit Bornosoft
           </a>
        </div>
      </main>
    </div>
  );
}
