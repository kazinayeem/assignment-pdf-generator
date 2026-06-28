"use client";

import { motion } from "framer-motion";
import {
  Bug,
  Github,
  Lightbulb,
  Linkedin,
  Mail,
  MessageCircle,
  Users,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { SectionCta } from "./section-cta";
import { cn } from "@/lib/utils";

const LINKS = [
  { key: "discord", icon: MessageCircle, href: "https://discord.gg/campusflow", color: "from-indigo-500 to-violet-600" },
  { key: "github", icon: Github, href: "https://github.com/kazinayeem/assignment-pdf-generator", color: "from-slate-600 to-slate-800" },
  { key: "facebook", icon: Users, href: "https://facebook.com/groups/campusflow", color: "from-blue-500 to-blue-700" },
  { key: "linkedin", icon: Linkedin, href: "https://linkedin.com/company/campusflow", color: "from-sky-500 to-blue-600" },
  { key: "email", icon: Mail, href: "mailto:bornosoftnr@gmail.com", color: "from-brand to-brand-secondary" },
  { key: "featureRequests", icon: Lightbulb, href: "https://github.com/kazinayeem/assignment-pdf-generator/issues", color: "from-amber-500 to-orange-600" },
  { key: "bugReports", icon: Bug, href: "https://github.com/kazinayeem/assignment-pdf-generator/issues", color: "from-red-500 to-rose-600" },
] as const;

export function CommunitySection() {
  const { t } = useTranslation("v5");

  return (
    <section className={cn(spacing.section, "relative bg-surface-page")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("community.badge")}
          title={t("community.title")}
          subtitle={t("community.subtitle")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.key} {...animation.fadeUp} {...animation.stagger(i)}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className={cn(card.base, card.hover, "p-5 h-full text-center group")}>
                    <div
                      className={cn(
                        "w-11 h-11 mx-auto rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform",
                        link.color
                      )}
                    >
                      <Icon size={20} className="text-white" aria-hidden />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t(`community.${link.key}`)}</p>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        <SectionCta label={t("community.cta")} href="https://github.com/kazinayeem/assignment-pdf-generator" />
      </div>
    </section>
  );
}
