import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type DiscordGuildSnapshot = {
  guildId: string;
  guildName?: string;
  memberCount?: number;
  channelCount?: number;
  roleCount?: number;
  capturedAt: string;
  receivedAt: string;
};

export type DiscordGuildSnapshotInput = {
  guildId?: unknown;
  guildName?: unknown;
  memberCount?: unknown;
  channelCount?: unknown;
  roleCount?: unknown;
  capturedAt?: unknown;
};

const KV_KEY = "discord:guild-snapshot";
const MAX_SNAPSHOT_AGE_MS = 10 * 60 * 1000;

// ---- KV helpers for Cloudflare Workers ----

function getKvNamespace(): KVNamespace | undefined {
  return process.env.REVERSE_KV as unknown as KVNamespace | undefined;
}

async function kvWrite(value: DiscordGuildSnapshot): Promise<void> {
  try {
    const kv = getKvNamespace();
    if (kv) {
      await kv.put(KV_KEY, JSON.stringify(value));
      return;
    }
  } catch {
    // Fall through
  }
  // Fallback to local file
  await legacyWrite(value);
}

async function kvRead(): Promise<DiscordGuildSnapshot | null> {
  try {
    const kv = getKvNamespace();
    if (kv) {
      const raw = await kv.get(KV_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DiscordGuildSnapshot;
        return parsed && typeof parsed === "object" && typeof parsed.guildId === "string"
          ? parsed
          : null;
      }
    }
  } catch {
    // Fall through
  }
  return null;
}

// ---- Legacy filesystem fallback ----

const SNAPSHOT_DIR = path.join(process.cwd(), ".tmp");
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, "discord-guild-snapshot.json");

async function legacyWrite(snapshot: DiscordGuildSnapshot): Promise<void> {
  await mkdir(SNAPSHOT_DIR, { recursive: true });
  await writeFile(SNAPSHOT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

async function legacyRead(): Promise<DiscordGuildSnapshot | null> {
  try {
    const raw = await readFile(SNAPSHOT_FILE, "utf8");
    const parsed = JSON.parse(raw) as DiscordGuildSnapshot;
    return parsed && typeof parsed === "object" && typeof parsed.guildId === "string"
      ? parsed
      : null;
  } catch {
    return null;
  }
}

// ---- Public API ----

export async function readDiscordGuildSnapshot(): Promise<DiscordGuildSnapshot | null> {
  return kvRead();
}

export async function readFreshDiscordGuildSnapshot(maxAgeMs = MAX_SNAPSHOT_AGE_MS) {
  const snapshot = await readDiscordGuildSnapshot();
  if (!snapshot) return null;

  const receivedAt = new Date(snapshot.receivedAt).getTime();
  if (!Number.isFinite(receivedAt)) return null;

  return Date.now() - receivedAt <= maxAgeMs ? snapshot : null;
}

export async function writeDiscordGuildSnapshot(input: DiscordGuildSnapshotInput): Promise<DiscordGuildSnapshot> {
  const snapshot = validateSnapshotInput(input);
  await kvWrite(snapshot);
  return snapshot;
}

function validateSnapshotInput(input: DiscordGuildSnapshotInput): DiscordGuildSnapshot {
  const guildId = typeof input.guildId === "string" ? input.guildId.trim() : "";
  if (!/^\d{8,32}$/.test(guildId)) {
    throw new Error("Invalid guildId.");
  }

  const guildName = typeof input.guildName === "string" && input.guildName.trim() ? input.guildName.trim().slice(0, 100) : undefined;
  const capturedAt = typeof input.capturedAt === "string" && Number.isFinite(new Date(input.capturedAt).getTime()) ? input.capturedAt : new Date().toISOString();

  return {
    guildId,
    guildName,
    memberCount: optionalNonNegativeInteger(input.memberCount, "memberCount"),
    channelCount: optionalNonNegativeInteger(input.channelCount, "channelCount"),
    roleCount: optionalNonNegativeInteger(input.roleCount, "roleCount"),
    capturedAt,
    receivedAt: new Date().toISOString()
  };
}

function optionalNonNegativeInteger(value: unknown, fieldName: string) {
  if (typeof value === "undefined" || value === null) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }

  return value;
}
