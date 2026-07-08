// Cloudflare lean-mode: Payload API hanya aktif jika DATABASE_URL diset (VPS mode).

function handler(verb: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS") {
  return async (request: Request, props: { params: Promise<{ slug: string[] }> }) => {
    if (!process.env.DATABASE_URL) {
      return new Response("CMS API tidak tersedia di Cloudflare lean mode.", { status: 503 });
    }

    const [{ default: config }, routes] = await Promise.all([
      import("@payload-config"),
      import("@payloadcms/next/routes")
    ]);

    const key = `REST_${verb}` as const;
    return (routes as any)[key](config)(request, props);
  };
}

export const GET = handler("GET");
export const POST = handler("POST");
export const PATCH = handler("PATCH");
export const DELETE = handler("DELETE");
export const OPTIONS = handler("OPTIONS");
