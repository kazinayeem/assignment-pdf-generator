"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import type { MegaMenuConfig } from "./nav-config";

type NavMegaMenuProps = {
  menu: MegaMenuConfig;
  lightNav: boolean;
};

export function NavMegaMenu({ menu, lightNav }: NavMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const isActive = pathname === menu.href || pathname.startsWith(`${menu.href}/`);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [close]);

  useEffect(() => close(), [pathname, close]);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group relative flex items-center gap-1 h-11 px-0.5",
          "text-base font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 rounded-xl",
          lightNav
            ? isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            : isActive ? "text-white" : "text-white/80 hover:text-white"
        )}
      >
        {t(`nav.${menu.labelKey}`)}
        <ChevronDown
          size={14}
          className={cn("opacity-50 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
        {isActive && (
          <motion.span
            layoutId="nav-active-underline"
            className={cn(
              "absolute -bottom-1 left-0 right-0 h-0.5 rounded-full",
              lightNav
                ? "bg-gradient-to-r from-brand via-brand-accent to-brand"
                : "bg-gradient-to-r from-white/90 via-brand-accent to-white/90"
            )}
            style={{ boxShadow: "0 0 10px color-mix(in srgb, var(--brand) 35%, transparent)" }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        {!isActive && (
          <span
            className={cn(
              "absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full transition-all duration-200 group-hover:w-full",
              lightNav ? "bg-foreground/15" : "bg-white/25"
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full pt-2 z-50 w-[min(520px,calc(100vw-3rem))]"
          >
            <div
              className={cn(
                "rounded-xl border p-4 shadow-lg backdrop-blur-xl",
                lightNav
                  ? "bg-card/95 border-border/80 shadow-black/[0.06]"
                  : "bg-brand-dark/95 border-white/10 shadow-black/25"
              )}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <p className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-1.5 mb-1", lightNav ? "text-muted-foreground" : "text-white/45")}>
                    {t("nav.mega.featured")}
                  </p>
                  {menu.featured.map((item) => (
                    <MegaLink key={item.key} item={item} lightNav={lightNav} onNavigate={close} />
                  ))}
                </div>
                <div>
                  <p className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-1.5 mb-1", lightNav ? "text-muted-foreground" : "text-white/45")}>
                    {t("nav.mega.quickLinks")}
                  </p>
                  {menu.quickLinks.map((item) => (
                    <MegaLink key={item.key} item={item} lightNav={lightNav} compact onNavigate={close} />
                  ))}
                </div>
              </div>
              <Link
                href={menu.href}
                onClick={close}
                className={cn(
                  "mt-3 flex items-center justify-center h-9 rounded-xl text-xs font-semibold transition-colors",
                  lightNav ? "text-brand hover:bg-brand/5 border border-border/60" : "text-brand-accent hover:bg-white/5 border border-white/10"
                )}
              >
                {t("nav.mega.viewAll")} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MegaLink({
  item,
  lightNav,
  compact,
  onNavigate,
}: {
  item: MegaMenuConfig["featured"][number];
  lightNav: boolean;
  compact?: boolean;
  onNavigate: () => void;
}) {
  const { t } = useTranslation("common");
  const Icon = item.icon;
  const label = item.labelKey.includes(".") ? t(item.labelKey) : t(`nav.${item.labelKey}`);
  const desc = item.description ? t(item.description) : undefined;

  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={onNavigate}
      className={cn(
        "flex items-start gap-2.5 px-2 py-2 rounded-xl transition-colors duration-200 group",
        lightNav ? "hover:bg-muted/80" : "hover:bg-white/8"
      )}
    >
      {Icon && (
        <div
          className={cn(
            "shrink-0 rounded-lg flex items-center justify-center",
            compact ? "w-7 h-7" : "w-8 h-8",
            lightNav ? "bg-brand/10 text-brand" : "bg-white/10 text-brand-accent"
          )}
        >
          <Icon size={compact ? 13 : 15} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 flex-wrap">
          <span className={cn("text-sm font-medium leading-tight", lightNav ? "text-foreground group-hover:text-brand" : "text-white")}>
            {label}
          </span>
          {item.badge === "popular" && (
            <span className="text-[9px] font-bold uppercase px-1.5 py-px rounded-md bg-brand/12 text-brand">Popular</span>
          )}
          {item.badge === "new" && (
            <span className="text-[9px] font-bold uppercase px-1.5 py-px rounded-md bg-success/12 text-success">New</span>
          )}
        </div>
        {!compact && desc && (
          <p className={cn("text-xs mt-0.5 line-clamp-2 leading-snug", lightNav ? "text-muted-foreground" : "text-white/55")}>
            {desc}
          </p>
        )}
      </div>
    </Link>
  );
}
