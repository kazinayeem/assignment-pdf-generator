"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";

const STORAGE_KEY = "campusflow-announcement-dismissed";
const BORNOSOFT_LOGO = "https://bornosoftnr.com/logo.png";
const ROTATE_MS = 5000;

export function AnnouncementBar() {
  const { t } = useTranslation("home");
  const { tArray } = useTranslation("v5");
  const announcements = tArray<string>("announcements");
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible || announcements.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [visible, announcements.length]);

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
          className="overflow-hidden bg-brand-dark border-b border-white/10 text-white"
          role="region"
          aria-label="Announcement"
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

            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2 text-white/90">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="font-medium truncate sm:whitespace-normal text-xs sm:text-sm"
                >
                  {announcements[index] ?? t("announcement.text")}
                </motion.p>
              </AnimatePresence>
              <a
                href={`mailto:${t("announcement.email")}`}
                className="inline-flex items-center gap-1 text-brand-accent hover:underline shrink-0 text-xs sm:text-sm font-semibold min-h-[32px]"
              >
                <Mail size={13} aria-hidden />
                {t("announcement.email")}
              </a>
              <span className="hidden sm:inline text-white/50 text-xs">· {t("announcement.signature")}</span>
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label={t("announcement.dismiss")}
              className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-white/60 min-h-[32px] min-w-[32px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
