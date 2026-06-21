import type { APIRoute } from "astro";
import { DEPLOY_SITE, DEPLOY_BASE } from "../../deploy.config.mjs";

export const GET: APIRoute = () => {
  const base = DEPLOY_BASE.replace(/\/$/, "");
  const sitemapUrl = `${DEPLOY_SITE}${base}/sitemap-index.xml`;

  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
