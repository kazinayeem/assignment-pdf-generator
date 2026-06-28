const SESSION_KEY = "campusflow-dev-notice-session";
const STORAGE_KEY = "campusflow-dev-notice-until";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function shouldShowDevelopmentNotice(): boolean {
  if (typeof window === "undefined") return false;

  const until = localStorage.getItem(STORAGE_KEY);
  if (until && Date.now() < Number(until)) return false;

  if (sessionStorage.getItem(SESSION_KEY)) return false;

  return true;
}

export function dismissDevelopmentNotice(hideForToday: boolean): void {
  sessionStorage.setItem(SESSION_KEY, "1");

  if (hideForToday) {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + TWENTY_FOUR_HOURS));
  }
}
