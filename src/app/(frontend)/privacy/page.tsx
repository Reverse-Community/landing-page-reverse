import { LegalPage, PlainLegalContent } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function PrivacyPage() {
  const page = await getLegalPageContent("privacy");

  return (
    <LegalPage title={page.title} description={page.description}>
      <PlainLegalContent content={page.content} />
    </LegalPage>
  );
}
