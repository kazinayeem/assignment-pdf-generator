"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, Facebook, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { LanguageSwitcherLink } from "@/components/landing/language-switcher";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PRODUCT_LINKS = [
  { key: "bornoMaps", href: "/roadmaps" },
  { key: "bornoAi", href: "/tools" },
  { key: "bornoCareer", href: "/career" },
  { key: "bornoUni", href: "/universities" },
  { key: "bornoDev", href: "/developer-tools" },
  { key: "resumeBuilder", href: "/cv-builder" },
  { key: "assignmentStudio", href: "/assignment" },
  { key: "labReport", href: "/lab-report" },
  { key: "interviewHub", href: "/interview" },
  { key: "learningHub", href: "/tools" },
] as const;

const RESOURCE_LINKS = [
  { key: "documentation", href: "/changelog" },
  { key: "roadmaps", href: "/roadmaps" },
  { key: "learningResources", href: "/tools" },
  { key: "interviewQuestions", href: "/interview" },
  { key: "developerTools", href: "/developer-tools" },
  { key: "universityExplorer", href: "/universities" },
  { key: "blog", href: "/changelog" },
  { key: "changelog", href: "/changelog" },
] as const;

const COMPANY_LINKS = [
  { key: "about", href: "/about" },
  { key: "team", href: "/about#team" },
  { key: "products", href: "/about#products" },
  { key: "careers", href: `mailto:${BRAND.email}` },
  { key: "contact", href: `mailto:${BRAND.email}` },
  { key: "privacy", href: "/privacy-policy" },
  { key: "terms", href: "/cookie-policy" },
  { key: "support", href: `mailto:${BRAND.email}` },
] as const;

export default function Footer() {
  const { t } = useTranslation("footer");

  const connectLinks = [
    { key: "website", href: BRAND.companyUrl, icon: Globe, external: true },
    { key: "github", href: BRAND.github, icon: Github, external: true },
    { key: "linkedin", href: BRAND.linkedin, icon: Linkedin, external: true },
    { key: "facebook", href: BRAND.facebook, icon: Facebook, external: true },
    { key: "email", href: `mailto:${BRAND.email}`, icon: Mail, external: true },
  ] as const;

  return (
    <footer className="bg-muted/40 dark:bg-[#0B1120] text-muted-foreground border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex flex-col gap-4 group max-w-xs">
              <Image
                src={BRAND.logoUrl}
                alt={BRAND.company}
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-contain bg-background/80 dark:bg-white/5 p-1 border border-border/60"
                unoptimized
              />
              <div className="space-y-1">
                <span className="block text-xl font-bold text-foreground tracking-tight group-hover:text-brand transition-colors">
                  {BRAND.platform}
                </span>
                <span className="block text-sm text-muted-foreground">{t("brand.companyLine")}</span>
                <a
                  href={BRAND.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-brand hover:underline pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {BRAND.companyUrl.replace("https://", "")}
                </a>
              </div>
            </Link>
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("columns.product")}</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[36px] flex items-center">
                    {t(`products.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("columns.resources")}</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[36px] flex items-center">
                    {t(`resources.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("columns.company")}</h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[36px] flex items-center">
                    {t(`company.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("columns.connect")}</h4>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 min-h-[36px] group"
                  >
                    <link.icon size={14} className="opacity-60 group-hover:opacity-100" />
                    {t(`connect.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center lg:text-left">
            © {BRAND.copyrightYear} {BRAND.platform}. {t("brand.companyLine")}. {t("copyright")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LanguageSwitcherLink className="!text-muted-foreground hover:!text-foreground" />
            <ThemeToggle scrolled className="!border-border !bg-background/80 !text-muted-foreground hover:!text-foreground dark:!border-white/10 dark:!bg-white/5" />
            <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/20")}>
              <ShieldCheck size={12} aria-hidden />
              {t("status")}
            </span>
            <span className="text-[10px] text-muted-foreground/70 font-mono">{t("version")} 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
