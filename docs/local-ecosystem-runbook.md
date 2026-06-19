# Reverse Local Ecosystem Runbook

Panduan ini untuk menjalankan ekosistem Reverse secara lokal dengan aman dan konsisten. Fokusnya development/local test, bukan production hardening.

## Service map lokal

| Service | Path | Default command | Default local URL |
| --- | --- | --- | --- |
| Reverse Community Website | `E:\0Kerjaan\home-reverse-community` | `npm run dev` | `http://localhost:3000` |
| Reverse Discord Bot | `E:\0Kerjaan\reverse-bot` | `npm start` | long-running bot process |
| Reverse WhatsApp Bot | `E:\0Kerjaan\reverse-wabot` | `npm start` | long-running bot process |
| Reverse AI Gateway | `E:\0Kerjaan\reverse-proxy` | `npm run dev` | `http://localhost:7878` |
| Reverse Ops Dashboard | `E:\0Kerjaan\reverse-web-server` | see project README | private only |
| Reverse Trader Lab | `E:\0Kerjaan\reverse-autotrader` | see project README | private lab only |

## Safety rules

- Do not paste real tokens, API keys, WhatsApp sessions, database URLs, or broker credentials into chat, docs, commits, screenshots, or logs.
- Keep `reverse-web-server` and `reverse-autotrader` private; do not connect them to public bot commands.
- Keep `reverse-proxy` dashboard private. Use it as an AI gateway, not as a public community page.
- For local testing, use localhost URLs. For production, use HTTPS and private/internal access where needed.

## Env checklist

### `home-reverse-community/.env`

Minimum for public site + internal ecosystem API:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/FpTcm5VYTt
DISCORD_GUILD_ID=1065486356513554522
ENABLE_CMS_CONTENT=false
INTERNAL_API_TOKEN=local_random_internal_token
```

CMS is optional for local fallback mode. If `ENABLE_CMS_CONTENT=true`, also configure `DATABASE_URL`, `PAYLOAD_SECRET`, and admin env values.

### `reverse-bot/.env`

Minimum for Discord bot + website integration:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
GUILD_ID=1065486356513554522
DISCORD_GUILD_ID=1065486356513554522
BOT_STATUS=Reverse Community

REVERSE_SITE_URL=http://localhost:3000
REVERSE_PUBLIC_API_BASE_URL=http://localhost:3000
REVERSE_API_BASE_URL=http://localhost:3000
REVERSE_INTERNAL_API_TOKEN=local_random_internal_token
HEARTBEAT_INTERVAL_MS=60000
GUILD_SNAPSHOT_INTERVAL_MS=300000
```

`REVERSE_INTERNAL_API_TOKEN` must match `INTERNAL_API_TOKEN` in `home-reverse-community`.

### `reverse-wabot/.env`

Minimum for WhatsApp bot + website integration:

```env
BOT_NAME=Reverse Bot
BOT_PREFIX=/
NODE_ENV=development
DATA_DIR=./data
OWNER_NUMBERS=628xxxxxxxxxx

AI_PROVIDER=openai-compatible
AI_BASE_URL=http://127.0.0.1:7878/v1
AI_API_KEY=router_key_khusus_reverse_wabot
AI_MODEL=model-id-dari-reverse-proxy
AI_SYSTEM_PROMPT=Kamu adalah Reverse Bot, asisten WhatsApp yang ramah, ringkas, dan membantu.

MEMORY_MAX_MESSAGES=20
MEMORY_MAX_CHARS=12000
LOG_LEVEL=info

REVERSE_SITE_URL=http://localhost:3000
REVERSE_PUBLIC_API_BASE_URL=http://localhost:3000
DISCORD_INVITE_URL=https://discord.gg/FpTcm5VYTt
REVERSE_API_BASE_URL=http://localhost:3000
REVERSE_INTERNAL_API_TOKEN=local_random_internal_token
HEARTBEAT_INTERVAL_MS=60000
```

If you are not using Reverse Proxy yet, `AI_BASE_URL` can point to another OpenAI-compatible endpoint.

### `reverse-proxy/.env`

Minimum local AI gateway setup:

```env
APP_ACCESS_TOKEN=local_dashboard_password
APP_ENCRYPTION_KEY=long_random_secret_at_least_32_chars
APP_REQUIRE_HTTPS=false
ROUTER_KEY_REQUESTS_PER_MINUTE=60
ROUTER_KEY_MAX_CONCURRENCY=5
MAX_CHAT_BODY_BYTES=1048576
```

Then use the dashboard to add provider/account credentials and create a router key for `reverse-wabot`.

## Recommended start order

Open separate terminals for each service.

### 1. Start website

