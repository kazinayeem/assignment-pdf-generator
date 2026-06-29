"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, Target, Rocket, Sparkles, Mail, ExternalLink, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { StaticPageShell } from "./static-page-shell";
import { BuiltBySection } from "@/components/brand/built-by";
import { BRAND, SUB_PRODUCTS } from "@/lib/brand";
import { card } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function AboutPageContent() {
  const { t } = useTranslation("about");
  const { tArray } = useTranslation("about");
  const highlights = tArray<string>("highlights.items");

  const productI18nKey: Record<string, string> = {
    maps: "bornoMaps",
    ai: "bornoAi",
    career: "bornoCareer",
    uni: "bornoUni",
    dev: "bornoDev",
  };

  return (
    <StaticPageShell title={t("title")} backLabel={t("back")} icon={FileText}>
      <div className="flex flex-col items-center text-center mb-12">
        <Image
          src={BRAND.logoUrl}
          alt={BRAND.company}
          width={56}
          height={56}
          className="h-14 w-14 rounded-2xl object-contain mb-4"
          unoptimized
        />
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">{BRAND.platform}</h2>
        <p className="text-sm text-muted-foreground">{BRAND.companyTagline}</p>
      </div>

      <section className="mb-10">
        <h3 className="text-xl font-bold text-foreground mb-3">{t("bornoFlow.title")}</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">{t("bornoFlow.body")}</p>
        <p className="text-muted-foreground leading-relaxed">{t("bornoFlow.mission")}</p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-bold text-foreground mb-3">{t("bornosoft.title")}</h3>
        <p className="text-muted-foreground leading-relaxed">{t("bornosoft.body")}</p>
      </section>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className={cn(card.base, "p-6")}>
          <Target className="text-brand mb-3" size={22} />
          <h3 className="text-lg font-bold text-foreground mb-2">{t("vision.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("vision.body")}</p>
        </div>
        <div className={cn(card.base, "p-6")}>
          <Rocket className="text-brand mb-3" size={22} />
          <h3 className="text-lg font-bold text-foreground mb-2">{t("mission.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("mission.body")}</p>
        </div>
      </div>

      <section className="mb-10">
        <h3 className="text-xl font-bold text-foreground mb-4">{t("highlights.title")}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm text-foreground">
              <CheckCircle2 size={14} className="text-success shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="mb-10">
        <h3 className="text-xl font-bold text-foreground mb-4">{t("products.title")}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUB_PRODUCTS.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className={cn(card.base, card.hover, "p-5 block")}
            >
              <span className="text-2xl mb-2 block">{p.emoji}</span>
              <p className="font-bold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t(`products.${productI18nKey[p.id]}`)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <BuiltBySection variant="about" />
      </section>

      <section className={cn(card.base, "p-6 sm:p-8")}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-brand" />
          <h3 className="text-lg font-bold text-foreground">{t("contact.title")}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t("contact.subtitle")}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`mailto:${t("contact.email")}`} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand/30 hover:bg-brand/5 transition-colors min-h-[44px]">
            <Mail size={18} className="text-brand shrink-0" />
            <span className="text-sm font-medium text-foreground">{t("contact.email")}</span>
          </a>
          <a href={`https://${t("contact.website")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand/30 hover:bg-brand/5 transition-colors min-h-[44px]">
            <ExternalLink size={18} className="text-brand shrink-0" />
            <span className="text-sm font-medium text-foreground">{t("contact.website")}</span>
          </a>
        </div>
      </section>
    </StaticPageShell>
  );
}
