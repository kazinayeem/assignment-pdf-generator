"use client";

import { useState } from "react";
import { Bell, Mail, Rss, Smartphone } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type SubscribePanelProps = {
  open: boolean;
  onClose: () => void;
};

export function SubscribePanel({ open, onClose }: SubscribePanelProps) {
  const { t } = useTranslation("changelog");
  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleSubscribe = (type: string) => {
    if (type === "email" && !email.trim()) {
      toast.error(t("subscribe.emailRequired"));
      return;
    }
    if (type === "browser" && typeof Notification !== "undefined") {
      Notification.requestPermission().then((p) => {
        if (p === "granted") toast.success(t("subscribe.browserEnabled"));
        else toast.error(t("subscribe.browserDenied"));
      });
      return;
    }
    if (type === "push") {
      toast.success(t("subscribe.pushSoon"));
      return;
    }
    toast.success(t("subscribe.success"));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby="subscribe-title">
      <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h2 id="subscribe-title" className="text-lg font-bold text-foreground mb-1">{t("subscribe.title")}</h2>
        <p className="text-sm text-muted-foreground mb-5">{t("subscribe.subtitle")}</p>

        <label className="block mb-4">
          <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("subscribe.emailLabel")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("subscribe.emailPlaceholder")}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "email", icon: Mail },
            { key: "rss", icon: Rss, href: "/api/changelog/rss" },
            { key: "push", icon: Bell },
            { key: "browser", icon: Smartphone },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                if (opt.href) window.open(opt.href, "_blank");
                else handleSubscribe(opt.key);
              }}
              className={cn(
                "flex items-center gap-2 h-10 px-3 rounded-lg border border-border text-xs font-semibold",
                "hover:bg-muted transition-colors text-left"
              )}
            >
              <opt.icon size={14} className="text-brand shrink-0" />
              {t(`subscribe.${opt.key}`)}
            </button>
          ))}
        </div>

        <button type="button" onClick={onClose} className="mt-4 w-full h-9 text-sm text-muted-foreground hover:text-foreground">
          {t("subscribe.close")}
        </button>
      </div>
    </div>
  );
}
