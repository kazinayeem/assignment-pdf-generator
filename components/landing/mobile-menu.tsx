"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { MEGA_MENUS } from "./nav/nav-config";
import { NavSignInButton } from "./nav/nav-sign-in-button";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useTranslation("common");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            className="absolute left-0 top-0 h-full w-[min(320px,88vw)] bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl flex flex-col"
          >
            <div className="px-5 h-[72px] border-b border-border flex items-center justify-between shrink-0">
              <Image src="/logo_navbar.png" alt="BornoFlow" width={130} height={36} className="h-9 w-auto" />
              <button
                type="button"
                onClick={onClose}
                aria-label={t("nav.close")}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-5">
              {MEGA_MENUS.map((menu) => (
                <div key={menu.key}>
                  <Link
                    href={menu.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-foreground hover:text-brand min-h-11"
                  >
                    {t(`nav.${menu.labelKey}`)}
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
                  <div className="mt-0.5 space-y-0.5">
                    {[...menu.featured, ...menu.quickLinks].slice(0, 4).map((item) => {
                      const label = item.labelKey.includes(".") ? t(item.labelKey) : t(`nav.${item.labelKey}`);
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 min-h-11"
                        >
                          {label}
                          {item.badge === "new" && <span className="text-[9px] font-bold text-success uppercase">New</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-border shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <NavSignInButton fullWidth />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
