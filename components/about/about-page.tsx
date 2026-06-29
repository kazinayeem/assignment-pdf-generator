"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { AboutHero } from "./about-hero";
import { AboutStory } from "./about-story";
import { AboutStats } from "./about-stats";
import { AboutMissionVision } from "./about-mission-vision";
import { AboutFoundersV2 } from "./about-founders-v2";
import { AboutCompanyTimeline } from "./about-company-timeline";
import { AboutValuesV2 } from "./about-values-v2";
import { AboutEcosystem } from "./about-ecosystem";
import { AboutWhy } from "./about-why";
import { AboutCommunity } from "./about-community";
import { AboutTechStack } from "./about-tech-stack";
import { AboutOpenSource } from "./about-open-source";
import { AboutContactV2 } from "./about-contact-v2";
import { AboutCta } from "./about-cta";
import { useTranslation } from "@/lib/i18n/provider";

export function AboutPageV2() {
  const { t } = useTranslation("about");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors min-h-[44px]"
          >
            <ArrowLeft size={16} aria-hidden />
            {t("back")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <AboutHero />
        <AboutStory />
        <AboutStats />
        <AboutMissionVision />
        <AboutFoundersV2 />
        <AboutCompanyTimeline />
        <AboutValuesV2 />
        <AboutEcosystem />
        <AboutWhy />
        <AboutCommunity />
        <AboutTechStack />
        <AboutOpenSource />
        <AboutContactV2 />
        <AboutCta />
      </main>
    </div>
  );
}
