import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/login-form";
import { Metadata } from "next";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Login",
  description: `Securely sign in to ${BRAND.platform}. Access learning tools, career resources, and student features.`,
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden>
         <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full max-w-[440px] mb-8">
           <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
             <span>Back to Home</span>
           </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
