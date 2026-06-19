import { siteConfig } from "@/data/community";
import { readFreshDiscordGuildSnapshot } from "@/lib/discord-snapshot";

export type DiscordStats = {
  members: number;
  online: number;
  events: number;
  invite: string;
  source: "live" | "fallback";
  note?: string;
};

type DiscordWidgetResponse = {
  id?: string;
  name?: string;
  instant_invite?: string;
  presence_count?: number;
  members?: unknown[];
};

export async function getDiscordStats(): Promise<DiscordStats> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const fallback: DiscordStats = {
    ...siteConfig.statsFallback,
    invite: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || siteConfig.inviteUrl,
    source: "fallback",
    note: "Discord widget belum aktif atau guild ID belum dikonfigurasi."
  };

  const snapshot = await readFreshDiscordGuildSnapshot();
  if (snapshot?.memberCount) {
    const widgetStats = guildId ? await getDiscordWidgetStats(guildId, fallback) : null;

    return {
      members: snapshot.memberCount,
      online: widgetStats?.online ?? fallback.online,
      events: fallback.events,
      invite: widgetStats?.invite ?? fallback.invite,
      source: "live",
      note: `Total member dari Reverse Discord Bot${snapshot.guildName ? ` (${snapshot.guildName})` : ""}. Online presence ${widgetStats ? "dari Discord Widget" : "memakai fallback"}.`
    };
  }

  if (!guildId) return fallback;

  const widgetStats = await getDiscordWidgetStats(guildId, fallback);
  return widgetStats ?? fallback;
}

async function getDiscordWidgetStats(guildId: string, fallback: DiscordStats): Promise<DiscordStats | null> {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/widget.json`, {
      next: { revalidate: 300 },
      headers: { accept: "application/json" }
    });

    if (!response.ok) return null;

    const data = (await response.json()) as DiscordWidgetResponse;

    return {
      members: fallback.members,
      online: data.presence_count ?? data.members?.length ?? fallback.online,
      events: fallback.events,
      invite: data.instant_invite || fallback.invite,
      source: "live",
      note: "Discord widget hanya menyediakan online presence. Total member memakai fallback sampai bot/API internal ditambahkan."
    };
  } catch {
    return null;
  }
}
