import { NextResponse } from "next/server";
import { getPublicEvents } from "@/lib/public-updates";

export const revalidate = 300;

export async function GET() {
  const data = await getPublicEvents();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
    }
  });
}
