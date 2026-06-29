"use client";

import { Mail, MapPin, Globe, ExternalLink, Github, Linkedin, Facebook } from "lucide-react";
import { BRAND, FOUNDERS } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

const CONTACT_LINKS = [
  { icon: Mail, label: "email", href: `mailto:${BRAND.email}`, text: BRAND.email },
  { icon: Globe, label: "website", href: BRAND.companyUrl, text: "bornosoftnr.com" },
  { icon: MapPin, label: "location", href: null, text: "Bangladesh" },
] as const;

const SOCIALS = [
  { icon: Github, href: BRAND.github, label: "GitHub" },
  { icon: Linkedin, href: BRAND.linkedin, label: "LinkedIn" },
  { icon: Facebook, href: BRAND.facebook, label: "Facebook" },
] as const;

export function AboutContactV2() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-14">
          <SectionLabel>{t("contact.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("contact.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("contact.subtitle")}</p>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <SectionReveal>
            <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl p-8 space-y-4 h-full">
              {CONTACT_LINKS.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <item.icon size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t(`contact.${item.label}`)}</p>
                    {item.href ? (
                      <a href={item.href} target={item.label === "website" ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-brand transition-colors">
                        {item.text}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{t("contact.locationValue")}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border/60">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("contact.portfolios")}</p>
                <div className="space-y-2">
                  {FOUNDERS.map((f) => (
                    <a
                      key={f.id}
                      href={f.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-brand/30 hover:bg-brand/5 transition-colors group"
                    >
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                      <ExternalLink size={14} className="text-muted-foreground group-hover:text-brand" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-brand/10 via-card/50 to-card/50 backdrop-blur-xl p-8 h-full flex flex-col">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("contact.social")}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                      "h-12 w-12 rounded-xl border border-border bg-background/80",
                      "flex items-center justify-center hover:border-brand/30 hover:bg-brand/5 transition-colors"
                    )}
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">{t("contact.message")}</p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
