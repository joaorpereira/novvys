import postsManifest from "../../content/blog/pt/posts.json";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
}

export function getAllPosts(): BlogPostMeta[] {
  return [...(postsManifest as BlogPostMeta[])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostMeta(slug: string): BlogPostMeta | undefined {
  return (postsManifest as BlogPostMeta[]).find((p) => p.slug === slug);
}

export function formatPostDate(isoDate: string, locale: string = "pt-BR"): string {
  const d = new Date(isoDate + "T12:00:00Z");
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
