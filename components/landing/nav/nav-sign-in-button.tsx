"use client";

import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";

type NavSignInButtonProps = {
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export function NavSignInButton({ loading, className, fullWidth }: NavSignInButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Link
      href="/login"
      className={cn(fullWidth ? "block w-full" : "hidden sm:block shrink-0", className)}
    >
      <button
        type="button"
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-11 rounded-xl w-full sm:w-auto",
          "px-6 text-sm font-semibold gradient-primary text-brand-foreground",
          "shadow-sm shadow-brand/15 transition-all duration-200 cursor-pointer",
          "hover:shadow-md hover:shadow-brand/25 hover:-translate-y-px",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2",
          "active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
        )}
        style={{ padding: "0 24px" }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} aria-hidden />}
        {t("nav.signIn")}
      </button>
    </Link>
  );
}
