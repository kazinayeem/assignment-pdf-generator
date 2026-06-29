"use client";

import Link from "next/link";
import { ArrowDown, ExternalLink } from "lucide-react";
import { ECOSYSTEM_PRODUCTS } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutEcosystem() {
  const { t } = useTranslation("about");

  return (
    <section id="products" className="py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("ecosystem.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("ecosystem.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("ecosystem.subtitle")}</p>
        </SectionReveal>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand/40 via-brand/20 to-transparent -translate-x-1/2" aria-hidden />
          <div className="space-y-3">
            {ECOSYSTEM_PRODUCTS.map((product, i) => {
              const cardClass = cn(
                "group relative flex items-center gap-4 mx-auto max-w-lg",
                "rounded-2xl p-4 sm:p-5 border border-border/60 bg-card/50 backdrop-blur-xl",
                "hover:border-brand/35 hover:shadow-lg hover:shadow-brand/10 hover:-translate-y-0.5 transition-all duration-300"
              );
              const inner = (
                <>
                  <span className="text-2xl shrink-0 w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {product.emoji}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground">{t(`ecosystem.products.${product.id}.name`)}</h3>
                      {product.status === "comingSoon" && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                          {t("ecosystem.comingSoon")}
                        </span>
                      )}
                      {product.status === "live" && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/25">
                          {t("ecosystem.live")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t(`ecosystem.products.${product.id}.desc`)}</p>
                  </div>
                  {"external" in product && product.external ? <ExternalLink size={14} className="text-muted-foreground shrink-0" /> : null}
                  {i < ECOSYSTEM_PRODUCTS.length - 1 && (
                    <ArrowDown size={14} className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-brand/30 hidden sm:block" aria-hidden />
                  )}
                </>
              );

              return (
                <SectionReveal key={product.id} delay={i * 0.04}>
                  {"external" in product && product.external ? (
                    <a href={product.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={product.href} className={cardClass}>
                      {inner}
                    </Link>
                  )}
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
