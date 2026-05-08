import React from "react";
import { ShieldCheck, ArrowLeft, Eye, Lock, Cloud } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Your privacy matters at CoverGen. Learn how Bornosoft protects DIU student data and academic records.",
};

export default function PrivacyPolicyPage() {
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
               <ShieldCheck className="w-4 h-4 text-white" />
             </div>
             <h1 className="font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
          
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
               Effective May 2026
            </div>
            <h2 className="text-3xl font-black text-gray-900">How we protect your data</h2>
            <p className="text-gray-500 leading-relaxed">
              At CoverGen (Bornosoft), we prioritize your privacy. This policy explains how we collect, use, and protect your information when you use our student portal.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                 <Eye className="w-5 h-5 text-indigo-600" />
               </div>
               <h3 className="font-bold text-gray-900 text-lg">Data Collection</h3>
               <p className="text-sm text-gray-500 leading-relaxed">
                 We collect your Name, Student ID, Department, and academic details purely to automate your PDF generation. This data is never sold or shared.
               </p>
            </div>
            <div className="space-y-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                 <Lock className="w-5 h-5 text-emerald-600" />
               </div>
               <h3 className="font-bold text-gray-900 text-lg">Secure Storage</h3>
               <p className="text-sm text-gray-500 leading-relaxed">
                 Your profile information is stored securely using Firebase Firestore with strict access controls and encryption at rest.
               </p>
            </div>
          </div>

          <section className="space-y-6 pt-12 border-t border-gray-50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              Cloud Infrastructure
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              CoverGen utilizes Google Cloud and Vercel infrastructure to provide high availability and regional data compliance. We do not track your personal browsing history or off-site activities.
            </p>
          </section>

          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
             <h4 className="font-bold text-gray-900 mb-2">Your Rights</h4>
             <p className="text-xs text-gray-500 leading-relaxed">
               You have the right to access, update, or delete your data at any time through your Profile page. For permanent data deletion requests, please contact us at nayeem@bornosoftnr.com.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
}
