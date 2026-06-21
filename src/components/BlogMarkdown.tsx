import { marked } from "marked";
import type { FC } from "react";

marked.setOptions({ gfm: true, breaks: false });

interface BlogMarkdownProps {
  content: string;
}

const BlogMarkdown: FC<BlogMarkdownProps> = ({ content }) => {
  const html = marked.parse(content) as string;
  return (
    <div
      className="blog-content"
      // Content is sourced from local .md files bundled at build time — not user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default BlogMarkdown;
