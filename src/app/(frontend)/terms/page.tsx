import { LegalPage, PlainLegalContent } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function TermsPage() {
  const page = await getLegalPageContent("terms");

  return (
    <LegalPage title={page.title} description={page.description}>
      <PlainLegalContent content={page.content} />
    </LegalPage>
  );
}
