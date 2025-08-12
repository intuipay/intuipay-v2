'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface LegalPageMarkdownProps {
  content: string
  className?: string
}

export function LegalPageMarkdown({ content, className = '' }: LegalPageMarkdownProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className={`prose prose-sm max-w-none
        prose-h1:text-4xl prose-h1:font-semibold prose-h1:mb-8 prose-h1:border-none prose-h1:text-gray-900
        prose-h2:text-lg prose-h2:font-semibold prose-h2:mt-6 prose-h2:text-gray-900
        prose-p:mt-6 prose-p:text-gray-700 prose-p:leading-relaxed
        prose-ul:list-disc prose-ul:list-inside prose-ul:mb-4 prose-ul:space-y-2 prose-ul:marker:text-gray-700
        prose-ol:list-decimal prose-ol:list-inside prose-ol:mb-4 prose-ol:space-y-2 prose-ol:marker:text-gray-700
        prose-li:text-gray-700
        prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:transition-colors prose-a:no-underline
        prose-strong:font-bold prose-strong:text-gray-700
        prose-em:italic prose-em:text-gray-800
        prose-hr:my-6 prose-hr:border-gray-300
        [&_p:nth-of-type(1)_strong]:font-bold [&_p:nth-of-type(1)_strong]:text-gray-600
        [&_p:nth-of-type(2)]:text-gray-600 [&_p:nth-of-type(2)]:text-sm [&_p:nth-of-type(2)]:font-medium
        ${className}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
