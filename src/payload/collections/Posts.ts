import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt"]
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea" },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "content", type: "textarea", admin: { rows: 16 } },
    { name: "publishedAt", type: "date" }
  ]
};
