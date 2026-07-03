import type { CollectionConfig } from "payload";

import { revalidateEventsAfterChange, revalidateEventsAfterDelete } from "../hooks/revalidate";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "startsAt"]
  },
  hooks: {
    afterChange: [revalidateEventsAfterChange],
    afterDelete: [revalidateEventsAfterDelete]
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "displayDate", type: "text", admin: { description: "Example: 18 Jun 2026 or Soon" } },
    { name: "tag", type: "text", defaultValue: "Event" },
    { name: "description", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "upcoming",
      options: [
        { label: "Upcoming", value: "upcoming" },
        { label: "Past", value: "past" }
      ]
    },
    { name: "startsAt", type: "date", required: true },
    { name: "endsAt", type: "date" },
    { name: "sortOrder", type: "number", defaultValue: 100 },
    { name: "location", type: "text" },
    { name: "cover", type: "upload", relationTo: "media" }
  ]
};
