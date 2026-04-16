import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function IncidentBody({ body }: { body: string }) {
  // Convert citation markers [1], [2] to markdown links
  const withCitations = body.replace(
    /\[(\d+)\]/g,
    "[[$1]](#source-$1)"
  );

  return (
    <div className="prose-incident max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const isCitation = href?.startsWith("#source-");
            if (isCitation) {
              return (
                <a
                  href={href}
                  className="citation-ref text-blue-700 no-underline hover:underline"
                  {...props}
                >
                  <sup>{children}</sup>
                </a>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {withCitations}
      </ReactMarkdown>
    </div>
  );
}
