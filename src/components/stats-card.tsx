"use client";

import { useEffect, useState } from "react";
import { formatCompact } from "@/lib/utils";

type Stats = {
  members: number;
  online: number;
  events: number;
  source: "live" | "fallback";
};

type StatsCardProps = {
  fallback: Stats;
};

export function StatsCard({ fallback }: StatsCardProps) {
  const [stats, setStats] = useState<Stats>(fallback);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch("/api/discord-stats", { cache: "no-store" });
        if (!response.ok) return;
        const nextStats = (await response.json()) as Stats;
        if (!cancelled) setStats(nextStats);
      } catch {
        // Keep fallback visible. Stats should never break the landing page.
      }
    }

    loadStats();
    const interval = window.setInterval(loadStats, 300_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const items = [
    { label: "Members", value: stats.members, sub: "komunitas" },
    { label: "Online", value: stats.online, sub: stats.source === "live" ? "live now" : "fallback" },
    { label: "Events", value: stats.events, sub: "terkurasi" }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {items.map((item, index) => (
        <div key={item.label} className="glass group relative overflow-hidden rounded-2xl p-3 sm:p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div
            className={index === 1 ? "absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-reverse shadow-blue" : "absolute right-4 top-4 h-2 w-2 rounded-full bg-red-reverse shadow-red"}
          />
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/65 sm:text-xs sm:tracking-[0.28em]">{item.label}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-4xl">{formatCompact(item.value)}</p>
          <p className="mt-1 text-xs text-white/65 sm:text-sm">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
