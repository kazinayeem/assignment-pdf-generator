"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, ShieldCheck, FileText } from "lucide-react";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const { user, loading, error, signInWithGoogle, isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("🔍 [LOGIN-FORM] useEffect triggered:", { 
      loading,
      isAuthenticated, 
      hasUser: !!user,
      userRole: user?.role 
    });
    
    // Only redirect when loading is complete AND user is authenticated
    if (!loading && isAuthenticated && user) {
      console.log("✅ [LOGIN-FORM] Auth state ready! User:", user.email, "Role:", user.role);
      
      // Small delay to ensure routing is ready
      const timer = setTimeout(() => {
        console.log("🔍 [LOGIN-FORM] Initiating redirect...");
        try {
          if (user.role === "super-admin") {
            console.log("→ Redirecting to /admin");
            router.push("/admin");
          } else if (user.role === "student") {
            console.log("→ Redirecting to /student/mycourses");
            router.push("/student/mycourses");
          } else {
            console.warn("⚠️ Unknown user role:", user.role);
          }
        } catch (err) {
          console.error("❌ Router push failed:", err);
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
    
    if (!loading && isAuthenticated && !user) {
      console.warn("⚠️ [LOGIN-FORM] Authenticated but user doc missing!");
    }
  }, [isAuthenticated, user?.role, user?.uid, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      // Opens Google sign-in popup and resolves immediately on completion.
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="w-full max-w-[440px] space-y-8">
      {/* Logo & Intro */}
      <div className="text-center space-y-4">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-100 mb-2">
            <FileText className="w-8 h-8 text-white" />
         </div>
         <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome to CoverGen</h1>
         <p className="text-gray-400 font-medium">Your academic productivity starts here.</p>
      </div>

      <Card className="p-8 rounded-[2.5rem] border-gray-100 shadow-2xl shadow-gray-200/50 bg-white space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in shake duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700 font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center mb-2">Authenticated Access</p>
           
           <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-14 bg-white border border-gray-100 hover:bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">Signing in with Google…</span>
              </div>
            ) : (
              <>
                <Image src="/google.svg" alt="Google" width={20} height={20} className="group-hover:scale-110 transition-transform" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>

          <div className="relative py-2">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-gray-300">DIU Identity</span></div>
          </div>

          <div className="space-y-3 bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
             <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-[11px] text-blue-900 font-medium leading-relaxed">
                  Use your official <span className="font-black">@diu.edu.bd</span> email to unlock course auto-filling and teacher selection features.
                </p>
             </div>
          </div>
        </div>

        <div className="pt-4 space-y-4">
           <p className="text-[10px] text-gray-300 text-center leading-relaxed">
             By continuing, you agree to automate your academic workflow with CoverGen.
           </p>
        </div>
      </Card>
      
      <div className="text-center">
         <p className="text-xs text-gray-400">Built with ❤️ for DIU Students</p>
      </div>
    </div>
  );
}
