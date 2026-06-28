"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";

const STORAGE_KEY = "campusflow-announcement-dismissed";
const BORNOSOFT_LOGO = "https://bornosoftnr.com/logo.png";

export function AnnouncementBar() {
  const { t } = useTranslation("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-50 overflow-hidden bg-brand-dark border-b border-border/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 text-sm">
            <a
              href="https://bornosoftnr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center min-h-[36px]"
              aria-label="BornoSoft"
            >
              <Image
                src={BORNOSOFT_LOGO}
                alt={t("announcement.logoAlt")}
                width={28}
                height={28}
                className="rounded-lg object-contain"
                unoptimized
              />
            </a>

            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2 text-foreground/90">
              <p className="font-medium truncate sm:whitespace-normal text-xs sm:text-sm">
                {t("announcement.text")}
              </p>
              <a
                href={`mailto:${t("announcement.email")}`}
                className="inline-flex items-center gap-1 text-brand hover:underline shrink-0 text-xs sm:text-sm font-semibold min-h-[32px]"
              >
                <Mail size={13} aria-hidden />
                {t("announcement.email")}
              </a>
              <span className="hidden sm:inline text-muted-foreground text-xs">· {t("announcement.signature")}</span>
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label={t("announcement.dismiss")}
              className="shrink-0 p-1.5 rounded-lg hover:bg-foreground/10 text-muted-foreground min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
