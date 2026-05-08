import React from "react";
import { ArrowLeft, Wallet, Info, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "CoverGen is a free service for DIU students. Read our refund policy for more details on our zero-cost academic tools.",
};

export default function RefundPolicyPage() {
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
               <Wallet className="w-4 h-4 text-white" />
             </div>
             <h1 className="font-bold text-gray-900">Refund Policy</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
          
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
               <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">100% Free Service</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              CoverGen (Bornosoft) is currently provided as a free toolkit for the DIU student community. 
              Because there are no charges for our services, no refunds are applicable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-blue-600" />
                 PDF Generation
               </h3>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Unlimited PDF generation is provided at no cost. If you encounter any technical issues with the PDF format, please report them to our support team.
               </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                 <Info className="w-5 h-5 text-blue-600" />
                 Premium Features
               </h3>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Should we introduce paid premium features in the future, a clear and comprehensive refund policy will be established at that time.
               </p>
            </div>
          </div>

          <div className="p-8 border-t border-gray-50 text-center">
             <p className="text-sm font-medium text-gray-400 italic">
               Helping DIU students excel without the financial burden.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
}
