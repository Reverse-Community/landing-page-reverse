import { NextResponse } from "next/server";
import { isHeartbeatEnabled, readHeartbeats, verifyInternalApiToken, writeHeartbeat } from "@/lib/ecosystem-heartbeat";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isHeartbeatEnabled()) {
    return NextResponse.json({ ok: false, error: "heartbeat_not_configured" }, { status: 503 });
  }

  if (!verifyInternalApiToken(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, heartbeats: await readHeartbeats() });
}

export async function POST(request: Request) {
  if (!isHeartbeatEnabled()) {
    return NextResponse.json({ ok: false, error: "heartbeat_not_configured" }, { status: 503 });
  }

  if (!verifyInternalApiToken(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const record = await writeHeartbeat(await request.json());
    return NextResponse.json({ ok: true, heartbeat: record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid heartbeat payload.";
    return NextResponse.json({ ok: false, error: "bad_request", message }, { status: 400 });
  }
}
