"use client";

import { ShieldCheck, Eye, Lock, Cloud, Cookie, Zap, Info, Wallet, FileText, CheckCircle, Database, Globe, Key, type LucideIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { StaticPageShell } from "./static-page-shell";

type PolicyKey = "privacy" | "cookie" | "refund" | "security";

const POLICY_ICONS: Record<PolicyKey, LucideIcon> = {
  privacy: ShieldCheck,
  cookie: Cookie,
  refund: Wallet,
  security: ShieldCheck,
};

export function PolicyPageContent({ policy }: { policy: PolicyKey }) {
  const { t } = useTranslation("policies");
  const p = policy;
  const Icon = POLICY_ICONS[p];

  return (
    <StaticPageShell title={t(`${p}.title`)} icon={Icon}>
      <div className="glass-card p-8 sm:p-12 border border-border space-y-10 sm:space-y-12">
        {p === "privacy" && (
          <>
            <section className="space-y-4">
              <span className="inline-flex px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand/20">
                {t("privacy.effective")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">{t("privacy.heading")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("privacy.intro")}</p>
            </section>
            <div className="grid md:grid-cols-2 gap-6">
              {(["collection", "storage"] as const).map((key) => (
                <div key={key} className="space-y-3">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                    {key === "collection" ? <Eye className="w-5 h-5 text-brand" /> : <Lock className="w-5 h-5 text-success" />}
                  </div>
                  <h3 className="font-bold text-foreground">{t(`privacy.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`privacy.${key}.desc`)}</p>
                </div>
              ))}
            </div>
            <section className="space-y-3 pt-8 border-t border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Cloud className="w-5 h-5 text-brand" /> {t("privacy.cloud.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("privacy.cloud.desc")}</p>
            </section>
            <div className="p-6 bg-muted rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2">{t("privacy.rights.title")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("privacy.rights.desc")}</p>
            </div>
          </>
        )}

        {p === "cookie" && (
          <>
            <section className="space-y-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">{t("cookie.heading")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{t("cookie.intro")}</p>
            </section>
            <div className="space-y-4">
              {(["auth", "security"] as const).map((key) => (
                <div key={key} className="flex gap-4 p-5 rounded-2xl bg-brand/5 border border-brand/15">
                  <div className="w-11 h-11 bg-card rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    {key === "auth" ? <Zap className="w-5 h-5 text-brand" /> : <ShieldCheck className="w-5 h-5 text-success" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t(`cookie.${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`cookie.${key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <section className="p-6 bg-muted rounded-2xl border border-border space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-bold text-foreground">{t("cookie.thirdParty.title")}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("cookie.thirdParty.desc")}</p>
            </section>
            <p className="text-sm text-muted-foreground text-center">{t("cookie.consent")}</p>
          </>
        )}

        {p === "refund" && (
          <>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-brand" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">{t("refund.heading")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{t("refund.intro")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {(["pdf", "premium"] as const).map((key) => (
                <div key={key} className="p-5 bg-muted rounded-2xl border border-border">
                  <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    {key === "pdf" ? <FileText className="w-5 h-5 text-brand" /> : <Info className="w-5 h-5 text-brand" />}
                    {t(`refund.${key}.title`)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(`refund.${key}.desc`)}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center italic">{t("refund.footer")}</p>
          </>
        )}

        {p === "security" && (
          <>
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">{t("security.heading")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("security.intro")}</p>
            </section>
            <div className="grid md:grid-cols-2 gap-4">
              {(["encryption", "cloud"] as const).map((key) => (
                <div key={key} className="p-6 bg-muted rounded-2xl border border-border space-y-3">
                  <div className="w-11 h-11 bg-card rounded-xl flex items-center justify-center shadow-sm">
                    {key === "encryption" ? <Lock className="w-5 h-5 text-brand" /> : <Database className="w-5 h-5 text-success" />}
                  </div>
                  <h3 className="font-bold text-foreground">{t(`security.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`security.${key}.desc`)}</p>
                </div>
              ))}
            </div>
            <section className="space-y-3 pt-6 border-t border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5 text-brand" /> {t("security.access.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("security.access.desc")}</p>
            </section>
            <div className="p-6 gradient-primary rounded-2xl text-brand-foreground flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 bg-brand-foreground/10 rounded-full flex items-center justify-center shrink-0">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">{t("security.monitoring.title")}</h4>
                <p className="text-brand-foreground/80 text-xs leading-relaxed">{t("security.monitoring.desc")}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </StaticPageShell>
  );
}
