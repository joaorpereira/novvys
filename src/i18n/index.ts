import type { Locale } from "../config";
import type { Translations } from "../types";
import { pt } from "./translations/pt";
import { en } from "./translations/en";
import { es } from "./translations/es";

const translations: Record<Locale, Translations> = { pt, en, es };

export function useTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getNavLinks(t: Translations) {
  return [
    { label: t.nav.services, href: "#servicos" },
    { label: t.nav.solutions, href: "#solucoes" },
    { label: t.nav.cases, href: "#cases" },
    { label: t.nav.about, href: "#sobre" },
    { label: t.nav.blog, href: "#blog" },
    { label: t.nav.careers, href: "#carreiras" },
  ];
}
