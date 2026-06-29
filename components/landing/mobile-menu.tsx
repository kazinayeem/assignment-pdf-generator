"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { MEGA_MENUS, SIMPLE_NAV_LINKS, SECONDARY_NAV_LINKS } from "./nav/nav-config";
import { cn } from "@/lib/utils";

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
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="absolute left-0 top-0 h-full w-[min(340px,88vw)] bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl flex flex-col"
          >
            <div className="px-5 h-[72px] border-b border-border flex items-center justify-between shrink-0">
              <Image src="/logo_navbar.png" alt="CampusFlow" width={130} height={34} className="h-8 w-auto" />
              <button
                type="button"
                onClick={onClose}
                aria-label={t("nav.close")}
                className="p-2 rounded-xl hover:bg-muted min-h-11 min-w-11 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {MEGA_MENUS.map((menu) => (
                <div key={menu.key}>
                  <Link
                    href={menu.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 text-sm font-bold text-foreground hover:text-brand min-h-11"
                  >
                    {t(`nav.${menu.labelKey}`)}
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
                  <div className="mt-1 space-y-0.5 pl-2">
                    {menu.featured.slice(0, 2).map((item) => {
                      const label = item.labelKey.includes(".") ? t(item.labelKey) : t(`nav.${item.labelKey}`);
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted min-h-11"
                        >
                          {label}
                          {item.badge === "new" && <span className="text-[9px] font-bold text-success uppercase">New</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="border-t border-border pt-4 space-y-0.5">
                {[...SIMPLE_NAV_LINKS, ...SECONDARY_NAV_LINKS].map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={onClose}
                    className="block px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted min-h-11"
                  >
                    {t(`nav.${link.labelKey}`)}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-border shrink-0 safe-area-pb">
              <Link href="/login" onClick={onClose} className="block w-full">
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center gap-2 w-full h-11 rounded-xl",
                    "gradient-primary text-brand-foreground text-sm font-semibold",
                    "shadow-md shadow-brand/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  )}
                >
                  <LogIn size={16} /> {t("nav.signIn")}
                </button>
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
