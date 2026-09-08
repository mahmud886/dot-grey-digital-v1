import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { ReactNode } from "react";
import { resolveDocHref, slugifyHeading } from "@/lib/docs";

/** Pulls the plain text out of a heading's children so it can become an anchor id. */
function headingId(children: ReactNode): string {
  const flatten = (node: ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(flatten).join("");
    if (node && typeof node === "object" && "props" in node) {
      return flatten((node as { props: { children?: ReactNode } }).props.children);
    }
    return "";
  };
  return slugifyHeading(flatten(children));
}

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h2 id={headingId(children)} className="mt-14 scroll-mt-28 font-display text-h2 text-fg first:mt-0">
            {children}
          </h2>
        ),
        h2: ({ children }) => (
          <h2
            id={headingId(children)}
            className="mt-14 scroll-mt-28 border-t border-line pt-10 font-display text-h2 text-fg first:mt-0 first:border-0 first:pt-0"
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 id={headingId(children)} className="mt-10 scroll-mt-28 font-display text-h3 text-fg">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 id={headingId(children)} className="mt-8 scroll-mt-28 font-display text-lg text-fg">
            {children}
          </h4>
        ),
        p: ({ children }) => <p className="mt-5 text-fg-muted">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
        em: ({ children }) => <em className="text-fg">{children}</em>,
        hr: () => <hr className="mt-12 border-t border-line" />,

        a: ({ href, children }) => {
          const resolved = href ? resolveDocHref(href) : null;
          // Links to repo files that are not docs (.env.example, source paths) have no
          // route to point at, so they render as inline code rather than dead links.
          if (!resolved) {
            return (
              <code className="rounded bg-bg-card px-1.5 py-0.5 font-mono text-[0.875em] text-accent">
                {children}
              </code>
            );
          }
          if (resolved.startsWith("http")) {
            return (
              <a
                href={resolved}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {children}
              </a>
            );
          }
          return (
            <Link
              href={resolved}
              className="text-accent underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              {children}
            </Link>
          );
        },

        ul: ({ children }) => <ul className="mt-5 flex flex-col gap-2.5">{children}</ul>,
        ol: ({ children }) => (
          <ol className="mt-5 flex list-decimal flex-col gap-2.5 pl-5 marker:text-accent">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="text-fg-muted">{children}</li>,

        blockquote: ({ children }) => (
          <blockquote className="mt-6 border-l-2 border-accent bg-accent-dim py-1 pl-5">
            {children}
          </blockquote>
        ),

        code: ({ className, children }) => {
          const isBlock = Boolean(className?.startsWith("language-"));
          if (isBlock) return <code className="font-mono text-sm text-fg">{children}</code>;
          return (
            <code className="rounded bg-bg-card px-1.5 py-0.5 font-mono text-[0.875em] text-accent">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-bg-card p-5">
            {children}
          </pre>
        ),

        // Wide tables scroll inside their own container so the page never does.
        table: ({ children }) => (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-bg-card">{children}</thead>,
        tr: ({ children }) => <tr className="border-b border-line last:border-0">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-3 align-top font-display text-eyebrow font-semibold tracking-[0.12em] uppercase text-fg-muted">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-4 py-3 align-top text-fg-muted">{children}</td>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
