import type { CollectionConfig } from "payload";

import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
// Resolve to <project-root>/public/uploads regardless of cwd or build location
const staticDir = path.resolve(dirname, "../../../public/uploads");

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true
  },
  upload: {
    staticDir,
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 240, height: 240, position: "centre" },
      { name: "card", width: 768, height: 576, position: "centre" },
      { name: "feature", width: 1600 }
    ]
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
