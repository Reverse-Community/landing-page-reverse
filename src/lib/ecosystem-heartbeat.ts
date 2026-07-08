import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type HeartbeatStatus = "online" | "degraded" | "offline";

export type HeartbeatRecord = {
  service: string;
  status: HeartbeatStatus;
  version?: string;
  details?: Record<string, string | number | boolean>;
  receivedAt: string;
};

export type HeartbeatInput = {
  service?: unknown;
  status?: unknown;
  version?: unknown;
  details?: unknown;
};

const MAX_DETAIL_KEYS = 8;
const MAX_DETAIL_VALUE_LENGTH = 120;

const ALLOWED_SERVICES = new Set(["reverse-discord-bot", "reverse-wabot"]);
const ALLOWED_STATUSES = new Set<HeartbeatStatus>(["online", "degraded", "offline"]);

// ---- KV helpers for Cloudflare Workers ----

const KV_PREFIX = "heartbeat:";
const KV_SERVICES_KEY = `${KV_PREFIX}services`;

function getKvNamespace(): KVNamespace | undefined {
  // In Workers runtime, process.env.REVERSE_KV is the KVNamespace binding
  return process.env.REVERSE_KV as unknown as KVNamespace | undefined;
}

async function kvRead<T>(key: string): Promise<T | null> {
  try {
    const kv = getKvNamespace();
    if (kv) {
      const raw = await kv.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }
  } catch {
    // Fall through to file-based fallback
  }
  return null;
}

async function kvWriteRecord(key: string, record: HeartbeatRecord): Promise<void> {
  try {
    const kv = getKvNamespace();
    if (kv) {
      await kv.put(key, JSON.stringify(record));
      return;
    }
  } catch {
    // Fall through to file-based fallback
  }
  // Fallback: write to local filesystem
  await legacyWrite(key, record);
}

