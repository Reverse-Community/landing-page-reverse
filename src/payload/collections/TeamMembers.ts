import type { CollectionConfig } from "payload";

import { revalidateLandingAfterChange, revalidateLandingAfterDelete } from "../hooks/revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "city"]
  },
  hooks: {
    afterChange: [revalidateLandingAfterChange],
    afterDelete: [revalidateLandingAfterDelete]
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "city", type: "text" },
    { name: "sortOrder", type: "number", defaultValue: 100 },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "links",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true }
      ]
    }
  ]
};
