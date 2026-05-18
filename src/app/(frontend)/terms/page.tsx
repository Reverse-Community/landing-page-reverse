import { LegalPage } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function TermsPage() {
  const page = await getLegalPageContent("terms");
  return (
    <LegalPage title={page.title} description={page.description}>
      <h2>1. Penggunaan Website</h2>
      <p>Website Reverse Community digunakan sebagai landing page, pusat informasi komunitas, event, highlight, dan konten publik lain.</p>
      <h2>2. Komunitas</h2>
      <p>Dengan bergabung ke komunitas, kamu setuju untuk mengikuti aturan platform terkait dan pedoman komunitas Reverse.</p>
      <h2>3. Konten</h2>
      <p>Konten event, highlight, merch, dan member showcase dapat berubah sewaktu-waktu melalui CMS.</p>
      <h2>4. Perubahan</h2>
      <p>Reverse dapat memperbarui syarat ini untuk menjaga keamanan dan kualitas komunitas.</p>
    </LegalPage>
  );
}
