"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, Facebook, ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { LanguageSwitcherLink } from "@/components/landing/language-switcher";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { BuiltBySection } from "@/components/brand/built-by";
import { BRAND, FOUNDERS } from "@/lib/brand";
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
  { key: "documentation", href: "/about" },
  { key: "roadmaps", href: "/roadmaps" },
  { key: "learningResources", href: "/tools" },
  { key: "interviewQuestions", href: "/interview" },
  { key: "developerTools", href: "/developer-tools" },
  { key: "universityExplorer", href: "/universities" },
  { key: "blog", href: "/about" },
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
    <footer className="bg-[#0B1120] text-slate-400 border-t border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src={BRAND.logoUrl}
                alt={BRAND.company}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain bg-white/5 p-1"
                unoptimized
              />
              <div>
                <span className="block text-xl font-bold text-white tracking-tight group-hover:text-brand-accent transition-colors">
                  {BRAND.platform}
                </span>
                <span className="block text-[11px] text-slate-500">{t("brand.companyLine")}</span>
              </div>
            </Link>
            <p className="text-sm font-medium text-slate-300 leading-snug">{t("brand.tagline")}</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">{t("brand.description")}</p>
            <a
              href={BRAND.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-accent hover:underline inline-flex items-center gap-1"
            >
              {BRAND.companyUrl.replace("https://", "")}
              <ExternalLink size={10} aria-hidden />
            </a>
            <BuiltBySection variant="footer" />
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">{t("columns.product")}</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-200 min-h-[36px] flex items-center">
                    {t(`products.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">{t("columns.resources")}</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-200 min-h-[36px] flex items-center">
                    {t(`resources.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">{t("columns.company")}</h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-200 min-h-[36px] flex items-center">
                    {t(`company.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">{t("columns.connect")}</h4>
            <ul className="space-y-2 mb-4">
              {connectLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2 min-h-[36px] group"
                  >
                    <link.icon size={14} className="opacity-60 group-hover:opacity-100" />
                    {t(`connect.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">{t("connect.founders")}</p>
            <ul className="space-y-1.5">
              {FOUNDERS.map((founder) => (
                <li key={founder.id}>
                  <a
                    href={founder.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-1.5 min-h-[32px]"
                  >
                    <ExternalLink size={11} className="opacity-50" aria-hidden />
                    {founder.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center lg:text-left leading-relaxed">
            © {BRAND.copyrightYear} {BRAND.platform}. {t("brand.companyLine")}.<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            {t("builtBy")} ❤️ {BRAND.authors}. {t("copyright")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LanguageSwitcherLink className="!text-slate-500 hover:!text-white" />
            <ThemeToggle scrolled className="!border-white/10 !bg-white/5 !text-slate-400 hover:!text-white" />
            <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/20")}>
              <ShieldCheck size={12} aria-hidden />
              {t("status")}
            </span>
            <span className="text-[10px] text-slate-600 font-mono">{t("version")} 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
