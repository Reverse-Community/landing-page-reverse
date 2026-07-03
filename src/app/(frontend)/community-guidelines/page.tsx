import { LegalPage, PlainLegalContent } from "@/components/legal-page";
import { getLegalPageContent } from "@/lib/content";

export default async function CommunityGuidelinesPage() {
  const page = await getLegalPageContent("community-guidelines");
  return (
    <LegalPage title={page.title} description={page.description}>
      <PlainLegalContent content={page.content} />
    </LegalPage>
  );
}
