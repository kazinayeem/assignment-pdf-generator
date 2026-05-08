import React from "react";
import { ArrowLeft, ShieldCheck, Lock, Database, Globe, Key } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Policy",
  description: "Secure data handling at CoverGen. Learn how Bornosoft protects DIU student information through encryption and secure cloud infrastructure.",
};

export default function SecurityPolicyPage() {
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
             <h1 className="font-bold text-gray-900">Security Policy</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900">Built for Trust</h2>
            <p className="text-gray-500 leading-relaxed">
              We understand that your academic data is sensitive. CoverGen (Bornosoft) is engineered with industry-standard security protocols to protect your information from the ground up.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                 <Lock className="w-6 h-6 text-blue-600" />
               </div>
               <h3 className="font-bold text-gray-900">Encryption</h3>
               <p className="text-sm text-gray-500 leading-relaxed">
                 All data transferred between your browser and our servers is encrypted using Industry-Standard TLS/SSL protocols.
               </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                 <Database className="w-6 h-6 text-emerald-600" />
               </div>
               <h3 className="font-bold text-gray-900">Cloud Security</h3>
               <p className="text-sm text-gray-500 leading-relaxed">
                 Your profile is hosted on Google Cloud infrastructure, benefiting from world-class physical and network security.
               </p>
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-gray-50">
             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Key className="w-5 h-5 text-blue-600" />
               Access Control
             </h3>
             <p className="text-gray-500 text-sm leading-relaxed">
               We implement strict Firebase Security Rules. This means only you can read or write your own profile data. Not even other students or unauthorized staff can access your information.
             </p>
          </div>

          <div className="p-8 bg-blue-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-100">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <Globe className="w-8 h-8 text-white" />
             </div>
             <div>
                <h4 className="font-bold text-lg mb-1">Continuous Monitoring</h4>
                <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                  Our team continuously monitors for potential vulnerabilities and applies security patches to keep your data safe 24/7.
                </p>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
