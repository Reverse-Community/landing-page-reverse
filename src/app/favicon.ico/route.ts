const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="32" fill="#050507"/>
  <path d="M25 86V34h42c19 0 31 10 31 26 0 11-6 19-16 23l20 11H75L58 84h-12v10H25v-8Zm21-20h20c7 0 11-3 11-8s-4-8-11-8H46v16Z" fill="#f3f4f6"/>
  <path d="M18 95h92" stroke="#ff2d2d" stroke-width="8" stroke-linecap="round"/>
  <path d="M18 103h68" stroke="#2d7dff" stroke-width="8" stroke-linecap="round"/>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
