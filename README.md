# Reverse Community

Landing page dan brand showcase untuk **Reverse Community** — komunitas campuran untuk ngobrol, mabar, belajar, musik, creative/podcast, event, dan roadmap member showcase + game stats + merch/store.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS
- Payload CMS 3 scaffold + PostgreSQL adapter
- Discord Widget API untuk live online count
- Docker Compose + Caddy untuk deploy VPS

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Environment

```env
NEXT_PUBLIC_SITE_URL=https://reverse.my.id
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/your-invite
DISCORD_GUILD_ID=1065486356513554522
ENABLE_CMS_CONTENT=false

DATABASE_URL=postgres://reverse:change-this-postgres-password@localhost:5432/reverse
POSTGRES_PASSWORD=change-this-postgres-password
PAYLOAD_SECRET=change-this-to-a-long-random-secret
ADMIN_BASIC_USER=admin
ADMIN_BASIC_PASSWORD=change-this-admin-gate-password
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

Catatan env/database:

- Local dev via `npm run dev`: pakai `.env.local` dan gunakan `localhost` di `DATABASE_URL`.
- Docker Compose: pakai `.env`; service `app` otomatis override `DATABASE_URL` ke hostname internal `postgres` dari `docker-compose.yml`.
- Jangan pakai `postgres` sebagai hostname saat menjalankan Next langsung dari Windows/host, karena hostname itu hanya ada di network Docker Compose.
- Ubah `POSTGRES_PASSWORD`, `PAYLOAD_SECRET`, dan `ADMIN_BASIC_PASSWORD` sebelum deploy.

## Discord live stats

Route: `GET /api/discord-stats`

Cara enable Discord Widget:

1. Buka Discord server Reverse Community.
2. Masuk **Server Settings → Widget**.
3. Enable **Server Widget**.
4. Pastikan `DISCORD_GUILD_ID=1065486356513554522` ada di env.
5. Set invite publik di `NEXT_PUBLIC_DISCORD_INVITE_URL`.

Catatan: Discord widget JSON menyediakan `presence_count` untuk online count. Total member tidak selalu tersedia dari widget, jadi MVP memakai fallback untuk members sampai nanti ditambahkan bot/internal API.

## CMS plan

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

Yang masih perlu dilakukan saat setup production:

1. Jalankan migrasi/initial admin Payload setelah PostgreSQL aktif.
2. Seed data awal dari `src/data/community.ts`.
3. Set `ENABLE_CMS_CONTENT=true` setelah konten CMS siap.
4. Tambahkan upload storage production jika butuh skalabilitas lebih besar (local volume, S3, atau MinIO).

## Admin protection

`/admin` punya dua lapis proteksi:

1. Basic Auth middleware via env: `ADMIN_BASIC_USER` dan `ADMIN_BASIC_PASSWORD`
2. Login Payload CMS (`Users` collection)

Jika `ADMIN_BASIC_USER` atau `ADMIN_BASIC_PASSWORD` kosong, `/admin` akan mengembalikan error konfigurasi. Ini sengaja supaya admin tidak pernah terbuka tanpa gate password.

Untuk lokal saja, kamu bisa set `ADMIN_BASIC_AUTH_DISABLED=true` agar proxy melewati Basic Auth. Jangan dipakai di production.

## Analytics

Analytics opsional memakai Umami-compatible script:

```env
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.example.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

Jika env kosong, script analytics tidak di-render.

## Database schema

Sebelum membuka `/admin` di environment baru, push schema Payload ke Postgres:

```bash
npm run db:push
```

Script ini menjalankan `pushDevSchema` dari Payload Drizzle adapter yang otomatis sinkron skema dengan collections/globals di `src/payload`. Aman dijalankan ulang; perubahan skema akan dipush incremental.

Untuk environment yang butuh migration files (multi-step rollout), gunakan:

```bash
npm run migrate:create
npm run migrate
```

## VPS deploy

Prerequisite di VPS:

- Docker
- Docker Compose plugin
- DNS A record `reverse.my.id` mengarah ke IP VPS

Deploy:

```bash
cp .env.example .env
# edit .env production values
docker compose up -d --build
```

Untuk environment baru atau setelah perubahan schema Payload, jalankan inisialisasi schema dari container:

```bash
docker compose --profile tools run --rm migrate
```

Caddy otomatis issue SSL untuk `reverse.my.id` berdasarkan `Caddyfile`.

## Scripts

```bash
npm run dev        # webpack mode, required for current Payload/Drizzle toolchain on Next 16
npm run build
npm run start
npm run lint
npm run typecheck
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
