# Reverse Community

Landing page dan brand showcase untuk **Reverse Community** — komunitas campuran untuk ngobrol, mabar, belajar, musik, creative/podcast, event, dan roadmap member showcase + game stats + merch/store.

## Stack

- **Next.js 16** App Router
- **React 19** + TypeScript
- **Tailwind CSS**
- **Payload CMS 3** — dual-mode database:
  - **VPS/Node.js:** `@payloadcms/db-sqlite` (SQLite file via `DATABASE_URL`)
  - **Cloudflare Workers:** `@payloadcms/db-d1-sqlite` (D1 binding)
- **Storage:** local `public/uploads/` untuk VPS; Cloudflare mode tidak memakai Payload media upload R2 (gunakan asset static/external URL)
- **Discord Widget API** untuk live online count
- **Docker Compose + Caddy** untuk deploy VPS
- **OpenNext Cloudflare** untuk deploy ke Cloudflare Workers

## Local setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local — pastikan DATABASE_URL diset untuk SQLite:
# DATABASE_URL=file:./reverse-community.db
npm run dev
```

Buka `http://localhost:3000`.

## Dual-mode deployment

Proyek ini mendukung **dua mode deployment** yang dipilih otomatis dari environment variable `DATABASE_URL`:

| Mode | `DATABASE_URL` | Database | Storage | Deploy dengan |
|------|---------------|----------|---------|--------------|
| **VPS** (Node.js) | `file:./data.db` | SQLite file (`@payloadcms/db-sqlite`) | `public/uploads/` | `docker compose up -d --build` |
| **Cloudflare** | tidak diset | D1 (`@payloadcms/db-d1-sqlite`) | static assets/external media; no R2 | `opennextjs-cloudflare build && wrangler deploy` |

> **Migration dari PostgreSQL:** Versi sebelumnya menggunakan PostgreSQL. Sekarang sudah migrasi penuh ke SQLite/D1. Jika masih memiliki data PostgreSQL, ekspor ke SQLite sebelum upgrade.

## Environment

### VPS / Docker

```env
# Mode: VPS SQLite (set DATABASE_URL ke file path)
DATABASE_URL=file:./data/reverse-community.db

# Payload CMS secret
PAYLOAD_SECRET=change-this-to-a-long-random-secret

# Admin protection
# Payload CMS sudah punya login sendiri.
# Untuk proteksi tambahan di production, gunakan Cloudflare Access atau reverse-proxy auth.

# Discord
NEXT_PUBLIC_SITE_URL=https://reverse.my.id
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/your-invite
DISCORD_GUILD_ID=1065486356513554522

# CMS: "true" untuk aktifkan content dari Payload
ENABLE_CMS_CONTENT=false

# Internal API token (bot heartbeat & snapshot)
INTERNAL_API_TOKEN=change-this-to-a-long-random-internal-token

# Umami analytics (opsional)
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

### Cloudflare

```env
# Mode: Cloudflare D1 (kosongkan DATABASE_URL)
# DATABASE_URL tidak perlu diset

# Cloudflare environment
CLOUDFLARE_ENV=production

# Payload CMS secret
PAYLOAD_SECRET=change-this-to-a-long-random-secret

# Admin protection
# Payload CMS sudah punya login sendiri.
# Untuk proteksi tambahan di Cloudflare, gunakan Cloudflare Access di /admin/*.

# Discord
NEXT_PUBLIC_SITE_URL=https://reverse.my.id
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/your-invite
DISCORD_GUILD_ID=1065486356513554522

# CMS: "true" untuk aktifkan content dari Payload
ENABLE_CMS_CONTENT=false

# Internal API token
INTERNAL_API_TOKEN=change-this-to-a-long-random-internal-token

# Umami analytics (opsional)
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

> **Catatan:** Database (D1) dan KV dikonfigurasi via binding di `wrangler.jsonc`, bukan `.env`. R2 sengaja tidak dipakai. Jalankan `npm run cf-typegen` setelah mengubah binding.

## VPS Docker deploy

### Prerequisite

- Docker + Docker Compose plugin
- DNS A record `reverse.my.id` → IP VPS

### Setup

```bash
# Clone & masuk direktori
git clone <repo-url> reverse-community
cd reverse-community

# Copy env
cp .env.example .env
# Edit .env — isi semua nilai production

# Build & start
docker compose up -d --build
```

Caddy otomatis issue SSL untuk domain berdasarkan `Caddyfile`.

### Initial database

Setelah pertama kali deploy, jalankan migrasi skema Payload:

```bash
docker compose --profile tools run --rm migrate
```

Ini akan:
1. Build ulang aplikasi
2. Jalankan `npx payload migrate` untuk membuat tabel-tabel SQLite

### Data persistence

