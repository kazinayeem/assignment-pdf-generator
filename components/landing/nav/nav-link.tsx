"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";

type NavLinkProps = {
  href: string;
  labelKey: string;
  lightNav: boolean;
  className?: string;
};

export function NavLink({ href, labelKey, lightNav, className }: NavLinkProps) {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center px-1 text-base font-medium whitespace-nowrap",
        "min-h-12 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 rounded-lg",
        lightNav
          ? isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          : isActive ? "text-white" : "text-white/75 hover:text-white",
        className
      )}
    >
      {t(`nav.${labelKey}`)}
      {isActive && (
        <motion.span
          layoutId={`nav-underline-${href}`}
          className={cn(
            "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full",
            lightNav
              ? "bg-gradient-to-r from-brand via-brand-accent to-brand"
              : "bg-gradient-to-r from-white/80 via-brand-accent to-white/80"
          )}
          style={{ boxShadow: lightNav ? "0 0 12px color-mix(in srgb, var(--brand) 40%, transparent)" : undefined }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {!isActive && (
        <span
          className={cn(
            "absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full transition-all duration-200 group-hover:w-full",
            lightNav ? "bg-foreground/20" : "bg-white/30"
          )}
        />
      )}
    </Link>
  );
}
