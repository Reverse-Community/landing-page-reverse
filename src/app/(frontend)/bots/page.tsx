import type { Metadata } from "next";
import Link from "next/link";
import { Bot, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { botCommandRoadmap, ecosystemServices } from "@/data/ecosystem";
import { siteConfig } from "@/data/community";

export const metadata: Metadata = {
  title: "Reverse Bots",
  description: "Dokumentasi publik untuk Discord Bot dan WhatsApp Bot Reverse Community."
};

const botServices = ecosystemServices.filter((service) => service.zone === "Community Bot");

export default function BotsPage() {
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
            <a href={siteConfig.inviteUrl} className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-black transition hover:bg-blue-reverse hover:text-white">
              Join Discord
            </a>
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1fr_.9fr] lg:py-20">
          <div>
            <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-blue-reverse shadow-blue" />
              Discord + WhatsApp
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-ink sm:text-7xl lg:text-8xl">
              Bot Reverse sebagai jembatan komunitas.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">
              Discord Bot dan WhatsApp Bot diposisikan sebagai channel assistant: membantu member, mengarahkan ke website, dan nanti membawa event/news dari core ke ruang komunitas.
            </p>
          </div>

          <div className="glass rounded-[2rem] p-7 sm:p-8">
            <Bot className="h-10 w-10 text-red-reverse" />
            <h2 className="mt-5 text-2xl font-black">Boundary bot</h2>
            <p className="mt-4 leading-7 text-white/72">
              Bot boleh membantu komunitas dan membaca konten publik. Bot tidak boleh menjadi pintu kontrol untuk server ops, credential AI provider, WhatsApp memory, atau trading lab.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-bold text-white/72 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">Public commands</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">Admin-gated actions</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">Private tokens</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">No ops/trading control</div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {botServices.map((service) => (
            <article key={service.slug} className="glass rounded-[2rem] p-6 sm:p-8">
              <div className={service.accent === "red" ? "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-reverse/15 text-red-reverse" : "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-reverse/15 text-blue-reverse"}>
                {service.slug === "discord-bot" ? <MessageCircle className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
              </div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">{service.status}</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">{service.name}</h2>
              <p className="mt-4 leading-7 text-white/72">{service.role}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.responsibilities.map((item) => (
                  <span key={item} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="py-16 sm:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-reverse">Command Roadmap</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Command yang menyatukan bot dengan website</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {botCommandRoadmap.map((group) => (
              <article key={group.bot} className="glass rounded-[2rem] p-6 sm:p-7">
                <h3 className="text-2xl font-black">{group.bot} Bot</h3>
                <div className="mt-6 flex flex-wrap gap-3">
                  {group.commands.map((command) => (
                    <code key={command} className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-black text-white/78">
                      {command}
                    </code>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="glass rounded-[2rem] p-7 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-red-reverse">
                  <ShieldCheck className="h-4 w-4" /> Privacy first
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Bot membantu komunitas tanpa membuka data private.</h2>
                <p className="mt-4 leading-7 text-white/70">
                  WhatsApp session, chat memory, token Discord, router key AI, dan data internal tetap berada di masing-masing service. Website hanya menampilkan dokumentasi dan data yang aman untuk publik.
                </p>
              </div>
              <Link href="/projects" className="inline-flex shrink-0 justify-center rounded-full bg-white px-6 py-3 font-black text-black transition hover:bg-blue-reverse hover:text-white">
                Lihat Ecosystem Map
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
