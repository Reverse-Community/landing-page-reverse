import { NextResponse } from "next/server";
import { getDiscordStats } from "@/lib/discord";

export const revalidate = 300;

export async function GET() {
  const stats = await getDiscordStats();

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
    }
  });
}
