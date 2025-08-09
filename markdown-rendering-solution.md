# Markdown 页面渲染方案

## 架构设计

基于内容与展示分离的设计模式，采用纯 Markdown 文件 + 公共组件架构，便于团队协作和内容管理。

```text
📁 项目结构
├── components/legal-page-markdown.tsx               # 法律页面专用渲染组件
├── app/_components/laws/[page-name]/content.md      # 纯 Markdown 内容文件
└── app/(laws)/[page-name]/page.tsx                  # 页面组件
```

**技术栈**: `react-markdown` + `remark-gfm` + `remark-breaks` + Tailwind CSS Prose + Node.js `fs`

## 核心组件

### 1. 渲染组件 (`LegalPageMarkdown`)

```typescript
interface LegalPageMarkdownProps {
  content: string          // Markdown 内容
  className?: string       // 额外自定义样式类
}
```

**特点**：

- 内置完整的法律页面样式
- 包含布局容器 (`max-w-7xl mx-auto px-6 py-8`)
- 兼容新版 `react-markdown` (无 className prop 问题)
- 支持 GFM 和换行等 Markdown 扩展

### 2. 内容文件 (`content.md`) - 纯 Markdown

```markdown
# 页面标题

**Last Updated: 07.25.2025**

页面内容...
```

### 3. 页面组件实现

```typescript
import { LegalPageMarkdown } from "@/components/legal-page-markdown";
import { readFileSync } from "fs";
import { join } from "path";

export default function Page() {
  const contentPath = join(process.cwd(), "app/_components/laws/xxx/content.md");
  const content = readFileSync(contentPath, "utf8");
  
  return <LegalPageMarkdown content={content} />;
}
```

## 优势

- **真正的 Markdown**: 使用标准 `.md` 文件，编辑器友好
- **公共组件**: 样式统一管理，消除重复代码
- **服务器端渲染**: 构建时读取文件，性能优异
- **兼容性强**: 解决新版 `react-markdown` 的 className 问题
- **维护性高**: 样式修改只需更新一个组件
- **内容与代码完全分离**: Markdown 内容独立于 TypeScript 代码
- **协作友好**: 非技术人员可直接编辑 Markdown
- **版本控制**: Git 可以追踪内容变更
- **灵活扩展**: 支持 GFM 和换行等 Markdown 扩展

## 快速使用

### 1. 创建 Markdown 内容文件

```markdown
<!-- app/_components/laws/new-page/content.md -->

内容...
```

### 2. 创建页面组件

```typescript
// app/(laws)/new-page/page.tsx
import { LegalPageMarkdown } from "@/components/legal-page-markdown";
import { readFileSync } from "fs";
import { join } from "path";

export default function NewPage() {
  const contentPath = join(process.cwd(), "app/_components/laws/new-page/content.md");
  const content = readFileSync(contentPath, "utf8");
  
  return <LegalPageMarkdown content={content} />;
}
```
