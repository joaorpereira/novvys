import postsManifest from "../../content/blog/pt/posts.json";
import { parseFrontmatter } from "./parseFrontmatter";
import type { BlogPostMeta } from "./blog";
import type { Locale } from "../i18n/config";

const activeSlugs = new Set((postsManifest as BlogPostMeta[]).map((post) => post.slug));

const diagramAssets = import.meta.glob<string>("../assets/blog/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const diagramRaw = import.meta.glob<string>("../assets/blog/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

function diagramByFilename(assets: Record<string, string>): Map<string, string> {
  return new Map(
    Object.entries(assets).map(([path, value]) => [path.split("/").pop()!, value]),
  );
}

const diagramRawByFilename = diagramByFilename(diagramRaw);
const diagramUrlByFilename = diagramByFilename(diagramAssets);

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

function rewriteBlogDiagramPaths(content: string): string {
  return content.replace(
    /<img src="\/images\/blog\/([^"]+\.svg)"([^>]*)\/?>/g,
    (_, filename, attrs) => {
      const raw = diagramRawByFilename.get(filename);
      if (typeof raw === "string") {
        const svg = raw.replace(/<\?xml[^?]*\?>\s*/i, "").trim();
        const ariaLabel = attrs.match(/\salt="([^"]*)"/)?.[1];
        const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : "";
        return `<div class="blog-diagram"${ariaAttr}>${svg}</div>`;
      }
      const url = diagramUrlByFilename.get(filename);
      if (typeof url === "string") {
        return `<img src="${url}"${attrs}>`;
      }
      return `<img src="/images/blog/${filename}"${attrs}>`;
    },
  );
}

function buildPostMap(modules: Record<string, string>): Record<string, BlogPost> {
  return Object.fromEntries(
    Object.entries(modules)
      .filter(([path]) => activeSlugs.has(slugFromPath(path)))
      .map(([path, raw]) => {
        const { data, content } = parseFrontmatter(raw);
        const slug = slugFromPath(path);
        const post: BlogPost = {
          slug,
          title: data.title ?? slug,
          description: data.description ?? "",
          date: data.date ?? "",
          author: data.author ?? "Novvys",
          category: data.category ?? "",
          body: rewriteBlogDiagramPaths(content),
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
