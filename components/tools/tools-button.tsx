"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ToolsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
  href?: string;
  children: ReactNode;
};

const variants = {
  primary:
    "bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] text-white shadow-lg shadow-[#6D5DF6]/25 hover:shadow-xl hover:shadow-[#6D5DF6]/30 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-[#E5E7EB] dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/15",
  ghost:
    "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10",
  outline:
    "border-2 border-[#6D5DF6]/30 text-[#6D5DF6] hover:bg-[#6D5DF6]/5 dark:border-[#6D5DF6]/40",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl min-h-[44px]",
  md: "px-6 py-3 text-base rounded-2xl min-h-[44px]",
  lg: "px-8 py-4 text-base rounded-2xl min-h-[48px]",
};

export function ToolsButton({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  href,
  ...props
}: ToolsButtonProps) {
  const classes = cn(
    "btn-premium inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6] focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
