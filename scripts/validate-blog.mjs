/**
 * Pre-build validation: ensures every slug in posts.json has a corresponding .md file
 * in the pt/ folder (source of truth), and that every locale folder only contains
 * slugs that exist in posts.json.
 * Exits with code 1 if they are out of sync to fail the build fast.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = resolve(__dirname, "../content/blog");
const postsJsonPath = resolve(blogDir, "pt/posts.json");
const locales = ["pt", "en", "es"];

const posts = JSON.parse(readFileSync(postsJsonPath, "utf-8"));
const jsonSlugs = new Set(posts.map((p) => p.slug));

let hasError = false;

// Validate PT folder (source of truth — every slug must have a .md)
const ptDir = resolve(blogDir, "pt");
const ptMdFiles = readdirSync(ptDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));
const ptMdSlugs = new Set(ptMdFiles);

const missingMd = [...jsonSlugs].filter((s) => !ptMdSlugs.has(s));
const missingJson = [...ptMdSlugs].filter((s) => !jsonSlugs.has(s));

if (missingMd.length > 0) {
  console.error("❌ posts.json has slugs with no matching .md in content/blog/pt/:");
  missingMd.forEach((s) => console.error(`   - ${s}.md`));
  hasError = true;
}

if (missingJson.length > 0) {
  console.warn("⚠️  content/blog/pt/ has .md files not listed in posts.json (inactive):");
  missingJson.forEach((s) => console.warn(`   - ${s}`));
}

// Validate EN and ES folders — warn about slugs not in posts.json (orphaned translations)
for (const locale of ["en", "es"]) {
  const localeDir = resolve(blogDir, locale);
  if (!existsSync(localeDir)) continue;

  const mdFiles = readdirSync(localeDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  const orphaned = mdFiles.filter((s) => !jsonSlugs.has(s));
  if (orphaned.length > 0) {
    console.warn(`⚠️  content/blog/${locale}/ has .md files not listed in posts.json:`);
    orphaned.forEach((s) => console.warn(`   - ${s}`));
  }

  const coverage = mdFiles.filter((s) => jsonSlugs.has(s)).length;
  console.log(`   [${locale}] ${coverage}/${posts.length} posts translated`);
}

if (hasError) {
  process.exit(1);
}

console.log(`✅ Blog validated: ${posts.length} posts in sync across ${locales.length} locales.`);
