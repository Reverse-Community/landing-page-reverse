import { NextResponse } from "next/server";
import { isHeartbeatEnabled, verifyInternalApiToken } from "@/lib/ecosystem-heartbeat";
import { readDiscordGuildSnapshot, writeDiscordGuildSnapshot } from "@/lib/discord-snapshot";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isHeartbeatEnabled()) {
    return NextResponse.json({ ok: false, error: "internal_api_not_configured" }, { status: 503 });
  }

  if (!verifyInternalApiToken(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, snapshot: await readDiscordGuildSnapshot() });
}

export async function POST(request: Request) {
  if (!isHeartbeatEnabled()) {
    return NextResponse.json({ ok: false, error: "internal_api_not_configured" }, { status: 503 });
  }

  if (!verifyInternalApiToken(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await writeDiscordGuildSnapshot(await request.json());
    return NextResponse.json({ ok: true, snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Discord guild snapshot payload.";
    return NextResponse.json({ ok: false, error: "bad_request", message }, { status: 400 });
  }
}
