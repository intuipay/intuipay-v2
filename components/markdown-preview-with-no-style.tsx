"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

interface MarkdownPreviewWithNoStyleProps {
  content: string
  className?: string
  minHeight?: string
}

export function MarkdownPreviewWithNoStyle({ content, className = "", minHeight = "500px" }: MarkdownPreviewWithNoStyleProps) {
  if (!content.trim()) {
    return (
      <div
        className={`flex items-center justify-center text-gray-500 italic border-2 border-dashed border-gray-200 rounded-lg ${className}`}
        style={{ minHeight }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📝</div>
          <div>Nothing to preview yet.</div>
          <div className="text-sm">Start writing in the editor!</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`} style={{ minHeight }}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
