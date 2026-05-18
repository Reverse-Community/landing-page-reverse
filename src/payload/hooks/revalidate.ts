import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

import { revalidateTag } from "next/cache";

export const LANDING_CACHE_TAG = "landing-content";
export const LEGAL_CACHE_TAG = "legal-page-content";

const REVALIDATE_PROFILE = { expire: 0 } as const;

function bust(tag: string) {
  revalidateTag(tag, REVALIDATE_PROFILE);
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
