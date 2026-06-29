"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Globe, Linkedin, Quote } from "lucide-react";
import { FOUNDERS, BRAND } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutFoundersV2() {
  const { t } = useTranslation("about");
  const { tArray } = useTranslation("about");

  return (
    <section id="founders" className="py-24 sm:py-32 bg-muted/20 scroll-mt-20">
      <span id="team" className="sr-only" aria-hidden />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("founders.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("founders.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("founders.subtitle")}</p>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {FOUNDERS.map((founder, index) => {
            const expertise = tArray<string>(`founders.${founder.id}.expertise`);
            const tech = tArray<string>(`founders.${founder.id}.tech`);

            return (
              <SectionReveal key={founder.id} delay={index * 0.12}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "group relative rounded-3xl p-[1px] h-full",
                    "bg-gradient-to-br from-brand/50 via-brand-accent/30 to-indigo-500/20",
                    "shadow-xl shadow-brand/5 hover:shadow-2xl hover:shadow-brand/15"
                  )}
                >
                  <div className="rounded-[23px] bg-card/80 dark:bg-card/60 backdrop-blur-2xl p-8 sm:p-10 h-full flex flex-col border border-white/10">
                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <div className="relative shrink-0 mx-auto sm:mx-0">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand to-brand-accent blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="relative p-1 rounded-2xl bg-gradient-to-br from-brand via-brand-accent to-indigo-400">
                          <Image
                            src={founder.imageUrl}
                            alt={founder.name}
                            width={120}
                            height={120}
                            className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{founder.name}</h3>
                        <p className="text-brand font-semibold mt-1">{t(founder.roleKey)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{BRAND.company} · {t(`founders.${founder.id}.companyRole`)}</p>
                        <p className="text-xs text-muted-foreground">{t(`founders.${founder.id}.experience`)}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t(founder.bioKey)}</p>

                    <div className="mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("founders.expertiseLabel")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {expertise.map((e) => (
                          <span key={e} className="text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand border border-brand/15">{e}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("founders.techLabel")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tech.map((techName) => (
                          <span key={techName} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">{techName}</span>
                        ))}
                      </div>
                    </div>

                    <blockquote className="relative rounded-xl bg-muted/50 border border-border/50 p-4 mb-6 mt-auto">
                      <Quote className="absolute top-3 left-3 w-4 h-4 text-brand/30" aria-hidden />
                      <p className="text-sm italic text-muted-foreground pl-6 leading-relaxed">&ldquo;{t(`founders.${founder.id}.quote`)}&rdquo;</p>
                    </blockquote>

                    <div className="flex flex-wrap items-center gap-2">
                      {founder.github && (
                        <a href={founder.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-brand/30 transition-colors">
                          <Github size={18} />
                        </a>
                      )}
                      {founder.linkedin && (
                        <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-brand/30 transition-colors">
                          <Linkedin size={18} />
                        </a>
                      )}
                      <a href={founder.companyUrl} target="_blank" rel="noopener noreferrer" aria-label={BRAND.company} className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted hover:border-brand/30 transition-colors">
                        <Globe size={18} />
                      </a>
                      <Link href={founder.portfolioUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors">
                        {t("founders.portfolio")}
                        <ExternalLink size={14} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
