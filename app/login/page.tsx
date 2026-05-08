import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Securely sign in to CoverGen using your DIU student account. Access automated assignment and lab report generators.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Back Button */}
        <div className="w-full max-w-[440px] mb-8">
           <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span>Back to Home</span>
           </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
