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
  scrolled: boolean;
};

export function NavMegaMenu({ menu, lightNav, scrolled }: NavMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const isActive = pathname.startsWith(menu.href);

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
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group relative flex items-center gap-1 px-1 text-base font-medium whitespace-nowrap",
          "min-h-12 transition-colors duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 rounded-lg",
          lightNav
            ? isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            : isActive ? "text-white" : "text-white/75 hover:text-white"
        )}
      >
        {t(`nav.${menu.labelKey}`)}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200 opacity-60", open && "rotate-180")}
        />
        {(isActive || open) && (
          <motion.span
            layoutId={`nav-underline-${menu.key}`}
            className={cn(
              "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full",
              lightNav
                ? "bg-gradient-to-r from-brand via-brand-accent to-brand"
                : "bg-gradient-to-r from-white/80 via-brand-accent to-white/80"
            )}
            style={{ boxShadow: lightNav ? "0 0 12px color-mix(in srgb, var(--brand) 40%, transparent)" : undefined }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50",
              scrolled ? "w-[min(520px,calc(100vw-2rem))]" : "w-[min(520px,calc(100vw-2rem))]"
            )}
          >
            <div
              className={cn(
                "rounded-2xl border p-4 shadow-xl backdrop-blur-xl",
                lightNav
                  ? "bg-card/95 border-border shadow-black/5"
                  : "bg-brand-dark/95 border-white/10 shadow-black/30"
              )}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider px-2 mb-2", lightNav ? "text-muted-foreground" : "text-white/50")}>
                    {t("nav.mega.featured")}
                  </p>
                  {menu.featured.map((item) => (
                    <MegaLink key={item.key} item={item} lightNav={lightNav} onNavigate={close} />
                  ))}
                </div>
                <div className="space-y-1">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider px-2 mb-2", lightNav ? "text-muted-foreground" : "text-white/50")}>
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
                  "mt-3 block text-center text-xs font-semibold py-2 rounded-lg transition-colors",
                  lightNav ? "text-brand hover:bg-brand/5" : "text-brand-accent hover:bg-white/5"
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
      onClick={onNavigate}
      className={cn(
        "flex items-start gap-3 px-2 py-2 rounded-xl transition-all duration-200 group",
        lightNav ? "hover:bg-muted" : "hover:bg-white/10"
      )}
    >
      {Icon && (
        <div className={cn(
          "shrink-0 rounded-lg flex items-center justify-center",
          compact ? "w-7 h-7" : "w-9 h-9",
          lightNav ? "bg-brand/10 text-brand" : "bg-white/10 text-brand-accent"
        )}>
          <Icon size={compact ? 14 : 16} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={cn("text-sm font-semibold", lightNav ? "text-foreground group-hover:text-brand" : "text-white")}>
            {label}
          </span>
          {item.badge === "popular" && (
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-brand/15 text-brand">Popular</span>
          )}
          {item.badge === "new" && (
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-success/15 text-success">New</span>
          )}
        </div>
        {!compact && desc && (
          <p className={cn("text-xs mt-0.5 line-clamp-2", lightNav ? "text-muted-foreground" : "text-white/60")}>{desc}</p>
        )}
      </div>
    </Link>
  );
}
