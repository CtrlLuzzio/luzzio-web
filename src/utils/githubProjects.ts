import { getCollection } from "astro:content";
import { filterPostsByLang } from "./blogMeta";
import { formatDate, type Locale } from "../i18n/utils";

export interface BlogPostLink {
  id: string;
  title: string;
}

export interface ProjectItem {
  name: string;
  description: string | null;
  isPrivate: boolean;
  htmlUrl: string;
  language: string | null;
  topics: string[];
  updatedAt: string;
  readmeHtml: string | null;
  blogPosts: BlogPostLink[];
}

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
}

export function cleanReadmeHtml(html: string): string {
  return html
    .replace(
      /<blockquote[^>]*>\s*<p[^>]*>(?:(?!<\/p>)[\s\S])*?(?:README(?:\.es)?\.md|ENGLISH README|README EN ESPA[ÑN]OL)(?:(?!<\/p>)[\s\S])*?<\/p>\s*<\/blockquote>/gi,
      ""
    )
    .replace(
      /<p[^>]*>\s*(?:&gt;|>)?\s*(?:(?!<\/p>)[\s\S])*?(?:README(?:\.es)?\.md|ENGLISH README|README EN ESPA[ÑN]OL)(?:(?!<\/p>)[\s\S])*?<\/p>/gi,
      ""
    )
    .trim();
}

export async function getProjectsForLocale(lang: Locale): Promise<ProjectItem[]> {
  const TOKEN = import.meta.env.GITHUB_TOKEN;
  const USERNAME = import.meta.env.GITHUB_USERNAME;
  const REQUIRED_TOPIC = "portfolio";

  const allPosts = await getCollection("blog");
  const localizedPosts = filterPostsByLang(allPosts, lang);

  const blogMap: Record<string, BlogPostLink[]> = {};
  for (const post of localizedPosts) {
    const repoKey = post.data.projectRepo?.toLowerCase();
    if (repoKey) {
      if (!blogMap[repoKey]) blogMap[repoKey] = [];
      blogMap[repoKey].push({
        id: post.cleanSlug,
        title: post.data.title,
      });
    }
  }

  if (!TOKEN) {
    console.error("Falta GITHUB_TOKEN en .env para consultar repositorios.");
    return [];
  }

  const baseHeaders = {
    Authorization: `Bearer ${TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const reposRes = await fetch(
      "https://api.github.com/user/repos?visibility=all&affiliation=owner&sort=pushed&per_page=100",
      {
        headers: {
          ...baseHeaders,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!reposRes.ok) {
      throw new Error(
        `GitHub Repos API error (${reposRes.status}): ${await reposRes.text()}`
      );
    }

    const rawRepos = (await reposRes.json()) as GitHubRepoResponse[];
    const filteredRepos = rawRepos.filter(
      (repo) => !repo.fork && repo.topics?.includes(REQUIRED_TOPIC)
    );

    return await Promise.all(
      filteredRepos.map(async (repo) => {
        let readmeHtml: string | null = null;
        try {
          if (lang === "es") {
            const esRes = await fetch(
              `https://api.github.com/repos/${USERNAME}/${repo.name}/contents/README.es.md`,
              {
                headers: {
                  ...baseHeaders,
                  Accept: "application/vnd.github.html+json",
                },
              }
            );
            if (esRes.ok) {
              readmeHtml = await esRes.text();
            }
          }

          if (!readmeHtml) {
            const defaultRes = await fetch(
              `https://api.github.com/repos/${USERNAME}/${repo.name}/readme`,
              {
                headers: {
                  ...baseHeaders,
                  Accept: "application/vnd.github.html+json",
                },
              }
            );
            if (defaultRes.ok) {
              readmeHtml = await defaultRes.text();
            }
          }

          if (readmeHtml) {
            readmeHtml = cleanReadmeHtml(readmeHtml);
          }
        } catch (err) {
          console.error(`Error obteniendo README de ${repo.name}:`, err);
        }

        const updatedDate = formatDate(new Date(repo.pushed_at), lang);

        return {
          name: repo.name,
          description: repo.description,
          isPrivate: repo.private,
          htmlUrl: repo.html_url,
          language: repo.language,
          topics: (repo.topics || []).filter((t) => t !== REQUIRED_TOPIC),
          updatedAt: updatedDate,
          readmeHtml,
          blogPosts: blogMap[repo.name.toLowerCase()] || [],
        };
      })
    );
  } catch (error) {
    console.error("Error en el fetch a GitHub:", error);
    return [];
  }
}