- Database SQLite: volume `sqlite_data` (mount ke `/app/data/`)
- Uploads: volume `uploads` (mount ke `/app/public/uploads/`)
- Jika perlu backup: `docker run --rm -v reverse-community_sqlite_data:/data -v $(pwd):/backup alpine tar czf /backup/sqlite-backup.tar.gz -C /data .`

## Cloudflare deploy

### Prerequisite

- Akun Cloudflare dengan domain `reverse.my.id`
- Wrangler CLI terinstall (`npm install -g wrangler` atau via `npx`)
- D1 database + KV namespace sudah dibuat (lihat wrangler.jsonc)

### Setup Cloudflare resources

```bash
# Login ke Cloudflare
npx wrangler login

# Buat D1 database (sekali saja)
npx wrangler d1 create reverse-community-db

# Buat KV namespace untuk heartbeat/snapshot (sekali saja)
npx wrangler kv namespace create REVERSE_KV

# Update binding IDs di wrangler.jsonc dengan hasil output di atas
# lalu regenerate types:
npm run cf-typegen
```

> **Catatan:** Binding IDs di `wrangler.jsonc` harus memakai ID asli dari `wrangler d1 create` dan `wrangler kv namespace create`.

### Deploy

```bash
# Set environment
export CLOUDFLARE_ENV=production
export PAYLOAD_SECRET=your-secret

# Deploy database (migrasi skema ke D1)
npm run deploy:database

# Build & deploy app
npm run deploy:app

# Atau sekali jalan:
npm run deploy
```

### Preview locally

```bash
# Build untuk Cloudflare
npm run preview
```

Ini build OpenNext + preview di local via `workerd`.

## Discord live stats

Route: `GET /api/discord-stats`

Cara enable Discord Widget:

1. Buka Discord server Reverse Community.
2. Masuk **Server Settings → Widget**.
3. Enable **Server Widget**.
4. Pastikan `DISCORD_GUILD_ID` ada di env.
5. Set invite publik di `NEXT_PUBLIC_DISCORD_INVITE_URL`.

Catatan: Discord widget JSON menyediakan `presence_count` untuk online count. Total member tidak selalu tersedia dari widget, jadi MVP memakai fallback untuk members sampai nanti ditambahkan bot/internal API.

## CMS

Scaffold Payload ada di `src/payload`:

- `Events`
- `TeamMembers`
- `Highlights`
- `Members`
- `GameStats`
- `Products`
- `LegalPages`
- `Posts`
- `Media`
- `Users`
- Global `SiteSettings`

Admin dan REST routes sudah disiapkan di `src/app/(payload)`. Landing page memakai loader `src/lib/content.ts`:

- Default: fallback dari `src/data/community.ts`
- Jika `ENABLE_CMS_CONTENT=true`: baca content dari Payload CMS dengan fallback otomatis

### Initial setup

1. Set `DATABASE_URL` (VPS) atau deploy D1 (Cloudflare)
2. Jalankan migrasi: `npx payload migrate`
3. Buka `/admin` dan buat user admin pertama
4. Seed data atauisi manual dari panel admin
5. Set `ENABLE_CMS_CONTENT=true` setelah konten siap

### Migrations

```bash
# Lihat status
npm run migrate:status

# Buat migration file baru
npm run migrate:create

# Jalankan migration
npm run migrate

# Fresh (drop all + migrate ulang)
npm run migrate:fresh
```

## Admin protection

`/admin` dilindungi oleh **Payload CMS login** (`Users` collection).

Untuk production, disarankan tambah proteksi di level platform:

- **Cloudflare:** gunakan Cloudflare Access untuk path `/admin/*`
- **VPS/Caddy:** tambahkan basic auth di `Caddyfile` jika ingin gate sebelum Payload login

Catatan: Next.js middleware/proxy sengaja tidak dipakai karena OpenNext Cloudflare saat ini tidak mendukung Node.js middleware output dari Next.js 16.

## Analytics

Analytics opsional memakai Umami-compatible script:

```env
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.example.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

Jika env kosong, script analytics tidak di-render.

## Scripts

```bash
npm run dev              # webpack dev server
npm run build            # Next.js build
npm run start            # Next.js start (VPS mode)
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run payload          # Payload CLI
npm run migrate          # Payload DB migration
npm run migrate:fresh    # Drop & migrate ulang
npm run deploy           # Full Cloudflare deploy (DB + app)
npm run deploy:app       # Cloudflare app only
npm run deploy:database  # Cloudflare DB migration only
npm run preview          # Cloudflare local preview
npm run cf-typegen       # Generate Cloudflare env types
```

## Design direction

Minimalist dark identity:

- Base: black/dark graphite
- Accent: red energy + blue signal
- Tone: community-first, polished, modern, gaming-adjacent
- Copy: bilingual ID/EN where useful

## Roadmap

- Blog/news from CMS
- Public event RSVP
- Discord bot for richer stats
