import type { GlobalConfig } from "payload";

import { revalidateLandingGlobalAfterChange } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  hooks: {
    afterChange: [revalidateLandingGlobalAfterChange]
  },
  fields: [
    { name: "taglineId", type: "text", required: true, defaultValue: "Tempat ngobrol, mabar, belajar, dan tumbuh bareng." },
    { name: "taglineEn", type: "text", required: true, defaultValue: "A place to connect, play, learn, and grow together." },
    { name: "aboutTitle", type: "text", defaultValue: "Komunitas yang terasa seperti rumah kedua." },
    { name: "aboutBody", type: "textarea", defaultValue: "Reverse Community dibangun sebagai ruang digital untuk orang-orang yang ingin punya koneksi sehat: bisa mabar, ngobrol random, belajar hal baru, dan ikut membentuk culture komunitas dari awal." },
    { name: "discordInviteUrl", type: "text" },
    { name: "instagramUrl", type: "text" },
    { name: "youtubeUrl", type: "text" },
    { name: "tiktokUrl", type: "text" }
  ]
};
