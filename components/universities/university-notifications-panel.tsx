"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import {
  getSubscriptions, toggleSubscription, requestNotificationPermission, isSubscribed,
} from "@/lib/universities/notifications";
import type { NotificationTopic, University } from "@/lib/universities/types";
import { card, button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const TOPICS: NotificationTopic[] = [
  "admission-open", "admission-deadline", "scholarship", "circular",
  "ranking", "department-news", "events", "exam",
];

export function UniversityNotificationsPanel({ university }: { university?: University }) {
  const { t } = useTranslation("universities");
  const [subs, setSubs] = useState(getSubscriptions());
  const [email, setEmail] = useState("");
  const slug = university?.slug;

  useEffect(() => { setSubs(getSubscriptions()); }, []);

  const handleToggle = async (topic: NotificationTopic) => {
    await requestNotificationPermission();
    const next = toggleSubscription({ topic, universitySlug: slug, email: email || undefined, enabled: true });
    setSubs(next);
  };

  return (
    <div className={cn(card.base, "p-5")}>
      <h3 className="font-bold flex items-center gap-2 mb-4">
        <Bell size={16} className="text-brand" /> {t("notifications.title")}
      </h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("notifications.email")}
        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm mb-4 min-h-[40px]"
      />
      <div className="space-y-2">
        {TOPICS.map((topic) => (
          <label key={topic} className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer">
            <span className="text-sm text-foreground">{t(`notifications.topics.${topic}`)}</span>
            <input
              type="checkbox"
              checked={isSubscribed(topic, slug)}
              onChange={() => handleToggle(topic)}
              className="rounded border-border"
            />
          </label>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">{t("notifications.hint")}</p>
      {subs.length > 0 && (
        <button type="button" className={cn(button.ghost, "text-xs mt-2")}>
          {subs.length} {t("notifications.active")}
        </button>
      )}
    </div>
  );
}
