"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calculator,
  FileText,
  GraduationCap,
  Layout,
  MessageSquare,
  Target,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, button } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

const CAREER_TOOLS = [
  { key: "resume", href: "/career", icon: FileText, color: "from-brand to-brand-secondary" },
  { key: "ats", href: "/career/ats-checker", icon: Target, color: "from-emerald-500 to-teal-600" },
  { key: "portfolio", href: "/career/portfolio", icon: Layout, color: "from-violet-500 to-purple-600" },
  { key: "interview", href: "/career/interview", icon: MessageSquare, color: "from-sky-500 to-blue-600" },
  { key: "jobTracker", href: "/career/job-tracker", icon: Briefcase, color: "from-orange-500 to-amber-600" },
  { key: "internship", href: "/career/internship-tracker", icon: GraduationCap, color: "from-pink-500 to-rose-600" },
  { key: "salary", href: "/career/salary-calculator", icon: Calculator, color: "from-cyan-500 to-teal-600" },
] as const;

export function CareerPreview() {
  const { t } = useTranslation("home");

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className="blur-orb w-[350px] h-[350px] bg-brand-accent/10 top-20 right-10" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("career.badge")}
          title={t("career.title")}
          subtitle={t("career.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {CAREER_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.key} {...animation.fadeUp} {...animation.stagger(i)}>
                <Link href={tool.href} className="block h-full">
                  <div className={cn(card.base, card.hover, card.interactive, "p-5 sm:p-6 h-full")}>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md",
                        tool.color
                      )}
                    >
                      <Icon size={22} className="text-white" aria-hidden />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t(`career.${tool.key}`)}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/career" className={cn(button.primary, "inline-flex items-center gap-2")}>
            {t("career.cta")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
