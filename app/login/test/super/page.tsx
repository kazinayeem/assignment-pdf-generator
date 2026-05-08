"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { FileText, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { user, loading, error, signInWithEmailPassword, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === "super-admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  const handleAdminLogin = async () => {
    await signInWithEmailPassword("admin@admin.com", "123456");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40 mb-1">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Access</h1>
          <p className="text-gray-500 text-sm font-medium">Restricted portal — authorized personnel only.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-950/50 border border-red-800/50 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Login card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Credentials</p>
            <div className="flex items-center gap-2 p-3 bg-gray-800/60 rounded-xl border border-gray-700/50">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-mono text-gray-400">admin@admin.com</span>
            </div>
          </div>

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign in as Admin</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-700 font-medium">
          This page is not publicly linked. Do not share this URL.
        </p>
      </div>
    </div>
  );
}
