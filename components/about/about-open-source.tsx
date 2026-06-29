"use client";

import Link from "next/link";
import { BookOpen, FileText, Github, Heart, Users } from "lucide-react";
import { GITHUB_REPO } from "@/lib/about/constants";
import { BRAND } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

const OSS_ITEMS = [
  { key: "github", icon: Github, href: GITHUB_REPO, external: true },
  { key: "contribute", icon: Heart, href: `${GITHUB_REPO}#contributing`, external: true },
  { key: "docs", icon: BookOpen, href: "/changelog", external: false },
  { key: "license", icon: FileText, href: `${GITHUB_REPO}/blob/main/LICENSE`, external: true },
  { key: "community", icon: Users, href: `mailto:${BRAND.email}`, external: true },
] as const;

export function AboutOpenSource() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal className="mb-14">
          <SectionLabel>{t("openSource.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("openSource.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("openSource.subtitle")}</p>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OSS_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const className = cn(
              "group flex flex-col items-center p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur",
              "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-1 transition-all duration-300"
            );
            const inner = (
              <>
                <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="font-bold text-foreground text-sm">{t(`openSource.items.${item.key}.title`)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t(`openSource.items.${item.key}.desc`)}</p>
              </>
            );

            return (
              <SectionReveal key={item.key} delay={i * 0.06}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className={className}>
                    {inner}
                  </Link>
                )}
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
