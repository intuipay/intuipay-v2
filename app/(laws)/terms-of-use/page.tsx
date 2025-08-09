import { LegalPageMarkdown } from "@/components/legal-page-markdown";
import content from "@/app/_components/laws/terms-of-use/content.md";

export default function TermsOfUsePage() {
  return <LegalPageMarkdown content={content} />;
}
