import { LegalPage } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function CommunityGuidelinesPage() {
  const page = await getLegalPageContent("community-guidelines");
  return (
    <LegalPage title={page.title} description={page.description}>
      <h2>Be Respectful</h2>
      <p>Jaga obrolan tetap aman, santai, dan saling menghargai. Hindari harassment, hate speech, spam, dan drama personal.</p>
      <h2>Play Fair</h2>
      <p>Untuk aktivitas game, gunakan cara bermain yang fair. Cheat, exploit, dan toxic behavior tidak diterima.</p>
      <h2>Keep It Useful</h2>
      <p>Gunakan channel sesuai topik. Bantu member baru beradaptasi dan jaga vibe komunitas tetap welcoming.</p>
      <h2>Moderation</h2>
      <p>Tim Reverse dapat memberi peringatan, timeout, atau ban jika ada pelanggaran serius.</p>
    </LegalPage>
  );
}
