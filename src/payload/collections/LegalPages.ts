import type { CollectionConfig } from "payload";

import { revalidateLegalAfterChange, revalidateLegalAfterDelete } from "../hooks/revalidate";

export const LegalPages: CollectionConfig = {
  slug: "legal-pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["slug", "title"]
  },
  hooks: {
    afterChange: [revalidateLegalAfterChange],
    afterDelete: [revalidateLegalAfterDelete]
  },
  fields: [
    {
      name: "slug",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Terms", value: "terms" },
        { label: "Privacy", value: "privacy" },
        { label: "Community Guidelines", value: "community-guidelines" }
      ]
    },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "content", type: "textarea", admin: { rows: 12 } }
  ]
};
