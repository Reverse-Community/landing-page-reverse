import type { Metadata } from "next";
import Link from "next/link";
import { Activity, LockKeyhole, Radio, ShieldCheck } from "lucide-react";
import { ecosystemStatuses, statusLegend } from "@/data/ecosystem";

export const metadata: Metadata = {
  title: "Reverse Status",
  description: "Sanitized public status untuk service dan project Reverse Ecosystem."
};

const stateStyles = {
  online: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  ready: "border-blue-reverse/30 bg-blue-reverse/12 text-blue-100",
  private: "border-white/10 bg-white/[0.05] text-white/70",
  lab: "border-red-reverse/30 bg-red-reverse/12 text-red-100",
  planned: "border-yellow-300/20 bg-yellow-300/10 text-yellow-100"
};

export default function StatusPage() {
  const publicCount = ecosystemStatuses.filter((item) => item.state === "online" || item.state === "ready").length;
  const privateCount = ecosystemStatuses.filter((item) => item.state === "private" || item.state === "lab").length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-base px-5 py-10 text-ink sm:px-8 sm:py-14">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-blue-reverse/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-24 h-[30rem] w-[30rem] rounded-full bg-red-reverse/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.22em] text-blue-reverse">
            ← Reverse
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-black text-ink transition hover:bg-white/[0.08]">
              Ecosystem Map
            </Link>
            <Link href="/bots" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-black transition hover:bg-blue-reverse hover:text-white">
              Bot Docs
            </Link>
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div>
            <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
              Public Status
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-ink sm:text-7xl lg:text-8xl">
              Status aman untuk ekosistem Reverse.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">
              Halaman ini menampilkan status sanitized: cukup untuk publik memahami kesiapan service, tanpa membuka token, dashboard private, chat memory, server path, atau data trading.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="glass rounded-[2rem] p-7">
              <Radio className="h-10 w-10 text-blue-reverse" />
              <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-white/50">Community-facing</p>
              <p className="mt-2 text-5xl font-black tracking-[-0.05em]">{publicCount}</p>
              <p className="mt-3 leading-7 text-white/65">Service public/ready untuk komunitas.</p>
            </article>
            <article className="glass rounded-[2rem] p-7">
              <LockKeyhole className="h-10 w-10 text-red-reverse" />
              <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-white/50">Private boundary</p>
              <p className="mt-2 text-5xl font-black tracking-[-0.05em]">{privateCount}</p>
              <p className="mt-3 leading-7 text-white/65">Service private/lab yang sengaja tidak dibuka sebagai kontrol publik.</p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {ecosystemStatuses.map((item) => (
            <article key={item.slug} className="glass rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className={item.accent === "red" ? "text-xs font-black uppercase tracking-[0.24em] text-red-reverse" : "text-xs font-black uppercase tracking-[0.24em] text-blue-reverse"}>
                    {item.zone}
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">{item.name}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${stateStyles[item.state]}`}>
                  {statusLegend[item.state]}
                </span>
              </div>

              <p className="mt-5 leading-7 text-white/72">{item.summary}</p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    <Activity className="h-4 w-4" /> Last known check
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.check}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    <ShieldCheck className="h-4 w-4" /> Next safe step
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.nextStep}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="py-16 sm:py-20">
          <div className="glass rounded-[2rem] p-7 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-reverse">Why sanitized?</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Status publik bukan control panel.</h2>
            <p className="mt-4 max-w-4xl leading-7 text-white/70">
              Reverse memiliki service dengan level risiko berbeda. Website boleh menampilkan kesiapan dan roadmap, tetapi credential AI, WhatsApp session, token Discord, server control, prompt private, dan trading data harus tetap berada di service masing-masing.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
