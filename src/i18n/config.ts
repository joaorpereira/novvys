export type Locale = "pt" | "en" | "es";

export const locales: Locale[] = ["pt", "en", "es"];

export const defaultLocale: Locale = "pt";

export const localeLabels: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

export const localeHtmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

export const localeHrefLang: Record<Locale, string> = localeHtmlLang;

export function getLocalePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}/`;
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/es")) return "es";
  return "pt";
}
