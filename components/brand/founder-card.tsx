"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Globe, Linkedin } from "lucide-react";
import type { Founder } from "@/lib/brand";
import { BRAND } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type FounderCardProps = {
  founder: Founder;
  index?: number;
};

export function FounderCard({ founder, index = 0 }: FounderCardProps) {
  const { t } = useTranslation("about");

  const socials = [
    founder.github && { href: founder.github, icon: Github, label: "GitHub" },
    founder.linkedin && { href: founder.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: founder.companyUrl, icon: Globe, label: BRAND.company },
  ].filter(Boolean) as { href: string; icon: typeof Github; label: string }[];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative flex flex-col rounded-2xl p-[1px]",
        "bg-gradient-to-br from-brand/40 via-brand-accent/30 to-transparent",
        "shadow-lg shadow-brand/5 hover:shadow-xl hover:shadow-brand/10",
        "transition-shadow duration-300"
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full rounded-[15px] p-6 sm:p-8",
          "bg-background/80 dark:bg-background/60 backdrop-blur-xl",
          "border border-border/60 dark:border-white/10"
        )}
      >
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-brand-accent blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative p-[3px] rounded-full bg-gradient-to-br from-brand via-brand-accent to-brand/50">
              <Image
                src={founder.imageUrl}
                alt={founder.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover bg-muted"
                unoptimized
              />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-2 sm:bottom-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-brand/10 text-brand border border-brand/20">
              {BRAND.company}
            </span>
          </div>

          <h3 className="text-xl font-bold text-foreground tracking-tight">{founder.name}</h3>
          <p className="text-sm font-medium text-brand mt-1">{t(founder.roleKey)}</p>
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">{t(founder.bioKey)}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${founder.name} on ${s.label}`}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:border-brand/30 hover:bg-brand/5 transition-colors"
            >
              <s.icon size={16} aria-hidden />
            </a>
          ))}
          <Link
            href={founder.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold bg-brand text-brand-foreground hover:bg-brand/90 transition-colors ml-auto"
          >
            {t("founders.portfolio")}
            <ExternalLink size={12} aria-hidden />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
