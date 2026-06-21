import type { Locale } from "../i18n/config";
import { defaultLocale } from "../i18n/config";

/** Normalize any locale-specific path to the default (pt) path. */
export function toDefaultLocalePath(path: string): string {
  if (path === "/en" || path === "/en/") return "/";
  if (path.startsWith("/en/")) return path.slice(3) || "/";
  if (path === "/es" || path === "/es/") return "/";
  if (path.startsWith("/es/")) return path.slice(3) || "/";
  return path;
}

export function toLocalePath(defaultPath: string, locale: Locale): string {
  if (locale === defaultLocale) return defaultPath === "/" ? "/" : defaultPath;
  const suffix = defaultPath === "/" ? "" : defaultPath;
  return `/${locale}${suffix}`;
}

export function getAlternateUrls(canonicalPath: string): Record<Locale, string> {
  const base = toDefaultLocalePath(canonicalPath);
  return {
    pt: toLocalePath(base, "pt"),
    en: toLocalePath(base, "en"),
    es: toLocalePath(base, "es"),
  };
}
