import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

function CmsNotAvailable() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#050509", color: "#aeb7d0", fontFamily: "system-ui, sans-serif", flexDirection: "column", gap: 16 }}
    >
      <h1 style={{ color: "#fff", fontSize: 28 }}>CMS Admin</h1>
      <p>Tidak tersedia di Cloudflare lean mode.</p>
      <p style={{ fontSize: 14, opacity: 0.6 }}>Jalankan di VPS Docker dengan <code>DATABASE_URL</code> untuk mengaktifkan CMS.</p>
    </div>
  );
}

const AdminPage = dynamic(
  () => {
    if (!process.env.DATABASE_URL) {
      return Promise.resolve(() => <CmsNotAvailable />);
    }
    return import("./payload-admin").then((mod) => mod.default);
  },
  { ssr: true }
);

export default function Page() {
  return <AdminPage />;
}
