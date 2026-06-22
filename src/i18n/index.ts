import type { Locale } from "./config";
import { getLocalePath } from "./config";
import type { Translations } from "./types";
import { pt } from "./translations/pt";
import { en } from "./translations/en";
import { es } from "./translations/es";

const translations: Record<Locale, Translations> = { pt, en, es };

export function useTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getBlogPath(locale: Locale): string {
  return locale === "pt" ? "/blog" : `/${locale}/blog`;
}

export function getBlogPostPath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
}

export function getNavLinks(t: Translations, locale: Locale) {
  return [
    { label: t.nav.services, href: `${getLocalePath(locale)}#servicos` },
    { label: t.nav.cases, href: `${getLocalePath(locale)}#cases` },
    { label: t.nav.contact, href: `${getLocalePath(locale)}#contato` },
    { label: t.nav.blog, href: getBlogPath(locale) },
  ];
}
