import type { CollectionConfig } from "payload";

import { revalidateLandingAfterChange, revalidateLandingAfterDelete } from "../hooks/revalidate";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status", "price"]
  },
  hooks: {
    afterChange: [revalidateLandingAfterChange],
    afterDelete: [revalidateLandingAfterDelete]
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "price", type: "text", defaultValue: "Coming soon" },
    { name: "status", type: "text", defaultValue: "Concept" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sortOrder", type: "number", defaultValue: 100 }
  ]
};
