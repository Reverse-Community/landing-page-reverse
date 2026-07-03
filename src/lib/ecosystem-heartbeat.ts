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

const HEARTBEAT_DIR = path.join(process.cwd(), ".tmp");
const HEARTBEAT_FILE = path.join(HEARTBEAT_DIR, "ecosystem-heartbeats.json");
const HEARTBEAT_SERVICES_DIR = path.join(HEARTBEAT_DIR, "heartbeats");
const MAX_DETAIL_KEYS = 8;
const MAX_DETAIL_VALUE_LENGTH = 120;

const ALLOWED_SERVICES = new Set(["reverse-discord-bot", "reverse-wabot"]);
const ALLOWED_STATUSES = new Set<HeartbeatStatus>(["online", "degraded", "offline"]);

export function isHeartbeatEnabled() {
  return Boolean(process.env.INTERNAL_API_TOKEN?.trim());
}

export function verifyInternalApiToken(request: Request) {
  const expected = process.env.INTERNAL_API_TOKEN?.trim();
  if (!expected) return false;

  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  const headerToken = request.headers.get("x-internal-api-token")?.trim() || "";

  return bearer === expected || headerToken === expected;
}

export async function readHeartbeats(): Promise<Record<string, HeartbeatRecord>> {
  const legacyRecords = await readLegacyHeartbeats();
  const serviceRecords = await readServiceHeartbeatFiles();
  return { ...legacyRecords, ...serviceRecords };
}

export async function writeHeartbeat(input: HeartbeatInput): Promise<HeartbeatRecord> {
  const record = validateHeartbeatInput(input);

  await mkdir(HEARTBEAT_SERVICES_DIR, { recursive: true });
  const targetFile = path.join(HEARTBEAT_SERVICES_DIR, `${record.service}.json`);
  const tempFile = path.join(HEARTBEAT_SERVICES_DIR, `${record.service}.${randomUUID()}.tmp`);
  await writeFile(tempFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  await rename(tempFile, targetFile);

  return record;
}

async function readLegacyHeartbeats(): Promise<Record<string, HeartbeatRecord>> {
  try {
    const raw = await readFile(HEARTBEAT_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, HeartbeatRecord>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function readServiceHeartbeatFiles(): Promise<Record<string, HeartbeatRecord>> {
  const records: Record<string, HeartbeatRecord> = {};

  for (const service of ALLOWED_SERVICES) {
    try {
      const raw = await readFile(path.join(HEARTBEAT_SERVICES_DIR, `${service}.json`), "utf8");
      const parsed = JSON.parse(raw) as HeartbeatRecord;

      if (parsed && parsed.service === service) {
        records[service] = parsed;
      }
    } catch {
      // Missing or malformed per-service files are ignored so one bad record does not break status reads.
    }
  }

  return records;
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