async function kvListServices(): Promise<string[]> {
  try {
    const kv = getKvNamespace();
    if (kv) {
      const raw = await kv.get(KV_SERVICES_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    }
  } catch {
    // Fall through
  }
  return [];
}

async function kvAddService(service: string): Promise<void> {
  try {
    const kv = getKvNamespace();
    if (kv) {
      const services = await kvListServices();
      if (!services.includes(service)) {
        services.push(service);
        await kv.put(KV_SERVICES_KEY, JSON.stringify(services));
      }
      return;
    }
  } catch {
    // Fall through
  }
}

// ---- Legacy filesystem fallback (for local dev without KV) ----

const LEGACY_HEARTBEAT_DIR = path.join(process.cwd(), ".tmp");
const LEGACY_HEARTBEAT_FILE = path.join(LEGACY_HEARTBEAT_DIR, "ecosystem-heartbeats.json");
const LEGACY_SERVICES_DIR = path.join(LEGACY_HEARTBEAT_DIR, "heartbeats");

async function legacyReadAll(): Promise<Record<string, HeartbeatRecord>> {
  const records: Record<string, HeartbeatRecord> = {};

  try {
    // Legacy single-file format
    const raw = await readFile(LEGACY_HEARTBEAT_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, HeartbeatRecord>;
    if (parsed && typeof parsed === "object") {
      Object.assign(records, parsed);
    }
  } catch {
    // Ignore
  }

  // Per-service files (newer legacy format)
  for (const service of ALLOWED_SERVICES) {
    try {
      const raw = await readFile(path.join(LEGACY_SERVICES_DIR, `${service}.json`), "utf8");
      const parsed = JSON.parse(raw) as HeartbeatRecord;
      if (parsed && parsed.service === service) {
        records[service] = parsed;
      }
    } catch {
      // Ignore missing or malformed per-service files
    }
  }

  return records;
}

async function legacyWrite(key: string, record: HeartbeatRecord): Promise<void> {
  // Determine the service name from key
  const serviceName = key.startsWith(KV_PREFIX) ? key.slice(KV_PREFIX.length) : key;

  await mkdir(LEGACY_SERVICES_DIR, { recursive: true });
  const targetFile = path.join(LEGACY_SERVICES_DIR, `${serviceName}.json`);
  const tempFile = path.join(LEGACY_SERVICES_DIR, `${serviceName}.${randomUUID()}.tmp`);
  await writeFile(tempFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  await rename(tempFile, targetFile);
}

// ---- Public API ----

export function isHeartbeatEnabled() {
  return Boolean(process.env.INTERNAL_API_TOKEN?.trim()) || Boolean(getKvNamespace());
}

export function verifyInternalApiToken(request: Request) {
  const expected = process.env.INTERNAL_API_TOKEN?.trim();
  if (!expected) return true; // Allow if not configured (dev mode)

  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  const headerToken = request.headers.get("x-internal-api-token")?.trim() || "";

  return bearer === expected || headerToken === expected;
}

export async function readHeartbeats(): Promise<Record<string, HeartbeatRecord>> {
  // Try KV first
  const kv = getKvNamespace();
  if (kv) {
    const services = await kvListServices();
    const records: Record<string, HeartbeatRecord> = {};

    for (const service of services) {
      const raw = await kv.get(`${KV_PREFIX}${service}`);
      if (raw) {
        try {
          const record = JSON.parse(raw) as HeartbeatRecord;
          if (record && record.service === service) {
            records[service] = record;
          }
        } catch {
          // Skip malformed
        }
      }
    }

    return records;
  }

  // Fallback to legacy filesystem
  return legacyReadAll();
}

export async function writeHeartbeat(input: HeartbeatInput): Promise<HeartbeatRecord> {
  const record = validateHeartbeatInput(input);

  // Write to KV (or fallback)
  await kvWriteRecord(`${KV_PREFIX}${record.service}`, record);
  await kvAddService(record.service);

  return record;
}

export function heartbeatAge(receivedAt?: string) {
  if (!receivedAt) return null;
  const timestamp = new Date(receivedAt).getTime();
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Date.now() - timestamp);
}

export function isHeartbeatStale(receivedAt?: string, staleAfterMs = 3 * 60 * 1000) {
  const age = heartbeatAge(receivedAt);
  return age == null || age > staleAfterMs;
}

export function formatHeartbeatAge(receivedAt?: string) {
  const age = heartbeatAge(receivedAt);
  if (age == null) return "Belum ada heartbeat";

  const seconds = Math.floor(age / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function validateHeartbeatInput(input: HeartbeatInput): HeartbeatRecord {
  const service = typeof input.service === "string" ? input.service.trim() : "";
  if (!ALLOWED_SERVICES.has(service)) {
    throw new Error("Unsupported heartbeat service.");
  }

  const status = typeof input.status === "string" ? input.status.trim() : "online";
  if (!ALLOWED_STATUSES.has(status as HeartbeatStatus)) {
    throw new Error("Unsupported heartbeat status.");
  }

  const version = typeof input.version === "string" && input.version.trim() ? input.version.trim().slice(0, 40) : undefined;

  return {
    service,
    status: status as HeartbeatStatus,
    version,
    details: sanitizeDetails(input.details),
    receivedAt: new Date().toISOString()
  };
}

function sanitizeDetails(value: unknown): Record<string, string | number | boolean> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;

  const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_DETAIL_KEYS);
  const details: Record<string, string | number | boolean> = {};

  for (const [key, rawValue] of entries) {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
    if (!safeKey) continue;

    if (typeof rawValue === "string") {
      details[safeKey] = rawValue.slice(0, MAX_DETAIL_VALUE_LENGTH);
    } else if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      details[safeKey] = rawValue;
    } else if (typeof rawValue === "boolean") {
      details[safeKey] = rawValue;
    }
  }

  return Object.keys(details).length ? details : undefined;
}
