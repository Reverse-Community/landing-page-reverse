import type { CollectionConfig } from "payload";

import { revalidateLandingAfterChange, revalidateLandingAfterDelete } from "../hooks/revalidate";

export const Members: CollectionConfig = {
  slug: "members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "favoriteGame"]
  },
  hooks: {
    afterChange: [revalidateLandingAfterChange],
    afterDelete: [revalidateLandingAfterDelete]
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "favoriteGame", type: "text", required: true },
    { name: "quote", type: "textarea", required: true },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "sortOrder", type: "number", defaultValue: 100 }
  ]
};
