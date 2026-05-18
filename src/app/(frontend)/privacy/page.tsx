import { LegalPage } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function PrivacyPage() {
  const page = await getLegalPageContent("privacy");

  return (
    <LegalPage title={page.title} description={page.description}>
      {/* <h2>Informasi yang Dikumpulkan</h2>
      <p>
        Reverse dapat memproses data teknis dasar seperti request log server,
        analytics anonim, serta informasi publik yang tersedia melalui Discord
        Widget API untuk meningkatkan pengalaman komunitas.
      </p> */}

      <h2>Discord & Komunitas</h2>
      <p>
        Beberapa fitur dan tombol pada website akan mengarahkan pengguna ke
        server Discord Reverse. Aktivitas di Discord sepenuhnya mengikuti
        kebijakan Discord serta peraturan komunitas Reverse.
      </p>

      {/* <h2>Keamanan Admin CMS</h2>
      <p>
        Panel admin CMS dilindungi menggunakan authentication Payload CMS dan
        lapisan keamanan tambahan berbasis environment variable untuk membatasi
        akses yang tidak sah.
      </p> */}

      {/* <h2>Analytics</h2>
      <p>
        Jika analytics diaktifkan, Reverse disarankan menggunakan layanan
        privacy-friendly seperti Umami untuk memantau performa website tanpa
        mengumpulkan data pribadi yang sensitif.
      </p> */}

      <h2>Perubahan Kebijakan</h2>
      <p>
        Kebijakan privasi ini dapat diperbarui sewaktu-waktu mengikuti
        perkembangan fitur, layanan, atau kebutuhan komunitas Reverse.
      </p>
    </LegalPage>
  );
}
