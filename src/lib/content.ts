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
    teamMembers: team.docs.length
      ? team.docs.map((doc, index) => {
          const cmsDoc = doc as CmsDoc;
          return {
            name: text(cmsDoc.name, "Member"),
            role: text(cmsDoc.role, "Team"),
            city: text(cmsDoc.city, "Indonesia"),
            accent: (index % 2 === 0 ? "red" : "blue") as "red" | "blue",
            imageUrl: mediaUrl(cmsDoc.photo) ?? null,
            links: teamLinks(cmsDoc.links)
          };
        })
      : fallbackContent.teamMembers,
    events: cmsEvents.docs.length
      ? {
          upcoming: cmsEvents.docs
            .filter((doc) => (doc as CmsDoc).status !== "past")
            .map((doc) => {
              const cmsDoc = doc as CmsDoc;
              return {
                date: text(cmsDoc.displayDate, "Soon"),
                title: text(cmsDoc.title, "Reverse Event"),
                tag: text(cmsDoc.tag, "Event"),
                description: text(cmsDoc.description, "Event komunitas Reverse."),
                location: optionalText(cmsDoc.location) ?? null,
                imageUrl: mediaUrl(cmsDoc.cover) ?? null
              };
            }),
          past: cmsEvents.docs
            .filter((doc) => (doc as CmsDoc).status === "past")
            .map((doc) => {
              const cmsDoc = doc as CmsDoc;
              return {
                date: text(cmsDoc.displayDate, "Past"),
                title: text(cmsDoc.title, "Reverse Event"),
                tag: text(cmsDoc.tag, "Event"),
                description: text(cmsDoc.description, "Event komunitas Reverse."),
                location: optionalText(cmsDoc.location) ?? null,
                imageUrl: mediaUrl(cmsDoc.cover) ?? null
              };
            })
        }
      : fallbackContent.events,
    gallery: highlights.docs.length
      ? highlights.docs.map((doc) => {
          const cmsDoc = doc as CmsDoc;
          return {
            title: text(cmsDoc.title, "Highlight"),
            caption: text(cmsDoc.caption, "Momen komunitas Reverse."),
            imageUrl: mediaUrl(cmsDoc.image) ?? null
          };
        })
      : fallbackContent.gallery,
    memberShowcase: members.docs.length
      ? members.docs.map((doc) => {
          const cmsDoc = doc as CmsDoc;
          return {
            name: text(cmsDoc.name, "Member"),
            role: text(cmsDoc.role, "Member"),
            game: text(cmsDoc.favoriteGame, "Community"),
            quote: text(cmsDoc.quote, "Proud member of Reverse."),
            imageUrl: mediaUrl(cmsDoc.avatar) ?? null
          };
        })
      : fallbackContent.memberShowcase,
    gameStats: stats.docs.length
      ? stats.docs.map((doc) => {
          const cmsDoc = doc as CmsDoc;
          return {
            label: text(cmsDoc.label, "Metric"),
            value: text(cmsDoc.value, "0"),
            description: text(cmsDoc.description, "Stat komunitas.")
          };
        })
      : fallbackContent.gameStats,
    merchProducts: products.docs.length
      ? products.docs.map((doc) => {
          const cmsDoc = doc as CmsDoc;
          return {
            name: text(cmsDoc.name, "Product"),
            price: text(cmsDoc.price, "Coming soon"),
            status: text(cmsDoc.status, "Concept"),
            imageUrl: mediaUrl(cmsDoc.image) ?? null
          };
        })
      : fallbackContent.merchProducts
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
