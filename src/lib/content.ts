import { unstable_cache } from "next/cache";
import {
  events,
  aboutContent,
  faqs,
  gallery,
  gameStats,
  legalPages,
  marqueeItems,
  memberShowcase,
  merchProducts,
  pillars,
  roadmap,
  siteConfig,
  teamMembers
} from "@/data/community";
import { getCmsPayload } from "@/lib/payload-runtime";
import { optionalSafeUrl } from "@/lib/safe-url";

export type LandingContent = {
  siteConfig: typeof siteConfig;
  aboutContent: typeof aboutContent;
  marqueeItems: typeof marqueeItems;
  pillars: typeof pillars;
  teamMembers: typeof teamMembers;
  events: typeof events;
  gallery: typeof gallery;
  faqs: typeof faqs;
  roadmap: typeof roadmap;
  memberShowcase: typeof memberShowcase;
  gameStats: typeof gameStats;
  merchProducts: typeof merchProducts;
  legalPages: typeof legalPages;
};

export const fallbackContent: LandingContent = {
  siteConfig,
  aboutContent,
  marqueeItems,
  pillars,
  teamMembers,
  events,
  gallery,
  faqs,
  roadmap,
  memberShowcase,
  gameStats,
  merchProducts,
  legalPages
};

type CmsDoc = Record<string, unknown>;

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function mediaUrl(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;

  if (typeof value === "object" && value !== null) {
    const doc = value as CmsDoc;
    const direct = optionalText(doc.url);
    if (direct) return direct;

    const sizes = doc.sizes as Record<string, CmsDoc> | undefined;
    if (sizes && typeof sizes === "object") {
      for (const variant of Object.values(sizes)) {
        const url = optionalText(variant?.url);
        if (url) return url;
      }
    }

    const filename = optionalText(doc.filename);
    if (filename) return `/api/media/file/${filename}`;
  }

  return undefined;
}

function teamLinks(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const doc = entry as CmsDoc;
      const label = optionalText(doc.label);
      const url = optionalSafeUrl(doc.url);
      if (!label || !url) return null;
      return { label, url };
    })
    .filter((entry): entry is { label: string; url: string } => entry !== null);

  return cleaned.length ? cleaned : undefined;
}

function logCmsFallback(scope: string, error: unknown) {
  const detail = error instanceof Error ? error.message : "Unknown CMS error";
  console.warn(`[content] Failed to load ${scope} from CMS; using fallback.`, detail);
}

function shouldUseCmsContent() {
  if (process.env.ENABLE_CMS_CONTENT !== "true") return false;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return true;

  try {
    const hostname = new URL(databaseUrl).hostname;

    if (hostname === "postgres" && process.env.RUNNING_IN_DOCKER !== "true") {
      console.warn("[content] DATABASE_URL uses Docker hostname 'postgres' outside Docker; using fallback content. Use localhost for local dev or run the app inside Docker Compose.");
      return false;
    }
  } catch {
    return true;
  }

  return true;
}

