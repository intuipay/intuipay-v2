export interface EditorAction {
  type:
    | "bold"
    | "italic"
    | "heading"
    | "link"
    | "image"
    | "unordered-list"
    | "ordered-list"
    | "paragraph"
    | "underline"
  level?: number
  url?: string
}
