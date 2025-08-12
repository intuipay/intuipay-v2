"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { EditorToolbar } from "@/components/editor-toolbar"
import { MarkdownPreview } from "@/components/markdown-preview"
import { cn } from "@/lib/utils"
import type { EditorAction } from "@/types/editor"

interface RichTextEditorProps {
  initialValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  height?: string
  disabled?: boolean
}

export default function RichTextEditor({
  initialValue = "",
  placeholder = "Start writing your markdown...",
  onChange,
  className = "",
  height = "200px",
  disabled = false,
}: RichTextEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "split">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Keep latest onChange in ref to avoid effect loops when parent passes new function each render
  const onChangeRef = useRef<typeof onChange>(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    onChangeRef.current?.(value)
  }, [value])
  // Sync when external initialValue prop changes (e.g., switching profile)
  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  const handleAction = useCallback(
    (action: EditorAction) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)

      let newValue = value
      let newCursorPos = start

      switch (action.type) {
        case "bold":
          newValue = value.substring(0, start) + `**${selectedText || "bold text"}**` + value.substring(end)
          newCursorPos = start + 2
          break
        case "italic":
          newValue = value.substring(0, start) + `*${selectedText || "italic text"}*` + value.substring(end)
          newCursorPos = start + 1
          break
        case "heading":
          const level = action.level || 1
          const prefix = "#".repeat(level) + " "
          const headingText = selectedText || `Heading ${level}`
          newValue = value.substring(0, start) + prefix + headingText + value.substring(end)
          newCursorPos = start + prefix.length
          break
        case "link":
          const linkText = selectedText || "link text"
          const linkUrl = action.url || "https://example.com"
          newValue = value.substring(0, start) + `[${linkText}](${linkUrl})` + value.substring(end)
          newCursorPos = start + 1
          break
        case "image":
          const altText = selectedText || "alt text"
          const imageUrl = action.url || "https://example.com/image.jpg"
          newValue = value.substring(0, start) + `![${altText}](${imageUrl})` + value.substring(end)
          newCursorPos = start + 2
          break
        case "unordered-list":
          newValue = value.substring(0, start) + `- ${selectedText || "list item"}` + value.substring(end)
          newCursorPos = start + 2
          break
        case "ordered-list":
          newValue = value.substring(0, start) + `1. ${selectedText || "list item"}` + value.substring(end)
          newCursorPos = start + 3
          break
        case "paragraph":
          newValue = value.substring(0, start) + `\n\n${selectedText || "paragraph"}\n\n` + value.substring(end)
          newCursorPos = start + 2
          break
        case "underline":
          const underlineText = selectedText || "underlined text"
          newValue = value.substring(0, start) + `<u>${underlineText}</u>` + value.substring(end)
          newCursorPos = selectedText ? start + underlineText.length + 7 : start + 3
          break
      }

      setValue(newValue)
      setTimeout(() => {
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [value],
  )

  return (
    <div className={cn("w-full", className)}>
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsContent value="write" className="mt-0">
              <div className="border-b px-4 py-2 bg-gray-50">
                <EditorToolbar onAction={handleAction} disabled={disabled} />
              </div>
              <div className="p-4">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="resize-none border-0 p-0 focus-visible:ring-0 font-mono text-sm leading-relaxed"
                  style={{ minHeight: height }}
                  disabled={disabled}
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <div className="p-4">
                <MarkdownPreview content={value} minHeight={height} />
              </div>
            </TabsContent>
            <TabsContent value="split" className="mt-0">
              <div className="border-b px-4 py-2 bg-gray-50">
                <EditorToolbar onAction={handleAction} disabled={disabled} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                <div className="p-4">
                  <div className="mb-2 text-sm font-medium text-gray-700">Editor</div>
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="resize-none border-0 p-0 focus-visible:ring-0 font-mono text-sm leading-relaxed"
                    style={{ minHeight: height }}
                    disabled={disabled}
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 text-sm font-medium text-gray-700">Preview</div>
                  <MarkdownPreview content={value} minHeight={height} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
