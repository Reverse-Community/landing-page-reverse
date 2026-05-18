import type { Metadata } from "next";

import { ArrowLeft, Sparkles, Store, Trophy, Users2 } from "lucide-react";
import Link from "next/link";

import { getLandingContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reverse OS — Roadmap & Status",
  description: "Pulse, roadmap, dan blueprint produk Reverse Community.",
};

const milestoneIcons = [Users2, Trophy, Store, Sparkles];

export default async function ReverseOsPage() {
  const { roadmap, siteConfig } = await getLandingContent();

  return (
    <main className="relative min-h-screen overflow-hidden bg-base px-5 py-16 text-ink sm:px-8 sm:py-24">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-[-10rem] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-red-reverse/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-20 h-[30rem] w-[30rem] rounded-full bg-blue-reverse/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-blue-reverse transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Reverse
        </Link>

        <header className="mt-10 flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-reverse">
            Reverse OS · Live Status
          </p>
          <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Operating system buat komunitas yang lagi tumbuh.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/75">
            Reverse OS adalah peta jalan publik produk dan ekosistem Reverse Community. Setiap milestone digerakkan oleh kontribusi member.
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <article className="glass rounded-3xl p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-reverse">
              Brand pulse
            </p>
            <p className="mt-3 text-2xl font-black leading-tight">
              Minimal black. Red energy. Blue signal.
            </p>
          </article>
          <article className="glass rounded-3xl p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-reverse">
              Tagline
            </p>
            <p className="mt-3 text-base leading-7 text-white/80">
              {siteConfig.tagline.id}
            </p>
            <p className="mt-2 text-sm leading-7 text-white/55">
              {siteConfig.tagline.en}
            </p>
          </article>
          <article className="glass rounded-3xl p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70">
              Mode
            </p>
            <p className="mt-3 text-2xl font-black leading-tight text-ink">
              Always shipping.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Roadmap diperbarui bareng arah komunitas — bukan sekedar checklist.
            </p>
          </article>
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">
              Roadmap
            </h2>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-reverse">
              Live
            </span>
          </div>
          <ol className="mt-8 space-y-3">
            {roadmap.map((item, index) => {
              const Icon = milestoneIcons[index % milestoneIcons.length];
              return (
                <li
                  key={item}
                  className="glass flex items-center justify-between gap-4 rounded-3xl p-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-red-reverse">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">
                        Phase {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-lg font-black text-ink">{item}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-white/70">
                    Roadmap
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {["Mabar", "Belajar", "Event"].map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center"
            >
              <p className="text-2xl font-black text-ink">{item}</p>
              <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-white/65">
                Active
              </p>
            </article>
          ))}
        </section>

        <section className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-reverse">
            Join the build
          </p>
          <h2 className="max-w-2xl text-3xl font-black tracking-[-0.03em] sm:text-4xl">
            Mau ikut bantu bentuk Reverse OS?
          </h2>
          <p className="max-w-xl text-base leading-7 text-white/75">
            Member yang ngedorong komunitas, kamu bisa kontribusi langsung — feedback, ide, bantu event, atau gabung tim.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {siteConfig.inviteUrl ? (
              <a
                href={siteConfig.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-reverse to-blue-reverse px-6 py-3 font-black text-white shadow-blue transition hover:scale-[1.02]"
              >
                Gabung Discord
              </a>
            ) : null}
            <Link
              href="/#team"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 font-bold text-ink transition hover:border-white/30 hover:bg-white/[0.08]"
            >
              Lihat Tim
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
