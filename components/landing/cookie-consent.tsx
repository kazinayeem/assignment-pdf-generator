"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "campusflow-cookie-consent";

export function CookieConsent() {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (level: "all" | "necessary") => {
    localStorage.setItem(STORAGE_KEY, level);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[90] sm:left-auto sm:right-6 sm:max-w-md"
          role="dialog"
          aria-label={t("cookie.title")}
        >
          <div className="glass-card rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Cookie size={20} className="text-brand" aria-hidden />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">{t("cookie.title")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("cookie.description")}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="button" onClick={() => accept("all")} className={cn(button.primary, "flex-1 text-sm py-2.5")}>
                {t("cookie.accept")}
              </button>
              <button type="button" onClick={() => accept("necessary")} className={cn(button.secondary, "flex-1 text-sm py-2.5")}>
                {t("cookie.necessary")}
              </button>
            </div>
            <Link href="/privacy-policy" className="block text-center text-xs text-brand hover:underline mt-3 min-h-[32px]">
              {t("cookie.privacy")}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
