import { LegalFiles } from '@/content';
import Link from "next/link";
import slugify from "slugify";

export default function LegalPage() {
  return (
    <main className="flex-1 container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Legal files</h1>
      <ul>
        {LegalFiles.map(file => (
          <li>
            <Link
              className="block py-2 text-blue-600 underline hover:no-underline"
              href={`/${slugify(file, { lower: true, remove: /[*+~.()'"!:@]/g })}`}
              key={file}
            >{file}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
