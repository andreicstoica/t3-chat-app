"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "~/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:font-display prose-headings:mystical-text",
        "prose-h1:text-xl prose-h1:mt-6 prose-h1:mb-4 prose-h1:font-semibold first:prose-h1:mt-1",
        "prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-3 prose-h2:font-semibold first:prose-h2:mt-1",
        "prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-h3:font-medium first:prose-h3:mt-1",
        "prose-h4:text-sm prose-h4:mt-3 prose-h4:mb-2 prose-h4:font-medium first:prose-h4:mt-1",
        "prose-h5:text-sm prose-h5:mt-3 prose-h5:mb-2 prose-h5:font-medium first:prose-h5:mt-1",
        "prose-h6:text-sm prose-h6:mt-3 prose-h6:mb-2 prose-h6:font-medium first:prose-h6:mt-1",
        "prose-p:my-3 prose-p:leading-relaxed first:prose-p:mt-1",
        "prose-ul:my-4 prose-ul:space-y-2 first:prose-ul:mt-1",
        "prose-ol:my-4 prose-ol:space-y-2 first:prose-ol:mt-1",
        "prose-li:my-1.5 prose-li:leading-relaxed",
        "prose-strong:text-primary prose-em:text-accent",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:border prose-pre:tarot-border",
        "prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
