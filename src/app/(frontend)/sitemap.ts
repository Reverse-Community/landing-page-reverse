import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const siteUrl = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://reverse.my.id").origin;
    } catch {
      return "https://reverse.my.id";
    }
  })();

  return ["", "/bots", "/projects", "/os", "/terms", "/privacy", "/community-guidelines"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path ? 0.6 : 1
  }));
}
