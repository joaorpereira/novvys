export interface FrontmatterData {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  category?: string;
  [key: string]: string | undefined;
}

export interface ParsedPost {
  data: FrontmatterData;
  content: string;
}

export function parseFrontmatter(raw: string): ParsedPost {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw.trim() };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();

  const data: FrontmatterData = {};
  for (const line of yamlBlock.split(/\r?\n/)) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) data[key] = value;
  }

  return { data, content };
}
