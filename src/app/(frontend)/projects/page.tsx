import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { ecosystemPrinciples, ecosystemServices } from "@/data/ecosystem";

export const metadata: Metadata = {
  title: "Reverse Projects",
  description: "Peta project dan service dalam Reverse Ecosystem."
};

const zones = [
  "Public Community Core",
  "Community Bot",
  "Internal AI Infrastructure",
  "Private Ops Infrastructure",
  "Private Lab/Sandbox"
];

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base px-5 py-10 text-ink sm:px-8 sm:py-14">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-[-14rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-red-reverse/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-blue-reverse/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.22em] text-blue-reverse">
            ← Reverse
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/bots" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-black text-ink transition hover:bg-white/[0.08]">
              Bot Docs
            </Link>
            <Link href="/community-guidelines" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-black transition hover:bg-blue-reverse hover:text-white">
              Guidelines
            </Link>
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div>
            <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-red-reverse shadow-red" />
              Ecosystem Map
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-ink sm:text-7xl lg:text-8xl">
              Satu Reverse, banyak service, batasnya jelas.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">
              Reverse Ecosystem menghubungkan website, bot komunitas, AI gateway, ops tooling, dan lab internal tanpa mencampur data sensitif ke ruang publik.
            </p>
          </div>

          <div className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-8">
            <div className="absolute right-[-5rem] top-[-5rem] h-44 w-44 rounded-full bg-blue-reverse/20 blur-3xl" />
            <Network className="h-10 w-10 text-blue-reverse" />
            <h2 className="mt-5 text-2xl font-black">Integration stance</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-white/72 sm:text-base">
              {ecosystemPrinciples.map((principle) => (
                <li key={principle} className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-red-reverse" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          {zones.map((zone, index) => (
            <article key={zone} className="glass rounded-3xl p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">Zone {index + 1}</p>
              <h2 className="mt-4 text-lg font-black leading-tight">{zone}</h2>
            </article>
          ))}
        </section>

        <section className="py-16 sm:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-reverse">Service Registry</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Project Reverse yang sudah terpetakan</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {ecosystemServices.map((service) => (
              <article key={service.slug} className="glass overflow-hidden rounded-[2rem] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={service.accent === "red" ? "text-xs font-black uppercase tracking-[0.24em] text-red-reverse" : "text-xs font-black uppercase tracking-[0.24em] text-blue-reverse"}>
                      {service.zone}
                    </p>
                    <h3 className="mt-3 text-2xl font-black">{service.name}</h3>
                    <p className="mt-1 text-sm font-bold text-white/55">{service.repo}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                    {service.visibility}
                  </span>
                </div>

                <p className="mt-5 leading-7 text-white/72">{service.role}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.stack.map((item) => (
                    <span key={item} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/70">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white/75">
                      <Boxes className="h-4 w-4" /> Owns
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                      {service.responsibilities.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white/75">
                      <LockKeyhole className="h-4 w-4" /> Boundary
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                      {service.boundaries.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
