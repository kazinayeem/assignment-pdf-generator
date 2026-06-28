"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Heart, Eye, Sparkles, GraduationCap, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getUniversity, recommendUniversities } from "@/lib/universities";
import { getFavorites, getRecentlyViewed } from "@/lib/universities/storage";
import { card, animation, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityHubDashboard() {
  const { t } = useTranslation("universities");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentlyViewed());
    setFavorites(getFavorites());
  }, []);

  const recommended = recommendUniversities({
    sscGpa: 4.5,
    hscGpa: 4.0,
    preferredSubject: "CSE",
    budget: 2000000,
    division: "any",
    careerGoal: "Software Engineer",
    preferredCampus: "any",
  }, 4);

  const widgets = [
    {
      key: "recent",
      icon: Eye,
      title: t("dashboard.recent"),
      items: recent.map((s) => getUniversity(s)).filter(Boolean),
      href: "/universities",
    },
    {
      key: "saved",
      icon: Heart,
      title: t("dashboard.saved"),
      items: favorites.map((s) => getUniversity(s)).filter(Boolean),
      href: "/universities/compare",
    },
    {
      key: "recommended",
      icon: Sparkles,
      title: t("dashboard.recommended"),
      items: recommended,
      href: "/universities/recommend",
    },
    {
      key: "trending",
      icon: TrendingUp,
      title: t("dashboard.trending"),
      items: recommended.slice(0, 3),
      href: "/universities",
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w, i) => (
          <motion.div key={w.key} {...animation.fadeUp} {...animation.stagger(i)} className={cn(card.base, "p-4")}>
            <div className="flex items-center gap-2 mb-3">
              <w.icon size={16} className="text-brand" aria-hidden />
              <h3 className="text-sm font-bold text-foreground">{w.title}</h3>
            </div>
            {w.items.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("dashboard.empty")}</p>
            ) : (
              <ul className="space-y-2 mb-3">
                {w.items.slice(0, 3).map((u) => u && (
                  <li key={u.slug}>
                    <Link href={`/universities/${u.slug}`} className="text-xs font-medium text-muted-foreground hover:text-brand truncate block">
                      {u.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href={w.href} className="text-xs font-semibold text-brand hover:underline">
              {t("dashboard.viewAll")} →
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div {...animation.fadeUp} className={cn(card.base, "mt-4 p-4 flex flex-wrap items-center gap-4")}>
        <Clock size={18} className="text-brand" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{t("dashboard.deadlines")}</p>
          <p className="text-xs text-muted-foreground">{t("dashboard.deadlinesHint")}</p>
        </div>
        <Link href="/universities/predictor" className={cn(badge.brand, "text-xs")}>
          <GraduationCap size={12} /> {t("nav.predictor")}
        </Link>
      </motion.div>
    </section>
  );
}
