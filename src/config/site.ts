import { DEPLOY_SITE } from "../../deploy.config.mjs";

export const SITE = {
  name: "Novvys",
  legalName: "Novvys Engineering",
  tagline: "Software House",
  url: DEPLOY_SITE,
  email: "joao@novvys.com",
  phone: "+55-11-99999-9999",
  twitterHandle: "@novvys",
} as const;

export const localeOgLocale = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
} as const;
