"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, error, signInWithGoogle, isAuthenticated, setError } = useAuthStore();

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (!oauthError) return;
    if (oauthError === "AccessDenied") {
      setError("Only @diu.edu.bd email accounts are allowed.");
    } else {
      setError("Google sign-in failed. Please try again.");
    }
  }, [searchParams, setError]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "super-admin") {
        router.push("/admin");
      } else if (user.role === "student") {
        router.push("/student/mycourses");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  return (
    <div className="w-full max-w-[440px] space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand shadow-lg shadow-brand/20 mb-2 overflow-hidden">
          <Image src={BRAND.logoUrl} alt={BRAND.platform} width={48} height={48} className="h-10 w-10 object-contain" unoptimized />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Welcome to {BRAND.platform}</h1>
        <p className="text-muted-foreground font-medium">{BRAND.tagline}</p>
      </div>

      <Card className="p-8 rounded-3xl border-border shadow-xl bg-card space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl" role="alert">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" aria-hidden />
            <p className="text-xs text-destructive font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center mb-2">
            Authenticated Access
          </p>

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-14 bg-background border border-border hover:bg-muted text-foreground font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-brand" aria-hidden />
                <span className="text-sm text-muted-foreground">Signing in with Google…</span>
              </div>
            ) : (
              <>
                <Image src="/google.svg" alt="" width={20} height={20} aria-hidden />
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border">
          <ShieldCheck className="w-5 h-5 text-brand flex-shrink-0" aria-hidden />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Secure sign-in for verified student accounts. Your data is protected.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            By continuing, you agree to use {BRAND.platform} in accordance with our terms. {BRAND.companyTagline}
          </p>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        {BRAND.platform} · {BRAND.companyUrl.replace("https://", "")}
      </p>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
