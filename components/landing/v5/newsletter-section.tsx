"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Mail, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, button } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

export function NewsletterSection() {
  const { t, tArray } = useTranslation("v5");
  const benefits = tArray<string>("newsletter.benefits");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSuccess(true);
    setEmail("");
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 top-0 right-0" aria-hidden />
      <div className={cn(spacing.container, "relative max-w-2xl")}>
        <SectionHeader
          badge={t("newsletter.badge")}
          title={t("newsletter.title")}
          subtitle={t("newsletter.subtitle")}
        />

        <motion.div {...animation.scaleIn} className={cn(card.base, "p-6 sm:p-8")}>
          <ul className="flex flex-wrap gap-2 mb-6 justify-center">
            {benefits.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                <Sparkles size={12} aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle size={48} className="text-success" aria-hidden />
                </motion.div>
                <p className="text-sm font-semibold text-foreground">{t("newsletter.success")}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder")}
                    required
                    aria-label={t("newsletter.placeholder")}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px] transition-colors"
                  />
                </div>
                <button type="submit" className={cn(button.primary, "shrink-0")}>
                  {t("newsletter.cta")}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
