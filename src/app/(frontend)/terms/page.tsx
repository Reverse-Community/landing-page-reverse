import { LegalPage } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function TermsPage() {
  const page = await getLegalPageContent("terms");

  return (
    <LegalPage title={page.title} description={page.description}>
      <h2>1. Penggunaan Website</h2>
      <p>
        Website Reverse Community digunakan sebagai pusat informasi komunitas,
        event, showcase, merchandise, dan berbagai konten publik lainnya yang
        berkaitan dengan ekosistem Reverse.
      </p>

      <h2>2. Aturan Komunitas</h2>
      <p>
        Dengan mengakses website atau bergabung ke komunitas Reverse, pengguna
        dianggap memahami dan menyetujui aturan komunitas serta kebijakan
        platform terkait, termasuk Discord dan layanan pihak ketiga lainnya.
      </p>

      <h2>3. Konten & Media</h2>
      <p>
        Konten seperti event, highlight komunitas, member showcase, gallery,
        maupun merchandise dapat diperbarui, diubah, atau dihapus sewaktu-waktu
        melalui sistem untuk menjaga relevansi dan kualitas informasi.
      </p>

      <h2>4. Hak Pengelolaan</h2>
      <p>
        Tim Reverse berhak melakukan moderasi, pembaruan konten, pembatasan
        akses tertentu, atau perubahan fitur demi menjaga keamanan dan kenyamanan
        komunitas.
      </p>

      <h2>5. Perubahan Ketentuan</h2>
      <p>
        Syarat dan ketentuan ini dapat diperbarui sewaktu-waktu mengikuti
        perkembangan komunitas, fitur website, maupun kebutuhan operasional
        Reverse Community.
      </p>
    </LegalPage>
  );
}
