import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { events } from "@/data/community";

type CmsDoc = Record<string, unknown>;

export type PublicEventItem = {
  title: string;
  date: string;
  tag: string;
  description: string;
  location?: string | null;
  url: string;
};

export type PublicNewsItem = {
  title: string;
  excerpt: string;
  publishedAt?: string | null;
  url: string;
};

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://reverse.my.id").replace(/\/$/, "");
}

function shouldUseCmsContent() {
  return process.env.ENABLE_CMS_CONTENT === "true";
}

function fallbackEvents(): PublicEventItem[] {
  return events.upcoming.slice(0, 5).map((event) => ({
    title: event.title,
    date: event.date,
    tag: event.tag,
    description: event.description,
    location: event.location ?? null,
    url: `${siteUrl()}/#events`
  }));
}

function fallbackNews(): PublicNewsItem[] {
  return [
    {
      title: "Reverse Ecosystem mulai terhubung",
      excerpt: "Website, Discord bot, WhatsApp bot, AI gateway, dan status ecosystem mulai disusun sebagai satu fondasi Reverse.",
      publishedAt: new Date().toISOString(),
      url: `${siteUrl()}/projects`
    },
    {
      title: "Bot docs dan ecosystem status tersedia",
      excerpt: "Dokumentasi bot dan status publik yang sanitized sekarang tersedia untuk member Reverse Community.",
      publishedAt: new Date().toISOString(),
      url: `${siteUrl()}/bots`
    }
  ];
}

const getCachedPublicEventsFromCms = unstable_cache(
  async (): Promise<PublicEventItem[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "events",
      limit: 5,
      sort: "startsAt",
      where: { status: { equals: "upcoming" } }
    });

    return result.docs.map((doc) => {
      const cmsDoc = doc as CmsDoc;
      const slug = text(cmsDoc.slug, "#events");
      return {
        title: text(cmsDoc.title, "Reverse Event"),
        date: text(cmsDoc.displayDate, "Soon"),
        tag: text(cmsDoc.tag, "Event"),
        description: text(cmsDoc.description, "Event komunitas Reverse."),
        location: optionalText(cmsDoc.location) ?? null,
        url: `${siteUrl()}/#events${slug && slug !== "#events" ? `-${slug}` : ""}`
      };
    });
  },
  ["public-events"],
  { revalidate: 300, tags: ["public-events"] }
);

const getCachedPublicNewsFromCms = unstable_cache(
  async (): Promise<PublicNewsItem[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "posts",
      limit: 5,
      sort: "-publishedAt"
    });

    return result.docs.map((doc) => {
      const cmsDoc = doc as CmsDoc;
      const slug = text(cmsDoc.slug, "projects");
      return {
        title: text(cmsDoc.title, "Reverse Update"),
        excerpt: text(cmsDoc.excerpt, "Update terbaru dari Reverse Community."),
        publishedAt: optionalText(cmsDoc.publishedAt) ?? null,
        url: `${siteUrl()}/posts/${slug}`
      };
    });
  },
  ["public-news"],
  { revalidate: 300, tags: ["public-news"] }
);

export async function getPublicEvents() {
  if (!shouldUseCmsContent()) return { source: "fallback" as const, items: fallbackEvents() };

  try {
    const items = await getCachedPublicEventsFromCms();
    return { source: items.length ? ("cms" as const) : ("fallback" as const), items: items.length ? items : fallbackEvents() };
  } catch {
    return { source: "fallback" as const, items: fallbackEvents() };
  }
}

export async function getPublicNews() {
  if (!shouldUseCmsContent()) return { source: "fallback" as const, items: fallbackNews() };

  try {
    const items = await getCachedPublicNewsFromCms();
    return { source: items.length ? ("cms" as const) : ("fallback" as const), items: items.length ? items : fallbackNews() };
  } catch {
    return { source: "fallback" as const, items: fallbackNews() };
  }
}
