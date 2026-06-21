const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
  "require-trusted-types-for 'script'",
  "trusted-types default",
] as const;

/** Directives that only apply as HTTP headers, not in `<meta http-equiv>`. */
const HEADER_ONLY_DIRECTIVES = new Set(["frame-ancestors"]);

function joinDirectives(directives: readonly string[]): string {
  return directives.join("; ");
}

/** Full CSP for HTTP response headers (`_headers`, dev/preview server). */
export const CONTENT_SECURITY_POLICY = joinDirectives(CSP_DIRECTIVES);

/** CSP for `<meta http-equiv>` — excludes header-only directives. */
export const META_CONTENT_SECURITY_POLICY = joinDirectives(
  CSP_DIRECTIVES.filter((directive) => {
    const name = directive.split(/\s+/)[0];
    return !HEADER_ONLY_DIRECTIVES.has(name);
  }),
);

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
};

/** Netlify / Cloudflare Pages `_headers` file body. */
export function buildHeadersFile(): string {
  const lines = ["/*"];
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    lines.push(`  ${name}: ${value}`);
  }
  return `${lines.join("\n")}\n`;
}
