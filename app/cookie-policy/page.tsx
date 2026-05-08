import React from "react";
import { ArrowLeft, Cookie, ShieldCheck, Zap, Info } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Transparent cookie usage at CoverGen. We use essential cookies to provide a secure academic experience for DIU students.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
               <Cookie className="w-4 h-4 text-white" />
             </div>
             <h1 className="font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
          
          <section className="space-y-4 text-center">
            <h2 className="text-3xl font-black text-gray-900">Essential Cookies Only</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              We use minimal cookies to ensure CoverGen works smoothly for you. Here is exactly what we use and why.
            </p>
          </section>

          <div className="space-y-8">
            <div className="flex gap-6 p-6 rounded-2xl bg-blue-50 border border-blue-100">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                 <Zap className="w-6 h-6 text-blue-600" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 mb-1">Authentication Cookies</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Used to keep you signed in to your student portal. These are essential for the site to function and cannot be switched off.
                  </p>
               </div>
            </div>

            <div className="flex gap-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                 <ShieldCheck className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 mb-1">Security Cookies</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Helps us prevent fraudulent activity and protect your data from unauthorized access.
                  </p>
               </div>
            </div>
          </div>

          <section className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
             <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-400" />
                <h4 className="font-bold text-gray-900">Third-Party Cookies</h4>
             </div>
             <p className="text-xs text-gray-500 leading-relaxed">
               We use Google Firebase for authentication and database services. Google may set cookies to verify your identity and manage session security. We do not use advertising or tracking cookies from third-party networks.
             </p>
          </section>

          <div className="text-center">
             <p className="text-sm text-gray-400">
               By using CoverGen, you consent to our use of these essential cookies. 
               You can manage cookie preferences through your browser settings.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
}
