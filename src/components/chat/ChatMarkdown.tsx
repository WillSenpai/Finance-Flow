import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { Components } from "react-markdown";

const MermaidDiagram = lazy(() => import("./MermaidDiagram"));

interface ChatMarkdownProps {
  content: string;
}

const ChatMarkdown = ({ content }: ChatMarkdownProps) => {
  const navigate = useNavigate();
  const isIOSNative = Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

  const components: Components = {
    a: ({ href, children, ...props }) => {
      if (href?.startsWith("investo:")) {
        const path = href.replace("investo:", "");
        return (
          <button
            onClick={() => navigate(path)}
            className="inline-flex items-center gap-1.5 my-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
          >
            {children}
            <ChevronRight size={14} />
          </button>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline" {...props}>
          {children}
        </a>
      );
    },
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match?.[1];
      const codeStr = String(children).replace(/\n$/, "");

      if (lang === "mermaid") {
        // Temporary iOS native fallback: avoid Mermaid runtime crash in WKWebView.
        if (isIOSNative) {
          return (
            <pre className="bg-muted text-foreground text-xs p-3 rounded-xl overflow-x-auto my-2">
              <code>{codeStr}</code>
            </pre>
          );
        }

        return (
          <Suspense fallback={<div className="bg-muted rounded-xl p-4 animate-pulse h-32" />}>
            <MermaidDiagram chart={codeStr} />
          </Suspense>
        );
      }

      // Inline code vs block code
      if (!className) {
        return (
          <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
            {children}
          </code>
        );
      }

      return (
        <pre className="bg-muted text-foreground text-xs p-3 rounded-xl overflow-x-auto my-2">
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto my-2 rounded-xl border border-border/50">
        <table className="w-full text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted/50 text-muted-foreground font-semibold">{children}</thead>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 border-t border-border/30">{children}</td>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 text-left font-semibold">{children}</th>
    ),
  };

  const urlTransform = (url: string) => {
    if (url.startsWith("investo:")) return url;
    // Default behavior: sanitize
    const decoded = decodeURIComponent(url);
    if (decoded.startsWith("javascript:") || decoded.startsWith("vbscript:") || decoded.startsWith("data:")) return "";
    return url;
  };

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components} urlTransform={urlTransform}>{content}</ReactMarkdown>
    </div>
  );
};

export default ChatMarkdown;
