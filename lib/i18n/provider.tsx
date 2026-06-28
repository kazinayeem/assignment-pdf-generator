"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { messages } from "./messages";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectBrowserLocale,
  getNestedValue,
  type Locale,
  type Namespace,
} from "./types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: Namespace, key: string) => string;
  tArray: <T>(namespace: Namespace, key: string) => T[];
  tObject: <T>(namespace: Namespace, key: string) => T;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    const initial = stored && (stored === "en" || stored === "bn") ? stored : detectBrowserLocale();
    setLocaleState(initial);
    setMounted(true);
    document.documentElement.lang = initial === "bn" ? "bn" : "en";
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    document.documentElement.lang = next === "bn" ? "bn" : "en";
  }, []);

  const t = useCallback(
    (namespace: Namespace, key: string): string => {
      const value = getNestedValue(messages[locale][namespace] as Record<string, unknown>, key);
      if (typeof value === "string") return value;
      return key;
    },
    [locale]
  );

  const tArray = useCallback(
    <T,>(namespace: Namespace, key: string): T[] => {
      const value = getNestedValue(messages[locale][namespace] as Record<string, unknown>, key);
      return Array.isArray(value) ? (value as T[]) : [];
    },
    [locale]
  );

  const tObject = useCallback(
    <T,>(namespace: Namespace, key: string): T => {
      const value = getNestedValue(messages[locale][namespace] as Record<string, unknown>, key);
      return (value ?? {}) as T;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tArray, tObject }),
    [locale, setLocale, t, tArray, tObject]
  );

  if (!mounted) {
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTranslation(namespace: Namespace) {
  const { locale, setLocale, t, tArray, tObject } = useI18n();
  return {
    locale,
    setLocale,
    t: (key: string) => t(namespace, key),
    tArray: <T,>(key: string) => tArray<T>(namespace, key),
    tObject: <T,>(key: string) => tObject<T>(namespace, key),
  };
}
