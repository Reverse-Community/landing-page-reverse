import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { Events } from "./collections/Events";
import { GameStats } from "./collections/GameStats";
import { Highlights } from "./collections/Highlights";
import { LegalPages } from "./collections/LegalPages";
import { Media } from "./collections/Media";
import { Members } from "./collections/Members";
import { Posts } from "./collections/Posts";
import { Products } from "./collections/Products";
import { TeamMembers } from "./collections/TeamMembers";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const isProduction = process.env.NODE_ENV === "production";

function envOrDevFallback(name: "PAYLOAD_SECRET" | "DATABASE_URL", fallback: string) {
  const value = process.env[name];

  if (value) return value;
  if (!isProduction) return fallback;

  throw new Error(`${name} is required in production.`);
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "../app/(payload)"),
      importMapFile: path.resolve(dirname, "../app/(payload)/admin/importMap.ts")
    }
  },
  collections: [Users, Media, Events, TeamMembers, Highlights, Members, GameStats, Products, LegalPages, Posts],
  globals: [SiteSettings],
  secret: envOrDevFallback("PAYLOAD_SECRET", "reverse-community-dev-secret-change-me"),
  db: postgresAdapter({
    pool: {
      connectionString: envOrDevFallback("DATABASE_URL", "postgres://reverse:reverse_password@localhost:5432/reverse")
    }
  }),
  typescript: {
    outputFile: path.resolve(dirname, "../../payload-types.ts")
  }
});
