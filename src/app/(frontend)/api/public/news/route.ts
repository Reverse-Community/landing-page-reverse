import { NextResponse } from "next/server";
import { getPublicNews } from "@/lib/public-updates";

export const revalidate = 300;

export async function GET() {
  const data = await getPublicNews();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
    }
  });
}
