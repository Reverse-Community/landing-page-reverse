import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "public/uploads",
    mimeTypes: ["image/*"]
  },
  admin: {
    useAsTitle: "alt"
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true
    }
  ]
};
