import { LegalPage } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function PrivacyPage() {
  const page = await getLegalPageContent("privacy");
  return (
    <LegalPage title={page.title} description={page.description}>
      <h2>Data yang Diproses</h2>
      <p>Website dapat memproses data teknis dasar seperti request log server, analytics anonim, dan data publik dari Discord Widget API.</p>
      <h2>Discord</h2>
      <p>Tombol join akan membawa kamu ke Discord. Aktivitas di Discord mengikuti kebijakan Discord dan aturan server Reverse.</p>
      <h2>CMS Admin</h2>
      <p>Admin CMS dilindungi oleh Payload authentication dan basic-auth gate berbasis environment variable.</p>
      <h2>Analytics</h2>
      <p>Jika analytics diaktifkan, Reverse disarankan memakai analytics privacy-friendly seperti Umami.</p>
    </LegalPage>
  );
}
