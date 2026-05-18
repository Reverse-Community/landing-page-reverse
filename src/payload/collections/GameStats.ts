import type { CollectionConfig } from "payload";

import { revalidateLandingAfterChange, revalidateLandingAfterDelete } from "../hooks/revalidate";

export const GameStats: CollectionConfig = {
  slug: "game-stats",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "value", "sortOrder"]
  },
  hooks: {
    afterChange: [revalidateLandingAfterChange],
    afterDelete: [revalidateLandingAfterDelete]
  },
  fields: [
    { name: "label", type: "text", required: true },
    { name: "value", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "sortOrder", type: "number", defaultValue: 100 }
  ]
};
