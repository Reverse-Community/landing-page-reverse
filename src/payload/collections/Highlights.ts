import type { CollectionConfig } from "payload";

import { revalidateLandingAfterChange, revalidateLandingAfterDelete } from "../hooks/revalidate";

export const Highlights: CollectionConfig = {
  slug: "highlights",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sortOrder"]
  },
  hooks: {
    afterChange: [revalidateLandingAfterChange],
    afterDelete: [revalidateLandingAfterDelete]
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "caption", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sortOrder", type: "number", defaultValue: 100 }
  ]
};
