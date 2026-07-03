import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";

export const LANDING_CACHE_TAG = "landing-content";
export const LEGAL_CACHE_TAG = "legal-page-content";
export const PUBLIC_EVENTS_CACHE_TAG = "public-events";
export const PUBLIC_NEWS_CACHE_TAG = "public-news";

const REVALIDATE_PROFILE = { expire: 0 } as const;

function bust(tag: string) {
  revalidateTag(tag, REVALIDATE_PROFILE);
}

function bustMany(tags: string[]) {
  for (const tag of tags) bust(tag);
}

export const revalidateLandingAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  bust(LANDING_CACHE_TAG);
  return doc;
};

export const revalidateLandingAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  bust(LANDING_CACHE_TAG);
  return doc;
};

export const revalidateLandingGlobalAfterChange: GlobalAfterChangeHook = ({ doc }) => {
  bust(LANDING_CACHE_TAG);
  return doc;
};

export const revalidateLegalAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  bust(LEGAL_CACHE_TAG);
  return doc;
};

export const revalidateLegalAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  bust(LEGAL_CACHE_TAG);
  return doc;
};

export const revalidateEventsAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  bustMany([LANDING_CACHE_TAG, PUBLIC_EVENTS_CACHE_TAG]);
  return doc;
};

export const revalidateEventsAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  bustMany([LANDING_CACHE_TAG, PUBLIC_EVENTS_CACHE_TAG]);
  return doc;
};

export const revalidateNewsAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  bust(PUBLIC_NEWS_CACHE_TAG);
  return doc;
};

export const revalidateNewsAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  bust(PUBLIC_NEWS_CACHE_TAG);
  return doc;
};
