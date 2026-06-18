# Reverse Ecosystem Blueprint

Dokumen ini menjadi peta awal untuk menjaga semua project **Reverse** tetap satu ekosistem, tetapi tidak saling mencampur risiko. Prinsip utama: pusatkan brand, konten publik, dokumentasi, dan workflow komunitas yang aman di website; isolasi credential, server control, trading/lab, dan automation berisiko di service private.

## Service map

| Repo | Display name | Zone | Visibility | Role |
| --- | --- | --- | --- | --- |
| `home-reverse-community` | Reverse Community | Public core | Public | Website utama, CMS, event/news, dokumentasi, public status |
| `reverse-bot` | Reverse Discord Bot | Community bot | Public-facing bot | Slash command, Discord onboarding, announcement, Discord stats provider |
| `reverse-wabot` | Reverse WhatsApp Bot | Community bot | Group/private bot | WhatsApp assistant, AI helper, group utility, announcement channel |
| `reverse-proxy` | Reverse AI Gateway | Internal AI infrastructure | Private/internal | OpenAI-compatible router, model/provider gateway, API key pool |
| `reverse-web-server` | Reverse Ops Dashboard | Ops/control infrastructure | Private/VPN only | Server dashboard, Docker/file/process monitoring and controls |
| `reverse-autotrader` | Reverse Trader Lab | Lab/sandbox | Private lab | MT5 XAUUSD dry-run/demo research scaffold |

## Architecture decision

```txt
Public zone
  reverse.my.id
    └─ home-reverse-community
       ├─ public pages, CMS content, docs
       ├─ public bot documentation
       └─ sanitized service status

Community bot zone
  reverse-bot
  reverse-wabot
    ├─ link back to reverse.my.id
    ├─ read safe public CMS/API content
    └─ optionally use Reverse AI Gateway through dedicated keys

Internal AI zone
  reverse-proxy
    └─ private AI provider router; not a public community control panel

Private ops zone
  reverse-web-server
    └─ VPN/internal server control; not controlled from public bots/site

Private lab zone
  reverse-autotrader
    └─ dry-run/demo trading research; no public bot trigger
```

## Integration rules

### Allowed early integrations

- `home-reverse-community` links to public bot docs and project explanations.
- `reverse-bot` exposes community commands such as `/help`, `/community`, `/rules`, and `/socials`.
- `reverse-wabot` exposes community commands such as `/community`, `/website`, `/events`, and `/news`.
- `reverse-wabot` may use `reverse-proxy` as an OpenAI-compatible AI endpoint with a dedicated router key.
- `reverse-bot` may later use `reverse-proxy` for AI commands with a separate dedicated router key.
- Bots may later send sanitized heartbeat/status to `home-reverse-community` through an authenticated internal API.

### Forbidden or delayed integrations

- Do not merge all repositories into one monorepo yet.
- Do not share one database across all services.
- Do not expose `reverse-web-server` publicly.
- Do not let Discord/WhatsApp commands control Docker, server files, terminal, or trading execution.
- Do not store AI provider keys, WhatsApp sessions, Discord bot tokens, MT5 credentials, or server-control credentials inside the public website/CMS.
- Do not publish WhatsApp chat memory, phone numbers, prompts, provider accounts, trading account data, or server file paths.

## Suggested domains

Public:

```txt
reverse.my.id                -> home-reverse-community
reverse.my.id/bots           -> public bot docs
reverse.my.id/projects       -> ecosystem map
```

Private/internal, only after VPN/Access is ready:

```txt
ai.internal.reverse.my.id       -> reverse-proxy
ops.internal.reverse.my.id      -> reverse-web-server
discord.internal.reverse.my.id  -> Discord bot health/admin, if ever needed
wa.internal.reverse.my.id       -> WhatsApp bot health/admin, if ever needed
trader.internal.reverse.my.id   -> trader lab, if ever exposed
```

## Data and secret ownership

### Public community core may own

- Public pages, legal pages, event/news/blog content.
- Public bot documentation.
- Public Discord invite and sanitized stats.
- Sanitized ecosystem status such as service online/offline and last heartbeat.

### Must stay private to each service

- `reverse-bot`: `DISCORD_TOKEN`, client secrets, guild operation credentials.
- `reverse-wabot`: Baileys session, WhatsApp memory, phone numbers, AI key if not routed through gateway.
- `reverse-proxy`: provider credentials, router keys, encryption key, SQLite router database.
- `reverse-web-server`: server/session secrets, file/Docker/host controls.
- `reverse-autotrader`: MT5/account/broker details, trading logs that contain private account data.

## Roadmap

### Phase 0 — Blueprint and public map

- Maintain this document as the source of truth.
- Add public `/projects` and `/bots` pages to `home-reverse-community`.
- Keep the content descriptive, not operational.

### Phase 1 — Community bot commands

- Discord: `/help`, `/community`, `/rules`, `/socials`.
- WhatsApp: `/community`, `/website`, `/events`, `/news`.
- Commands should point users to `reverse.my.id` and public docs.

### Phase 2 — AI gateway centralization

- Harden `reverse-proxy` behind private access.
- Create separate router keys for Discord bot, WhatsApp bot, and manual/dev use.
- Route bot AI traffic through `reverse-proxy` instead of scattering provider keys.

### Phase 3 — Sanitized status and Discord stats

- Add authenticated internal heartbeat endpoint in `home-reverse-community`.
- Let bots send online/version/last-seen status.
- Let Discord bot send guild snapshot so `/api/discord-stats` can prefer bot data, then fallback to Discord Widget, then fallback to static config.

### Phase 4 — CMS event/news bridge

- Website CMS becomes source of truth for events/news.
- Bots can read and announce approved public content.
- Auto-announcement should be opt-in and rate-limited to avoid spam.

## Verification checklist before production integration

- Public pages do not expose secrets or private operational controls.
- Internal APIs reject requests without auth.
- Each bot/service has its own revocable key.
- `reverse-proxy` dashboard is private and credential storage is backed up securely.
- `reverse-web-server` is private/VPN-only with destructive controls disabled by default.
- `reverse-autotrader` remains dry-run/demo-only and cannot be triggered by public commands.