async function loadLandingContentFromCms(): Promise<LandingContent> {
  const payload = await getCmsPayload();
  const [settings, team, cmsEvents, highlights, members, stats, products] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", depth: 1 }),
    payload.find({ collection: "team-members", limit: 40, sort: "sortOrder", depth: 2 }),
    payload.find({ collection: "events", limit: 40, sort: "startsAt", depth: 2 }),
    payload.find({ collection: "highlights", limit: 12, sort: "sortOrder", depth: 2 }),
    payload.find({ collection: "members", limit: 12, sort: "sortOrder", depth: 2 }),
    payload.find({ collection: "game-stats", limit: 12, sort: "sortOrder" }),
    payload.find({ collection: "products", limit: 12, sort: "sortOrder", depth: 2 })
  ]);

  const settingsDoc = settings as CmsDoc;
  const fallbackInvite = fallbackContent.siteConfig.inviteUrl;
  const discordInvite = optionalSafeUrl(settingsDoc.discordInviteUrl) ?? fallbackInvite;

  function mapTeamMember(doc: Record<string, unknown>, index: number) {
    return {
      name: text(doc.name, "Member"),
      role: text(doc.role, "Team"),
      city: text(doc.city, "Indonesia"),
      accent: (index % 2 === 0 ? "red" : "blue") as "red" | "blue",
      imageUrl: mediaUrl(doc.photo) ?? null,
      links: teamLinks(doc.links)
    };
  }

  function mapEvent(doc: Record<string, unknown>, status: string) {
    return {
      date: text(doc.displayDate, status === "past" ? "Past" : "Soon"),
      title: text(doc.title, "Reverse Event"),
      tag: text(doc.tag, "Event"),
      description: text(doc.description, "Event komunitas Reverse."),
      location: optionalText(doc.location) ?? null,
      imageUrl: mediaUrl(doc.cover) ?? null
    };
  }

  function mapHighlight(doc: Record<string, unknown>) {
    return {
      title: text(doc.title, "Highlight"),
      caption: text(doc.caption, "Momen komunitas Reverse."),
      imageUrl: mediaUrl(doc.image) ?? null
    };
  }

  function mapMemberShowcase(doc: Record<string, unknown>) {
    return {
      name: text(doc.name, "Member"),
      role: text(doc.role, "Member"),
      game: text(doc.favoriteGame, "Community"),
      quote: text(doc.quote, "Proud member of Reverse."),
      imageUrl: mediaUrl(doc.avatar) ?? null
    };
  }

  function mapGameStat(doc: Record<string, unknown>) {
    return {
      label: text(doc.label, "Metric"),
      value: text(doc.value, "0"),
      description: text(doc.description, "Stat komunitas.")
    };
  }

  function mapProduct(doc: Record<string, unknown>) {
    return {
      name: text(doc.name, "Product"),
      price: text(doc.price, "Coming soon"),
      status: text(doc.status, "Concept"),
      imageUrl: mediaUrl(doc.image) ?? null
    };
  }

  return {
    ...fallbackContent,
    siteConfig: {
      ...fallbackContent.siteConfig,
      inviteUrl: discordInvite,
      tagline: {
        id: text(settingsDoc.taglineId, fallbackContent.siteConfig.tagline.id),
        en: text(settingsDoc.taglineEn, fallbackContent.siteConfig.tagline.en)
      },
      socials: {
        discord: discordInvite || "",
        instagram: optionalSafeUrl(settingsDoc.instagramUrl) ?? "",
        youtube: optionalSafeUrl(settingsDoc.youtubeUrl) ?? "",
        tiktok: optionalSafeUrl(settingsDoc.tiktokUrl) ?? ""
      }
    },
    aboutContent: {
      title: text(settingsDoc.aboutTitle, fallbackContent.aboutContent.title),
      body: text(settingsDoc.aboutBody, fallbackContent.aboutContent.body)
    },
    teamMembers: team.docs.length ? team.docs.map((doc: Record<string, unknown>, index: number) => mapTeamMember(doc, index)) : fallbackContent.teamMembers,
    events: cmsEvents.docs.length
      ? {
          upcoming: cmsEvents.docs.filter((doc: Record<string, unknown>) => doc.status !== "past").map((doc: Record<string, unknown>) => mapEvent(doc, "upcoming")),
          past: cmsEvents.docs.filter((doc: Record<string, unknown>) => doc.status === "past").map((doc: Record<string, unknown>) => mapEvent(doc, "past"))
        }
      : fallbackContent.events,
    gallery: highlights.docs.length ? highlights.docs.map((doc: Record<string, unknown>) => mapHighlight(doc)) : fallbackContent.gallery,
    memberShowcase: members.docs.length ? members.docs.map((doc: Record<string, unknown>) => mapMemberShowcase(doc)) : fallbackContent.memberShowcase,
    gameStats: stats.docs.length ? stats.docs.map((doc: Record<string, unknown>) => mapGameStat(doc)) : fallbackContent.gameStats,
    merchProducts: products.docs.length ? products.docs.map((doc: Record<string, unknown>) => mapProduct(doc)) : fallbackContent.merchProducts
  };
}

const getCachedLandingContent = unstable_cache(loadLandingContentFromCms, ["landing-content"], {
  revalidate: 300,
  tags: ["landing-content"]
});

export async function getLandingContent(): Promise<LandingContent> {
  if (!shouldUseCmsContent()) return fallbackContent;

  try {
    return await getCachedLandingContent();
  } catch (error) {
    logCmsFallback("landing content", error);
    return fallbackContent;
  }
}

const getCachedLegalPageContent = unstable_cache(
  async (slug: "terms" | "privacy" | "community-guidelines") => {
    const fallbackMap = {
      terms: fallbackContent.legalPages.terms,
      privacy: fallbackContent.legalPages.privacy,
      "community-guidelines": fallbackContent.legalPages.guidelines
    };

    const payload = await getCmsPayload();
    const result = await payload.find({
      collection: "legal-pages",
      limit: 1,
      where: {
        slug: {
          equals: slug
        }
      }
    });
    const doc = result.docs[0] as CmsDoc | undefined;

    return {
      title: text(doc?.title, fallbackMap[slug].title),
      description: text(doc?.description, fallbackMap[slug].description),
      content: optionalText(doc?.content) ?? fallbackMap[slug].content
    };
  },
  ["legal-page-content"],
  { revalidate: 300, tags: ["legal-page-content"] }
);

export async function getLegalPageContent(slug: "terms" | "privacy" | "community-guidelines") {
  const fallbackMap = {
    terms: fallbackContent.legalPages.terms,
    privacy: fallbackContent.legalPages.privacy,
    "community-guidelines": fallbackContent.legalPages.guidelines
  };

  if (!shouldUseCmsContent()) return fallbackMap[slug];

  try {
    return await getCachedLegalPageContent(slug);
  } catch (error) {
    logCmsFallback(`${slug} legal page`, error);
    return fallbackMap[slug];
  }
}
