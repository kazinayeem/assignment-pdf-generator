"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Flame } from "lucide-react";
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
          animate={{ height: 36, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden bg-brand-dark border-b border-white/10 text-white"
          role="region"
          aria-label="Announcement"
        >
          <div className="max-w-[1280px] mx-auto px-6 h-9 flex items-center gap-3 text-xs">
            <a
              href="https://bornosoftnr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 hidden sm:flex items-center"
              aria-label="BornoSoft"
            >
              <Image
                src={BORNOSOFT_LOGO}
                alt={t("announcement.logoAlt")}
                width={20}
                height={20}
                className="rounded object-contain"
                unoptimized
              />
            </a>

            <Flame size={14} className="text-brand-accent shrink-0" aria-hidden />

            <div className="flex-1 min-w-0 flex items-center gap-2 text-white/90">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium truncate text-xs"
                >
                  {announcements[index] ?? t("announcement.text")}
                </motion.p>
              </AnimatePresence>
              <a
                href={`mailto:${t("announcement.email")}`}
                className="hidden sm:inline-flex items-center gap-1 text-brand-accent hover:underline shrink-0 font-semibold"
              >
                <Mail size={12} aria-hidden />
                {t("announcement.email")}
              </a>
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label={t("announcement.dismiss")}
              className="shrink-0 p-1 rounded-md hover:bg-white/10 text-white/60 min-h-7 min-w-7 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
