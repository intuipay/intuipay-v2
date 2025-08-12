'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface MarkdownPreviewProps {
  content: string
  className?: string
  minHeight?: string
}

export function MarkdownPreview({ content, className = '', minHeight = '500px' }: MarkdownPreviewProps) {
  const components = useMemo(
    () => ({
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[ 1 ] : ''

        return !inline ? (
          <div className="relative">
            {language && (
              <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {language}
              </div>
            )}
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm font-mono" {...props}>
                {String(children).replace(/\n$/, '')}
              </code>
            </pre>
          </div>
        ) : (
          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props}>
            {children}
          </code>
        )
      },
      blockquote({ children }: any) {
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 bg-blue-50 py-2 rounded-r">
            {children}
          </blockquote>
        )
      },
      table({ children }: any) {
        return (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">{children}</table>
          </div>
        )
      },
      thead({ children }: any) {
        return <thead className="bg-gray-100">{children}</thead>
      },
      th({ children }: any) {
        return <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">{children}</th>
      },
      td({ children }: any) {
        return <td className="border border-gray-300 px-4 py-3 text-gray-700">{children}</td>
      },
      h1({ children }: any) {
        return <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">{children}</h1>
      },
      h2({ children }: any) {
        return <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>
      },
      h3({ children }: any) {
        return <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-900">{children}</h3>
      },
      h4({ children }: any) {
        return <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900">{children}</h4>
      },
      h5({ children }: any) {
        return <h5 className="text-lg font-semibold mt-3 mb-2 text-gray-900">{children}</h5>
      },
      h6({ children }: any) {
        return <h6 className="text-base font-semibold mt-3 mb-2 text-gray-900">{children}</h6>
      },
      p({ children }: any) {
        return <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
      },
      ul({ children }: any) {
        return <ul className="list-disc list-inside mb-4 space-y-2 ml-4">{children}</ul>
      },
      ol({ children }: any) {
        return <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>
      },
      li({ children }: any) {
        return <li className="text-gray-700">{children}</li>
      },
      a({ href, children }: any) {
        return (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        )
      },
      img({ src, alt }: any) {
        return (
          <img
            src={src || '/placeholder.svg?height=200&width=400'}
            alt={alt || 'Image'}
            className="max-w-full h-auto rounded-lg shadow-md my-4 border"
          />
        )
      },
      hr() {
        return <hr className="my-8 border-gray-300" />
      },
      strong({ children }: any) {
        return <strong className="font-semibold text-gray-900">{children}</strong>
      },
      em({ children }: any) {
        return <em className="italic text-gray-800">{children}</em>
      },
    }),
    [],
  )

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
    <div className={`prose prose-sm max-w-none ${className}`} style={{ minHeight }}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
