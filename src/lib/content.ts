import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
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
  const payload = await getPayload({ config });
  const [settings, team, cmsEvents, highlights, members, stats, products] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", depth: 1 }),
    payload.find({ collection: "team-members", limit: 40, sort: "sortOrder" }),
    payload.find({ collection: "events", limit: 40, sort: "startsAt" }),
    payload.find({ collection: "highlights", limit: 12, sort: "sortOrder" }),
    payload.find({ collection: "members", limit: 12, sort: "sortOrder" }),
    payload.find({ collection: "game-stats", limit: 12, sort: "sortOrder" }),
    payload.find({ collection: "products", limit: 12, sort: "sortOrder" })
  ]);

  const settingsDoc = settings as CmsDoc;

  return {
    ...fallbackContent,
    siteConfig: {
      ...fallbackContent.siteConfig,
      tagline: {
        id: text(settingsDoc.taglineId, fallbackContent.siteConfig.tagline.id),
        en: text(settingsDoc.taglineEn, fallbackContent.siteConfig.tagline.en)
      }
    },
    aboutContent: {
      title: text(settingsDoc.aboutTitle, fallbackContent.aboutContent.title),
      body: text(settingsDoc.aboutBody, fallbackContent.aboutContent.body)
    },
    teamMembers: team.docs.length
      ? team.docs.map((doc, index) => ({
          name: text((doc as CmsDoc).name, "Member"),
          role: text((doc as CmsDoc).role, "Team"),
          city: text((doc as CmsDoc).city, "Indonesia"),
          accent: index % 2 === 0 ? "red" : "blue"
        }))
      : fallbackContent.teamMembers,
    events: cmsEvents.docs.length
      ? {
          upcoming: cmsEvents.docs
            .filter((doc) => (doc as CmsDoc).status !== "past")
            .map((doc) => ({ date: text((doc as CmsDoc).displayDate, "Soon"), title: text((doc as CmsDoc).title, "Reverse Event"), tag: text((doc as CmsDoc).tag, "Event"), description: text((doc as CmsDoc).description, "Event komunitas Reverse.") })),
          past: cmsEvents.docs
            .filter((doc) => (doc as CmsDoc).status === "past")
            .map((doc) => ({ date: text((doc as CmsDoc).displayDate, "Past"), title: text((doc as CmsDoc).title, "Reverse Event"), tag: text((doc as CmsDoc).tag, "Event"), description: text((doc as CmsDoc).description, "Event komunitas Reverse.") }))
        }
      : fallbackContent.events,
    gallery: highlights.docs.length
      ? highlights.docs.map((doc) => ({ title: text((doc as CmsDoc).title, "Highlight"), caption: text((doc as CmsDoc).caption, "Momen komunitas Reverse.") }))
      : fallbackContent.gallery,
    memberShowcase: members.docs.length
      ? members.docs.map((doc) => ({ name: text((doc as CmsDoc).name, "Member"), role: text((doc as CmsDoc).role, "Member"), game: text((doc as CmsDoc).favoriteGame, "Community"), quote: text((doc as CmsDoc).quote, "Proud member of Reverse.") }))
      : fallbackContent.memberShowcase,
    gameStats: stats.docs.length
      ? stats.docs.map((doc) => ({ label: text((doc as CmsDoc).label, "Metric"), value: text((doc as CmsDoc).value, "0"), description: text((doc as CmsDoc).description, "Stat komunitas.") }))
      : fallbackContent.gameStats,
    merchProducts: products.docs.length
      ? products.docs.map((doc) => ({ name: text((doc as CmsDoc).name, "Product"), price: text((doc as CmsDoc).price, "Coming soon"), status: text((doc as CmsDoc).status, "Concept") }))
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

    const payload = await getPayload({ config });
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
      description: text(doc?.description, fallbackMap[slug].description)
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
