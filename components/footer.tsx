"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Globe,
  Heart,
  ShieldCheck,
  ExternalLink,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { LanguageSwitcherLink } from "@/components/landing/language-switcher";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { spacing, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const { t } = useTranslation("footer");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const columns = [
    {
      title: t("columns.product"),
      links: [
        { label: t("links.assignment"), href: "/assignment" },
        { label: t("links.cvBuilder"), href: "/cv-builder" },
        { label: t("links.labReport"), href: "/lab-report" },
        { label: t("links.learningTools"), href: "/tools" },
        { label: t("links.universities"), href: "/universities" },
        { label: t("links.calculators"), href: "/calculators" },
        { label: t("links.devTools"), href: "/developer-tools" },
      ],
    },
    {
      title: t("columns.learning"),
      links: [
        { label: t("links.learningTools"), href: "/tools" },
        { label: t("links.exam"), href: "/tools/exam" },
        { label: t("links.progress"), href: "/tools/learning/progress" },
        { label: t("links.interviewKb"), href: "/interview" },
      ],
    },
    {
      title: t("columns.career"),
      links: [
        { label: t("links.careerHub"), href: "/career" },
        { label: t("links.resume"), href: "/career" },
        { label: t("links.ats"), href: "/career/ats-checker" },
        { label: t("links.portfolio"), href: "/career/portfolio" },
        { label: t("links.interview"), href: "/career/interview" },
        { label: t("links.roadmaps"), href: "/career/roadmaps" },
      ],
    },
    {
      title: t("columns.resources"),
      links: [
        { label: t("links.allTools"), href: "/tools" },
        { label: t("links.about"), href: "/about" },
        { label: t("links.bornosoft"), href: "https://bornosoftnr.com", external: true },
      ],
    },
    {
      title: t("columns.legal"),
      links: [
        { label: t("links.privacy"), href: "/privacy-policy" },
        { label: t("links.cookie"), href: "/cookie-policy" },
        { label: t("links.refund"), href: "/refund-policy" },
        { label: t("links.security"), href: "/security-policy" },
      ],
    },
  ];

  return (
    <footer className="bg-brand-dark text-muted-foreground pt-16 pb-8 px-4 sm:px-6 overflow-hidden relative border-t border-border/10">
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 -top-40 right-0" aria-hidden />
      <div className="blur-orb w-[300px] h-[300px] bg-brand-accent/10 bottom-0 left-0" aria-hidden />

      <div className={cn(spacing.container, "relative")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
                <Sparkles className="w-5 h-5 text-brand-foreground" aria-hidden />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  Campus<span className="text-brand">Flow</span>
                </span>
                <p className="text-xs font-medium text-muted-foreground tracking-wide">Bornosoft</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              {t("brand.description")}
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://bornosoftnr.com", icon: Globe, label: "Website" },
                { href: "https://github.com/kazinayeem", icon: Github, label: "GitHub" },
                { href: "https://www.linkedin.com/in/kazi-nayeem/", icon: Linkedin, label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-3 bg-foreground/5 rounded-xl hover:bg-brand/20 text-muted-foreground hover:text-foreground transition-all border border-border/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t("newsletter.title")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("newsletter.subtitle")}</p>
              <form onSubmit={handleNewsletter} className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder")}
                    aria-label={t("newsletter.placeholder")}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-foreground/5 border border-border/10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-premium w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-brand-foreground text-sm font-semibold hover:shadow-lg hover:shadow-brand/25 transition cursor-pointer min-h-[44px]"
                >
                  {t("newsletter.cta")} <ArrowRight size={16} aria-hidden />
                </button>
              </form>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group min-h-[44px]"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 min-h-[44px]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground text-center lg:text-left">
            © {currentYear} CampusFlow by Bornosoft. {t("copyright")}
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground/5 rounded-2xl border border-border/10"
          >
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {t("developed")}{" "}
              <Heart className="w-3 h-3 text-destructive fill-destructive" aria-hidden /> Mohammad Ali Nayeem
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <LanguageSwitcherLink />
            <ThemeToggle scrolled className="!text-muted-foreground" />
            <span className={cn(badge.success, "text-[10px]")}>
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
              {t("status")}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono bg-foreground/5 px-2 py-1 rounded-md border border-border/10">{t("version")} 5.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
