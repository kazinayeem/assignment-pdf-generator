"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Code2,
  FileText,
  Github,
  GraduationCap,
  MessageSquare,
  Server,
  Star,
  Users,
  FlaskConical,
  Activity,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

const STATS = [
  { key: "students", value: "2,500+", icon: Users },
  { key: "universities", value: "12+", icon: GraduationCap },
  { key: "assignments", value: "18,000+", icon: BookOpen },
  { key: "resumes", value: "4,200+", icon: Briefcase },
  { key: "labReports", value: "6,500+", icon: FlaskConical },
  { key: "interviewQuestions", value: "789", icon: MessageSquare },
  { key: "devTools", value: "100+", icon: Code2 },
  { key: "dailyActive", value: "800+", icon: Activity },
  { key: "githubStars", value: "50+", icon: Github },
  { key: "avgRating", value: "4.9★", icon: Star },
  { key: "projects", value: "18,000+", icon: FileText },
  { key: "uptime", value: "99.9%", icon: Server },
] as const;

function AnimatedStat({
  value,
  label,
  icon: Icon,
  index,
}: {
  value: string;
  label: string;
  icon: typeof Users;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.,]/g, "");
    const hasDecimal = value.includes(".");
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      const formatted = hasDecimal
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString();
      setDisplay(`${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      {...animation.fadeUp}
      {...animation.stagger(index)}
      className={cn(card.base, "p-5 sm:p-6 text-center group")}
    >
      <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
        <Icon size={20} className="text-brand" aria-hidden />
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">{display}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

export function TrustSection() {
  const { t } = useTranslation("home");

  return (
    <section className={cn(spacing.section, "relative bg-surface-page")}>
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 top-0 left-1/4" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("trust.badge")}
          title={t("trust.title")}
          subtitle={t("trust.subtitle")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <AnimatedStat
              key={stat.key}
              value={stat.value}
              label={t(`trust.${stat.key}`)}
              icon={stat.icon}
              index={i}
            />
          ))}
        </div>

        <motion.div
          {...animation.fadeIn}
          className="flex items-center justify-center gap-2 mt-10 text-muted-foreground text-sm"
        >
          <Star size={16} className="text-warning fill-warning" aria-hidden />
          <span>{t("trust.badge")}</span>
        </motion.div>
      </div>
    </section>
  );
}
