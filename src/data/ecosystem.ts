export type EcosystemService = {
  slug: string;
  name: string;
  repo: string;
  path: string;
  zone: string;
  visibility: string;
  status: string;
  role: string;
  stack: string[];
  responsibilities: string[];
  boundaries: string[];
  accent: "red" | "blue";
  publicLink?: string;
};

export const ecosystemServices: EcosystemService[] = [
  {
    slug: "community-core",
    name: "Reverse Community",
    repo: "home-reverse-community",
    path: "E:\\0Kerjaan\\home-reverse-community",
    zone: "Public Community Core",
    visibility: "Public",
    status: "Core aktif",
    role: "Website utama, CMS, event/news, dokumentasi, dan public status untuk seluruh ekosistem Reverse.",
    stack: ["Next.js 16", "React 19", "Payload CMS", "PostgreSQL", "Tailwind CSS"],
    responsibilities: ["Public website", "CMS content", "Events/news", "Bot documentation", "Sanitized status"],
    boundaries: ["Tidak menyimpan token bot", "Tidak mengontrol server/trading", "Tidak menyimpan AI provider credentials"],
    accent: "blue",
    publicLink: "/"
  },
  {
    slug: "discord-bot",
    name: "Reverse Discord Bot",
    repo: "reverse-bot",
    path: "E:\\0Kerjaan\\reverse-bot",
    zone: "Community Bot",
    visibility: "Discord-facing",
    status: "Slash command MVP",
    role: "Bot Discord untuk onboarding, command komunitas, announcement, dan pengirim Discord stats ke website.",
    stack: ["Node.js", "CommonJS", "discord.js"],
    responsibilities: ["Slash commands", "Welcome/help/rules", "Community links", "Future Discord stats sync"],
    boundaries: ["Token tetap di env bot", "Tidak mengontrol ops/trading", "AI hanya lewat key gateway khusus jika diaktifkan"],
    accent: "red"
  },
  {
    slug: "whatsapp-bot",
    name: "Reverse WhatsApp Bot",
    repo: "reverse-wabot",
    path: "E:\\0Kerjaan\\reverse-wabot",
    zone: "Community Bot",
    visibility: "WhatsApp group/private",
    status: "Bot modular aktif",
    role: "Assistant WhatsApp berbasis Baileys untuk AI chat, group utility, memory lokal, dan announcement komunitas.",
    stack: ["Node.js", "CommonJS", "Baileys", "OpenAI-compatible AI"],
    responsibilities: ["WhatsApp commands", "AI assistant", "Group settings", "Future event/news bridge"],
    boundaries: ["Session dan memory tetap private", "Nomor/chat tidak dipublish", "Command sensitif tetap owner/admin gated"],
    accent: "blue"
  },
  {
    slug: "ai-gateway",
    name: "Reverse AI Gateway",
    repo: "reverse-proxy",
    path: "E:\\0Kerjaan\\reverse-proxy",
    zone: "Internal AI Infrastructure",
    visibility: "Private/internal",
    status: "Private gateway",
    role: "OpenAI-compatible router untuk provider/model AI, account pool, router keys, dan dashboard operator.",
    stack: ["Next.js 15", "SQLite", "TypeScript", "Vitest"],
    responsibilities: ["AI routing", "Provider credential vault", "Per-service router keys", "Metadata-only logs"],
    boundaries: ["Dashboard bukan public", "Provider key tidak masuk website", "Setiap bot pakai key terpisah"],
    accent: "red"
  },
  {
    slug: "ops-dashboard",
    name: "Reverse Ops Dashboard",
    repo: "reverse-web-server",
    path: "E:\\0Kerjaan\\reverse-web-server",
    zone: "Private Ops Infrastructure",
    visibility: "VPN/internal only",
    status: "Alpha ops tool",
    role: "Dashboard private untuk monitoring server, file browser/editor, Docker action/logs, audit, dan future host operations.",
    stack: ["Flask", "Socket.IO", "psutil", "Docker SDK", "Gunicorn"],
    responsibilities: ["Server monitoring", "Docker visibility", "File tools", "Audit log"],
    boundaries: ["Tidak public", "Tidak dikontrol bot", "Host-control disabled by default"],
    accent: "blue"
  },
  {
    slug: "trader-lab",
    name: "Reverse Trader Lab",
    repo: "reverse-autotrader",
    path: "E:\\0Kerjaan\\reverse-autotrader",
    zone: "Private Lab/Sandbox",
    visibility: "Private lab",
    status: "Dry-run/demo scaffold",
    role: "Lab Python safety-first untuk riset MT5 XAUUSD dry-run/demo, bukan public trading control.",
    stack: ["Python", "MT5 optional", "pytest"],
    responsibilities: ["Dry-run analysis", "Demo-only gated execution", "Safety research", "Anonymized reports"],
    boundaries: ["Tidak ada live trading public", "Tidak dipicu bot", "Account/broker data tetap private"],
    accent: "red"
  }
];

export const ecosystemPrinciples = [
  "Centralize brand, docs, public content, and safe community workflows in Reverse Community.",
  "Isolate credentials, server control, trading, provider keys, and private chat/session data.",
  "Connect services through narrow APIs, dedicated keys, sanitized status, and explicit ownership.",
  "Avoid monorepo/shared database/control-plane until the ecosystem proves a real need."
];

export const botCommandRoadmap = [
  {
    bot: "Discord",
    commands: ["/ping", "/help", "/community", "/rules", "/socials", "/events"]
  },
  {
    bot: "WhatsApp",
    commands: ["/help", "/ping", "/ai", "/community", "/website", "/events", "/news"]
  }
];
