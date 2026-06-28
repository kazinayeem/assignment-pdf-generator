"use client";

import { FileText, Heart, ShieldCheck, Zap, Globe, Mail, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { StaticPageShell } from "./static-page-shell";

export function AboutPageContent() {
  const { t } = useTranslation("about");

  return (
    <StaticPageShell title={t("title")} backLabel={t("back")} icon={FileText}>
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6">{t("hero.title")}</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t("hero.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {[
          { key: "automation", icon: Zap, color: "bg-brand/10 text-brand" },
          { key: "security", icon: ShieldCheck, color: "bg-success/10 text-success" },
        ].map(({ key, icon: Icon, color }) => (
          <div key={key} className="glass-card p-6 sm:p-8 border border-border">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
              <Icon className="w-6 h-6" aria-hidden />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{t(`cards.${key}.title`)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{t(`cards.${key}.desc`)}</p>
          </div>
        ))}
      </div>

      <div className="glass-card gradient-primary rounded-3xl p-8 sm:p-12 text-brand-foreground text-center shadow-xl shadow-brand/20 mb-12">
        <Heart className="w-12 h-12 text-destructive fill-destructive mx-auto mb-6" aria-hidden />
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t("founder.title")}</h3>
        <p className="text-brand-foreground/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">{t("founder.desc")}</p>
        <a
          href="https://bornosoftnr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-background text-brand rounded-2xl font-bold text-base hover:bg-muted transition-all shadow-lg min-h-[44px]"
        >
          <Globe className="w-5 h-5" aria-hidden />
          {t("founder.cta")}
        </a>
      </div>

      <div className="glass-card p-8 sm:p-10 border border-border">
        <h3 className="text-2xl font-bold text-foreground mb-2">{t("contact.title")}</h3>
        <p className="text-muted-foreground mb-2">{t("contact.stayWithUs")}</p>
        <p className="text-muted-foreground text-sm mb-6">{t("contact.subtitle")}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href={`mailto:${t("contact.email")}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand/30 hover:bg-brand/5 transition-all min-h-[44px]"
          >
            <Mail className="w-5 h-5 text-brand shrink-0" aria-hidden />
            <div>
              <p className="text-xs text-muted-foreground">{t("contact.emailLabel")}</p>
              <p className="font-semibold text-foreground text-sm">{t("contact.email")}</p>
            </div>
          </a>
          <a
            href={`https://${t("contact.website")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand/30 hover:bg-brand/5 transition-all min-h-[44px]"
          >
            <ExternalLink className="w-5 h-5 text-brand shrink-0" aria-hidden />
            <div>
              <p className="text-xs text-muted-foreground">{t("contact.websiteLabel")}</p>
              <p className="font-semibold text-foreground text-sm">{t("contact.website")}</p>
            </div>
          </a>
        </div>
      </div>
    </StaticPageShell>
  );
}
