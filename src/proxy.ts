import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Reverse Admin", charset="UTF-8"'
    }
  });
}

function adminAuthNotConfigured() {
  return new NextResponse("Admin authentication is not configured", { status: 500 });
}

function decodeBasicCredentials(encoded: string) {
  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) return null;

    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch {
    return null;
  }
}

async function secureEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const [aHash, bHash] = await Promise.all([crypto.subtle.digest("SHA-256", encoder.encode(a)), crypto.subtle.digest("SHA-256", encoder.encode(b))]);
  const aBytes = new Uint8Array(aHash);
  const bBytes = new Uint8Array(bHash);
  let diff = 0;

  for (let index = 0; index < aBytes.length; index += 1) {
    diff |= aBytes[index] ^ bBytes[index];
  }

  return diff === 0 && a.length === b.length;
}

export async function proxy(request: NextRequest) {
  if (process.env.ADMIN_BASIC_AUTH_DISABLED === "true") return NextResponse.next();

  const user = process.env.ADMIN_BASIC_USER;
  const password = process.env.ADMIN_BASIC_PASSWORD;

  if (!user || !password) return adminAuthNotConfigured();

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return unauthorized();

  const encoded = authorization.slice("Basic ".length);
  const credentials = decodeBasicCredentials(encoded);
  if (!credentials) return unauthorized();

  const [userMatches, passwordMatches] = await Promise.all([secureEqual(credentials.user, user), secureEqual(credentials.password, password)]);
  if (!userMatches || !passwordMatches) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
