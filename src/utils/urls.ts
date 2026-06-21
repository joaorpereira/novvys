import { DEPLOY_BASE, DEPLOY_SITE } from "../../deploy.config.mjs";

/** Prefix a path with the deploy base (e.g. `/novvys/`). */
export function withBase(path: string, baseUrl: string = DEPLOY_BASE): string {
  const normalized = path.replace(/^\//, "");
  return `${baseUrl}${normalized}`;
}

/** Absolute URL for a site path, respecting `site` + `base`. */
export function absoluteUrl(
  path: string,
  site: string = DEPLOY_SITE,
  baseUrl: string = DEPLOY_BASE,
): string {
  return new URL(withBase(path, baseUrl), site).href;
}

export { DEPLOY_BASE, DEPLOY_SITE };
