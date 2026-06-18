import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Gamepad2,
  MessageCircle,
  Music2,
  Radio,
  ShieldCheck,
  Sparkles,
  Store,
  Trophy,
  Users2,
} from "lucide-react";
import Image from "next/image";
import type { TeamMember } from "@/data/community";
import { StatsCard } from "@/components/stats-card";
import { getLandingContent } from "@/lib/content";

const iconMap = {
  MessageCircle,
  Gamepad2,
  Music2,
  BookOpen,
  Radio,
  CalendarDays,
};

const bilingualLabel = "ID / EN";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-surface">
      {member.imageUrl ? (
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className={
            member.accent === "red"
              ? "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-reverse/40 via-red-reverse/10 to-transparent text-7xl font-black text-red-reverse"
              : "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-reverse/40 via-blue-reverse/10 to-transparent text-7xl font-black text-blue-reverse"
          }
        >
          {member.name.slice(0, 1)}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 pt-20">
        <h3 className="text-xl font-black text-ink drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-bold text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          {member.role}
        </p>
        <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          {member.city}
        </p>
        {member.links && member.links.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {member.links.map((link) => (
              <li key={`${member.name}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink backdrop-blur transition hover:border-white/40 hover:bg-white/20"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function EventCard({
  event,
  variant
}: {
  event: { date: string; title: string; tag: string; description: string; location?: string | null; imageUrl?: string | null };
  variant: "upcoming" | "past";
}) {
  const tagAccent = variant === "upcoming" ? "bg-blue-reverse/15 text-blue-reverse" : "bg-white/10 text-white/80";
  return (
    <article className={`overflow-hidden rounded-2xl border border-white/10 bg-black/25 ${variant === "past" ? "opacity-85" : ""}`}>
      {event.imageUrl ? (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-white/75">
          <span>{event.date}</span>
          <span className={`rounded-full px-3 py-1 ${tagAccent}`}>{event.tag}</span>
          {event.location ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/70">
              {event.location}
            </span>
          ) : null}
        </div>
        <h4 className="mt-4 text-xl font-black">{event.title}</h4>
        <p className="mt-2 leading-7 text-white/75">{event.description}</p>
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[0.72rem] font-black uppercase tracking-[0.24em] text-blue-reverse sm:text-xs sm:tracking-[0.36em]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-ink sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-white/70 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default async function Home() {
  const {
    aboutContent,
    events,
    faqs,
    gallery,
    gameStats,
    marqueeItems,
    memberShowcase,
    merchProducts,
    pillars,
    roadmap,
    siteConfig,
    teamMembers,
  } = await getLandingContent();
  const statsFallback = {
    ...siteConfig.statsFallback,
    source: "fallback" as const,
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-base">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-red-reverse/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-10 h-[30rem] w-[30rem] rounded-full bg-blue-reverse/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="Reverse Community home"
        >
          <Image
            src="/logo-mark.svg"
            alt="Reverse Community"
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-xl border border-white/10 bg-white/[0.04] object-cover shadow-red"
          />
          <span className="text-base font-black uppercase tracking-[0.18em] text-ink sm:text-sm sm:tracking-[0.22em]">
            Reverse
          </span>
        </a>
        <nav
          className="hidden items-center gap-6 text-sm font-bold text-white/80 lg:flex"
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-ink"
            >
              {item.label}{" "}
              <span className="text-white/50">/ {item.labelEn}</span>
            </a>
          ))}
        </nav>
        <a
          href={siteConfig.inviteUrl}
          className="rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-blue-reverse hover:text-white sm:py-2.5"
        >
          Join
        </a>
      </header>

      <section
        id="top"
        className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[1.15fr_.85fr] lg:pb-28 lg:pt-20"
      >
        <div className="flex flex-col justify-center">
          <div className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/70 sm:text-xs sm:tracking-[0.24em]">
            <span className="h-2 w-2 rounded-full bg-red-reverse shadow-red" />
            Reverse Community · {bilingualLabel}
          </div>
          <Image
            src="/logo.png"
            alt="Reverse Community logo"
            width={1536}
            height={1024}
            priority
            className="mb-7 h-auto w-full max-w-[34rem] rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-soft"
          />
          <h1 className="max-w-5xl text-[3.25rem] font-black leading-[0.92] tracking-[-0.075em] text-ink sm:text-7xl lg:text-8xl">
            Connect. Play. <span className="glow-text">Reverse</span> the noise.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:mt-7 sm:text-xl">
            {siteConfig.tagline.id} <span className="text-white/40">—</span>{" "}
            {siteConfig.tagline.en}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.inviteUrl}
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-reverse to-blue-reverse px-6 py-3 font-black text-white shadow-blue transition hover:scale-[1.02]"
            >
              Gabung Sekarang{" "}
              <ChevronRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-bold text-ink transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              Lihat Identitas
            </a>
          </div>
          <div className="mt-8 max-w-2xl sm:mt-10">
            <StatsCard fallback={statsFallback} />
          </div>
        </div>

        <div className="relative hidden min-h-[36rem] lg:block">
          <div className="absolute inset-0 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-5 shadow-soft">
            <div className="h-full rounded-[2.2rem] border border-white/10 bg-black/35 p-6">
              <a
                href="/os"
                className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-white/65 transition hover:text-ink"
                aria-label="Open Reverse OS roadmap"
              >
                <span className="inline-flex items-center gap-2">
                  Reverse OS
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                </span>
                <span className="text-blue-reverse">live</span>
              </a>
              <div className="mt-8 space-y-3">
                {roadmap.map((item, index) => (
                  <div
                    key={item}
                    className="glass flex items-center justify-between rounded-2xl p-3"
                    style={{
                      transform: `translateX(${index % 2 === 0 ? 0 : 18}px)`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-red-reverse">
                        {index === 0 ? (
                          <Users2 className="h-5 w-5" />
                        ) : index === 1 ? (
                          <Trophy className="h-5 w-5" />
                        ) : index === 2 ? (
                          <Store className="h-5 w-5" />
                        ) : (
                          <Sparkles className="h-5 w-5" />
                        )}
                      </span>
                      <span className="font-bold">{item}</span>
                    </div>
                    <span className="text-xs text-white/70">roadmap</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-3xl border border-blue-reverse/25 bg-blue-reverse/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-reverse">
                  Brand pulse
                </p>
                <p className="mt-3 text-xl font-black tracking-tight">
                  Minimal black. Red energy. Blue signal.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {["Mabar", "Belajar", "Event"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center"
                  >
                    <p className="text-lg font-black text-ink">{item}</p>
                    <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/65">
                      active
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-white/[0.03] py-5">
        <div className="marquee">
          <div className="marquee-track gap-4">
            {[
              ...marqueeItems.map((item) => `${item}-a`),
              ...marqueeItems.map((item) => `${item}-b`),
            ].map((itemKey) => (
              <span
                key={itemKey}
                className="rounded-full border border-white/10 bg-black/40 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white/70 sm:text-sm"
              >
                {itemKey.slice(0, -2)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr]"
      >
        <div>
          <p className="text-[0.72rem] font-black uppercase tracking-[0.24em] text-red-reverse sm:text-xs sm:tracking-[0.36em]">
            About / Tentang
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            {aboutContent.title}
          </h2>
        </div>
        <div className="glass rounded-3xl p-7 sm:p-10">
          <p className="text-base leading-8 text-white/75 sm:text-lg sm:leading-9">
            {aboutContent.body}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Welcoming", "Creative", "Alive"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-ink"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pillars"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="Spaces"
          title="Ruang yang bikin komunitas bergerak"
          description="Reverse bukan satu channel. Reverse adalah kumpulan ruang kecil untuk berbagai ritme: santai, kompetitif, produktif, dan kreatif."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon];
            return (
              <article
                key={pillar.title}
                className="glass group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className={
                    index % 2 === 0
                      ? "mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-reverse/15 text-red-reverse shadow-red"
                      : "mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-reverse/15 text-blue-reverse shadow-blue"
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-white/65">
                  {pillar.titleEn}
                </p>
                <p className="mt-5 text-base leading-7 text-white/70">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="team"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="Team"
          title="Orang di balik layar"
          description="Tim yang bekerja di balik perkembangan Reverse, menghadirkan pengalaman terbaik untuk komunitas."
        />
        {(() => {
          const total = teamMembers.length;
          const remainder = total % 4;
          const leadersCount = remainder === 0 ? 0 : remainder;
          const leaders = teamMembers.slice(0, leadersCount);
          const rest = teamMembers.slice(leadersCount);
          const leaderColsClass =
            leadersCount === 1
              ? "max-w-xs sm:grid-cols-1"
              : leadersCount === 2
                ? "max-w-2xl sm:grid-cols-2"
                : "max-w-4xl sm:grid-cols-3";

          return (
            <div className="mt-14 space-y-4">
              {leaders.length > 0 ? (
                <div className={`mx-auto grid gap-4 ${leaderColsClass}`}>
                  {leaders.map((member) => (
                    <TeamCard key={member.name} member={member} />
                  ))}
                </div>
              ) : null}
              {rest.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {rest.map((member) => (
                    <TeamCard key={member.name} member={member} />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })()}
      </section>

      <section
        id="events"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="Events"
          title="Aktivitas yang bikin member balik lagi"
          description="Contoh format event untuk Reverse: gaming, creative, learning, dan community night."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-6">
            <h3 className="mb-6 text-2xl font-black">Upcoming</h3>
            <div className="space-y-4">
              {events.upcoming.map((event) => (
                <EventCard key={event.title} event={event} variant="upcoming" />
              ))}
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="mb-6 text-2xl font-black">Past</h3>
            <div className="space-y-4">
              {events.past.map((event) => (
                <EventCard key={event.title} event={event} variant="past" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeader
          eyebrow="Highlights"
          title="Gallery / Momen Komunitas"
          description="Kumpulan momen seru, event komunitas, dan aktivitas pemain di dunia Reverse."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <article
              key={item.title}
              className="group relative min-h-64 overflow-hidden rounded-3xl border border-white/10 bg-surface p-6"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition group-hover:scale-105"
                />
              ) : null}
              <div
                className={
                  item.imageUrl
                    ? "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    : index % 2 === 0
                      ? "absolute inset-0 bg-gradient-to-br from-red-reverse/25 to-transparent opacity-70 transition group-hover:scale-110"
                      : "absolute inset-0 bg-gradient-to-br from-blue-reverse/25 to-transparent opacity-70 transition group-hover:scale-110"
                }
              />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <h3 className="text-2xl font-black">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-white/85">
                  {item.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="members"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="Members"
          title="Member Showcase"
          description="Spotlight untuk member komunitas Reverse yang ikut meramaikan dan membangun cerita setiap harinya."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {memberShowcase.map((member, index) => (
            <article key={member.name} className="glass rounded-3xl p-6">
              {member.imageUrl ? (
                <div className="relative mb-5 h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={
                    index % 2 === 0
                      ? "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-reverse/15 text-xl font-black text-red-reverse"
                      : "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-reverse/15 text-xl font-black text-blue-reverse"
                  }
                >
                  {member.name.slice(0, 1)}
                </div>
              )}
              <h3 className="text-2xl font-black">{member.name}</h3>
              <p className="mt-1 font-bold text-white/75">
                {member.role} · {member.game}
              </p>
              <p className="mt-5 leading-7 text-white/75">“{member.quote}”</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="game-stats"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="Game Stats"
          title="Community Pulse"
          description="Statistik aktivitas komunitas dan perkembangan dunia Reverse secara real-time."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {gameStats.map((stat) => (
            <article
              key={stat.label}
              className="glass rounded-3xl p-7 text-center"
            >
              <p className="glow-text text-5xl font-black tracking-[-0.06em]">
                {stat.value}
              </p>
              <h3 className="mt-4 text-xl font-black">{stat.label}</h3>
              <p className="mt-3 leading-7 text-white/70">{stat.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="store"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="Merch / Store"
          title="Reverse Store Concept"
          description="Koleksi merch dan item eksklusif komunitas Reverse yang akan terus berkembang."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {merchProducts.map((product) => (
            <article key={product.name} className="glass rounded-3xl p-6">
              {product.imageUrl ? (
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="mb-6 aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-red-reverse/20 via-white/[0.03] to-blue-reverse/20" />
              )}
              <h3 className="text-xl font-black">{product.name}</h3>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-bold text-white/70">{product.price}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                  {product.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="relative z-10 mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <SectionHeader
          eyebrow="FAQ"
          title="Pertanyaan cepat"
          description="Jawaban singkat untuk member baru dan calon partner."
        />
        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="glass group rounded-2xl p-5">
              <summary className="cursor-pointer list-none font-black marker:hidden">
                {faq.question}
              </summary>
              <p className="mt-4 leading-7 text-white/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="glass overflow-hidden rounded-[2rem] p-8 text-center sm:p-14">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-reverse to-blue-reverse">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Masuk ke sisi Reverse.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Join the room, meet the people, shape the culture. Komunitas ini
            dibuat untuk tumbuh pelan tapi kuat.
          </p>
          <a
            href={siteConfig.inviteUrl}
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 font-black text-black transition hover:bg-blue-reverse hover:text-white"
          >
            Gabung Discord
          </a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-base text-white/75 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-black text-ink">Reverse Community</span> —
            reverse.my.id
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {siteConfig.socials.discord ? (
              <a
                href={siteConfig.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Discord
              </a>
            ) : null}
            {siteConfig.socials.instagram ? (
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Instagram
              </a>
            ) : null}
            {siteConfig.socials.youtube ? (
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                YouTube
              </a>
            ) : null}
            {siteConfig.socials.tiktok ? (
              <a
                href={siteConfig.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                TikTok
              </a>
            ) : null}
            <a href="/terms" className="transition hover:text-white">
              Terms
            </a>
            <a href="/privacy" className="transition hover:text-white">
              Privacy
            </a>
            <a
              href="/community-guidelines"
              className="transition hover:text-white"
            >
              Guidelines
            </a>
            <a href="/bots" className="transition hover:text-white">
              Bots
            </a>
            <a href="/projects" className="transition hover:text-white">
              Projects
            </a>
            <a href="/status" className="transition hover:text-white">
              Status
            </a>
          </div>
          <p>© 2026. Built for community, gaming, and creative growth.</p>
        </div>
      </footer>
    </main>
  );
}
