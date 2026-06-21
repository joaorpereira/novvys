import { parseFrontmatter } from "./parseFrontmatter";
import type { BlogPostMeta } from "./blog";
import type { Locale } from "../i18n/config";

export interface BlogPost extends BlogPostMeta {
  body: string;
}

const rawModulesByLocale: Record<string, Record<string, string>> = {
  pt: import.meta.glob("../../content/blog/pt/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>,
  en: import.meta.glob("../../content/blog/en/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>,
  es: import.meta.glob("../../content/blog/es/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>,
};

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

function buildPostMap(modules: Record<string, string>): Record<string, BlogPost> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      const slug = slugFromPath(path);
      const post: BlogPost = {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "Novvys",
        category: data.category ?? "",
        body: content,
      };
      return [slug, post];
    }),
  );
}

const postMapsByLocale: Record<string, Record<string, BlogPost>> = {
  pt: buildPostMap(rawModulesByLocale.pt),
  en: buildPostMap(rawModulesByLocale.en),
  es: buildPostMap(rawModulesByLocale.es),
};

export function getPostBySlug(slug: string, locale: Locale = "pt"): BlogPost | undefined {
  return postMapsByLocale[locale]?.[slug] ?? postMapsByLocale["pt"]?.[slug];
}
