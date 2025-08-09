import { LegalPageMarkdown } from "@/components/legal-page-markdown";
import { readFileSync } from "fs";
import { join } from "path";

export default function TermsOfUsePage() {
  const contentPath = join(process.cwd(), "app/_components/laws/terms-of-use/content.md");
  const content = readFileSync(contentPath, "utf8");
  
  return <LegalPageMarkdown content={content} />;
}
