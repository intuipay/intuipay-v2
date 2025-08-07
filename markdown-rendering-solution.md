# Markdown 页面渲染方案

## 架构设计

基于内容与展示分离的设计模式，便于团队协作和内容管理。

```text
📁 项目结构
├── components/markdown-preview-with-no-style.tsx    # 核心渲染组件
├── app/_components/laws/[page-name]/content.ts      # 内容文件
└── app/(laws)/[page-name]/page.tsx                  # 页面组件
```

**技术栈**: `react-markdown` + `remark-gfm` + `remark-breaks` + Tailwind CSS Prose

## 核心组件

### 1. 渲染组件 (`MarkdownPreviewWithNoStyle`)

```typescript
interface MarkdownPreviewWithNoStyleProps {
  content: string          // Markdown 内容
  className?: string       // 自定义样式类
  minHeight?: string       // 最小高度
}
```

### 2. 内容文件 (`content.ts`)

```typescript
export const content = `# 页面标题
**更新时间: 07.25.2025**
页面内容...
`;
```

### 3. 页面组件样式

```typescript
<MarkdownPreviewWithNoStyle
  className="prose prose-sm max-w-none
    prose-h1:text-4xl prose-h1:font-semibold
    prose-p:text-gray-700 prose-a:text-blue-600"
  content={content}
/>
```

## 优势

- **内容与代码分离**: 内容更新无需修改组件
- **高度复用**: 一个组件支持所有 Markdown 页面
- **样式灵活**: 每个页面可独立定制样式
- **协作友好**: 非技术人员可直接编辑 Markdown

## 快速使用

### 1. 创建内容文件

```typescript
// app/_components/laws/new-page/content.ts
export const content = `# 新页面标题
内容...`;
```

### 2. 创建页面组件

```typescript
// app/(laws)/new-page/page.tsx
import { MarkdownPreviewWithNoStyle } from "@/components/markdown-preview-with-no-style";
import { content } from "@/app/_components/laws/new-page/content";

export default function NewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <MarkdownPreviewWithNoStyle
        className="prose prose-sm max-w-none [自定义样式]"
        content={content}
      />
    </div>
  );
}
```

## 最佳实践

1. **内容组织**: 按业务逻辑分组存放内容文件
2. **样式一致性**: 建立样式指南，确保页面视觉一致
3. **性能优化**: 大型文档考虑懒加载
4. **版本控制**: 内容变更通过 Git 追踪
