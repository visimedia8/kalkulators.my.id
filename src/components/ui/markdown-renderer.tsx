import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css"; // Ensure KaTeX CSS is loaded

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="w-full text-secondary leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold font-display text-primary mt-10 mb-4 tracking-tight" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold font-display text-primary mt-8 mb-3" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-medium font-sans text-primary mt-6 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 text-[15px] lg:text-base opacity-90 leading-7" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside ml-5 mb-6 space-y-2 opacity-90" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside ml-5 mb-6 space-y-2 opacity-90" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="pl-1" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-primary" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-accent pl-4 italic opacity-80 my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto mb-6 border border-border rounded-lg">
              <table className="w-full text-left text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-surface text-primary font-semibold border-b border-border" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="p-3" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-3 border-b border-border/50" {...props} />
          ),
          code: ({ node, ...props }) => {
            return (
              <code className="font-mono text-sm text-accent bg-accent/10 px-1.5 py-0.5 rounded" {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