```powershell
cd E:\0Kerjaan\home-reverse-community
npm run dev
```

Verify:

```txt
http://localhost:3000
http://localhost:3000/projects
http://localhost:3000/bots
http://localhost:3000/status
http://localhost:3000/api/public/events
http://localhost:3000/api/public/news
```

### 2. Start Reverse AI Gateway, if needed

```powershell
cd E:\0Kerjaan\reverse-proxy
npm run dev
```

Verify:

```txt
http://localhost:7878/api/health
http://localhost:7878/dashboard
```

Create a router key in `/dashboard/keys`, then put it into `reverse-wabot/.env` as `AI_API_KEY`.

### 3. Register Discord slash commands

Run this after adding/changing commands:

```powershell
cd E:\0Kerjaan\reverse-bot
npm run deploy:commands
```

### 4. Start Discord bot

```powershell
cd E:\0Kerjaan\reverse-bot
npm start
```

Expected logs include:

```txt
Reverse bot is online as ...
Heartbeat sent to Reverse Community API.
Discord guild snapshot sent to Reverse Community API.
```

Manual Discord checks:

```txt
/ping
/help
/community
/events
/news
/rules
/socials
```

### 5. Start WhatsApp bot

```powershell
cd E:\0Kerjaan\reverse-wabot
npm start
```

Scan QR if needed.

Manual WhatsApp checks:

```txt
/ping
/help
/community
/website
/events
/news
/ai halo
```

## Smoke test commands

### Website checks

```powershell
cd E:\0Kerjaan\home-reverse-community
npm run lint
npm run typecheck
npm run build
```

### Discord bot checks

```powershell
cd E:\0Kerjaan\reverse-bot
npm test
```

### WhatsApp bot checks

```powershell
cd E:\0Kerjaan\reverse-wabot
npm run check
npm run test:intents
```

### Reverse Proxy checks

```powershell
cd E:\0Kerjaan\reverse-proxy
npm run typecheck
npm test
npm run build
```

## API smoke tests

Use a temporary token variable that matches `INTERNAL_API_TOKEN`.

### Heartbeat endpoint

```powershell
$token = "local_random_internal_token"
Invoke-RestMethod -Uri "http://localhost:3000/api/internal/v1/heartbeat" `
  -Method Post `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"service":"reverse-discord-bot","status":"online","version":"local","details":{"guilds":1}}'
```

### Discord guild snapshot endpoint

```powershell
$token = "local_random_internal_token"
Invoke-RestMethod -Uri "http://localhost:3000/api/internal/v1/discord/guild-snapshot" `
  -Method Post `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"guildId":"1065486356513554522","guildName":"Reverse Community","memberCount":123,"channelCount":10,"roleCount":5}'
```

### Public content APIs

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/public/events"
Invoke-RestMethod -Uri "http://localhost:3000/api/public/news"
Invoke-RestMethod -Uri "http://localhost:3000/api/discord-stats"
```

## Expected local integration behavior

- `/status` shows manual/static status first.
- After bots start, Discord/WhatsApp rows show `Runtime: online · ... ago`.
- `/api/discord-stats` prefers fresh Discord bot snapshot for total members.
- Discord `/events` and `/news` read from website public API.
- WhatsApp `/events` and `/news` read from website public API.
- If website public API is down, bot commands fall back to safe links.

## Shutdown order

Stop long-running processes with `Ctrl+C`:

1. WhatsApp bot
2. Discord bot
3. Reverse Proxy
4. Website

Do not delete WhatsApp auth/session folders unless you intentionally want to re-login by QR.

## Troubleshooting

### `/status` does not show live bot runtime

- Confirm website has `INTERNAL_API_TOKEN`.
- Confirm bot has matching `REVERSE_INTERNAL_API_TOKEN`.
- Confirm bot `REVERSE_API_BASE_URL` points to the website base URL.
- Check bot logs for heartbeat warnings.

### Discord stats still use fallback

- Confirm `DISCORD_GUILD_ID` or `GUILD_ID` is set in `reverse-bot`.
- Confirm bot has sent guild snapshot successfully.
- Confirm snapshot is fresh; it expires after around 10 minutes.

### `/events` or `/news` fallback to links

- Confirm `REVERSE_PUBLIC_API_BASE_URL` points to the website.
- Check `GET /api/public/events` and `GET /api/public/news` directly.
- If CMS is disabled, fallback items are expected.

### WhatsApp AI does not respond

- Confirm `AI_BASE_URL` ends with `/v1`.
- Confirm `AI_API_KEY` is a valid router/provider key.
- Test `GET {AI_BASE_URL}/models` with the key.
- Check `reverse-proxy` dashboard logs if using Reverse Proxy.
