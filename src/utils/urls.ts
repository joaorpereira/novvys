/** Prefix a path with the Astro `base` config (e.g. `/novvys/`). */
export function withBase(baseUrl: string, path: string): string {
  const normalized = path.replace(/^\//, "");
  return `${baseUrl}${normalized}`;
}

/** Absolute URL for a site path, respecting `site` + `base`. */
export function absoluteUrl(site: string, baseUrl: string, path: string): string {
  return new URL(withBase(baseUrl, path), site).href;
}
