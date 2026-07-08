import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { r2Storage } from "@payloadcms/storage-r2";
import { buildConfig } from "payload";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { GetPlatformProxyOptions } from "wrangler";
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
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined);
const isCLI = process.argv.some((value) => realpath(value)?.endsWith(path.join("payload", "bin.js")));
const isProduction = process.env.NODE_ENV === "production";
const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Mode detection:
 * - VPS mode: set DATABASE_URL to a SQLite file path (e.g. "file:./reverse-community.db")
 * - Cloudflare mode: unset DATABASE_URL, uses D1 binding + R2 storage
 */
const isVpsMode = Boolean(process.env.DATABASE_URL);

function envOrThrow(name: string) {
  const value = process.env[name];
  if (value) return value;
  if (!isProduction) return undefined;
  throw new Error(`${name} is required in production.`);
}

// Cloudflare-compatible logger: replaces pino-pretty which uses Node.js APIs unavailable in Workers
const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === "string") {
      fn(JSON.stringify({ level, msg: objOrMsg }));
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }));
    }
  };

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || "info",
  trace: createLog("trace", console.debug),
  debug: createLog("debug", console.debug),
  info: createLog("info", console.log),
  warn: createLog("warn", console.warn),
  error: createLog("error", console.error),
  fatal: createLog("fatal", console.error),
  silent: () => {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Create a mock D1/R2 binding for build time when Cloudflare is unavailable
function createMockD1(): D1Database {
  return {
    prepare: () => ({
      bind: () => ({ bind: () => ({ bind: () => ({ bind: () => ({}) }) }) }),
      run: async () => ({ success: true, meta: {} }),
      all: async () => ({ results: [], success: true }),
      first: async () => null,
      raw: async () => []
    }),
    dump: async () => new Uint8Array(),
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;
}

function createMockR2(): R2Bucket {
  return {
    put: async () => {},
    get: async () => null,
    delete: async () => {},
    head: async () => null,
    list: async () => ({ objects: [], truncated: false, delimitedPrefixes: [] })
  } as unknown as R2Bucket;
}

async function getCloudflareBindings(): Promise<{ env: any }> {
  // During Next.js build, Cloudflare bindings aren't available — use mocks
  if (isNextBuild) {
    return {
      env: {
        D1: createMockD1(),
        R2: createMockR2()
      }
    };
  }

  // CLI commands (migrate, generate:types, etc.) or local dev: use wrangler platform proxy
  if (isCLI || !isProduction) {
    return import(/* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`).then(
      ({ getPlatformProxy }: typeof import("wrangler")) =>
        getPlatformProxy({
          environment: process.env.CLOUDFLARE_ENV,
          remoteBindings: isProduction
        } satisfies GetPlatformProxyOptions)
    );
  }

  // Production on Workers: use the OpenNext context helper
  return getCloudflareContext({ async: true });
}

// ──────────────────────────────────────────
// Build config — dual-mode
// ──────────────────────────────────────────
const sharedConfig = {
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "../app/(payload)"),
      importMapFile: path.resolve(dirname, "../app/(payload)/admin/importMap.ts")
    }
  },
  collections: [Users, Media, Events, TeamMembers, Highlights, Members, GameStats, Products, LegalPages, Posts],
  globals: [SiteSettings],
  secret: envOrThrow("PAYLOAD_SECRET") || "reverse-community-dev-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "../../payload-types.ts")
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;
let cloudflarePlugins: any[] = [];
let cloudflareLoggerConfig: any = undefined;

if (isVpsMode) {
  // VPS mode: SQLite file via @payloadcms/db-sqlite
  db = sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL
    }
  });
  // No R2 storage — Media collection uses local staticDir (public/uploads/)
} else {
  // Cloudflare mode: D1 binding + R2 storage
  const cloudflare = await getCloudflareBindings();
  db = sqliteD1Adapter({
    binding: cloudflare.env.D1
  });
  cloudflarePlugins = [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: {
        media: {
          prefix: "media"
        }
      }
    })
  ];
  cloudflareLoggerConfig = isProduction ? cloudflareLogger : undefined;
}

export default buildConfig({
  ...sharedConfig,
  db,
  plugins: cloudflarePlugins,
  logger: cloudflareLoggerConfig
});
