import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const defaultSiteUrl = "https://reverse.my.id";

function resolveSiteUrl() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).origin;
  } catch {
    return defaultSiteUrl;
  }
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Reverse Community — Connect, Play, Grow",
    template: "%s | Reverse Community"
  },
  description: "Reverse Community adalah komunitas Indonesia untuk ngobrol, mabar, belajar, dan tumbuh bareng.",
  openGraph: {
    title: "Reverse Community",
    description: "Komunitas yang nyambung, hangat, dan selalu hidup.",
    url: siteUrl,
    siteName: "Reverse Community",
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Reverse Community",
    description: "Connect, play, learn, and grow together."
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-mark.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} bg-base font-sans text-ink antialiased`}>
        {umamiScriptUrl && umamiWebsiteId ? <Script defer src={umamiScriptUrl} data-website-id={umamiWebsiteId} strategy="afterInteractive" /> : null}
        {children}
      </body>
    </html>
  );
}
