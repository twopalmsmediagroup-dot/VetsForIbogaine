import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ children, className = "" }: { children: string | null | undefined; className?: string }) {
  if (!children) return null;
  return (
    <div className={`prose-vfi ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, node: _node, ...rest }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
