import type { NotificationSubscription, NotificationTopic } from "./types";

const KEY = "campusflow-uni-notifications";

export function getSubscriptions(): NotificationSubscription[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function toggleSubscription(sub: NotificationSubscription): NotificationSubscription[] {
  const current = getSubscriptions();
  const idx = current.findIndex(
    (s) => s.topic === sub.topic && s.universitySlug === sub.universitySlug
  );
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(sub);
  }
  localStorage.setItem(KEY, JSON.stringify(current));
  return current;
}

export function isSubscribed(topic: NotificationTopic, universitySlug?: string): boolean {
  return getSubscriptions().some(
    (s) => s.topic === topic && s.enabled !== false && s.universitySlug === universitySlug
  );
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  return Notification.requestPermission();
}

export function sendBrowserNotification(title: string, body: string, url?: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const n = new Notification(title, { body, icon: "/logo_navbar.png" });
  if (url) n.onclick = () => { window.open(url); n.close(); };
}
