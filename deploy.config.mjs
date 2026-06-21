/** Shared deploy settings. Override with env vars when building for AWS. */
export const DEPLOY_SITE = (process.env.SITE_URL ?? "https://joaorpereira.github.io").replace(
  /\/$/,
  "",
);
export const DEPLOY_BASE = process.env.BASE_PATH ?? "/novvys/";
