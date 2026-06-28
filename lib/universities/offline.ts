const OFFLINE_UNIS = "campusflow-offline-universities";
const OFFLINE_CIRCULARS = "campusflow-offline-circulars";

export function saveUniversityOffline(slug: string): string[] {
  const current = getOfflineUniversities();
  const next = current.includes(slug) ? current : [...current, slug];
  localStorage.setItem(OFFLINE_UNIS, JSON.stringify(next));
  return next;
}

export function removeUniversityOffline(slug: string): string[] {
  const next = getOfflineUniversities().filter((s) => s !== slug);
  localStorage.setItem(OFFLINE_UNIS, JSON.stringify(next));
  return next;
}

export function getOfflineUniversities(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_UNIS) ?? "[]");
  } catch {
    return [];
  }
}

export function isUniversityOffline(slug: string): boolean {
  return getOfflineUniversities().includes(slug);
}

export function saveCircularOffline(circularId: string): string[] {
  const current = getOfflineCirculars();
  const next = current.includes(circularId) ? current : [...current, circularId];
  localStorage.setItem(OFFLINE_CIRCULARS, JSON.stringify(next));
  return next;
}

export function getOfflineCirculars(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_CIRCULARS) ?? "[]");
  } catch {
    return [];
  }
}
