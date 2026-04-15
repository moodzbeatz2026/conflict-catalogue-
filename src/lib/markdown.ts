import ReactDOMServer from "react-dom/server";
import { createElement } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text, Link, InlineCode } from "mdast";

/**
 * A remark plugin that transforms citation markers like [1], [2] in text nodes
 * into link nodes with superscript content, rendered as citation references.
 */
const remarkCitations: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const citationPattern = /\[(\d+)\]/g;
      const text = node.value;

      if (!citationPattern.test(text)) return;

      // Reset lastIndex after test
      citationPattern.lastIndex = 0;

      const newNodes: (Text | Link)[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = citationPattern.exec(text)) !== null) {
        const [fullMatch, num] = match;
        const matchStart = match.index;

        // Add text before this citation
        if (matchStart > lastIndex) {
          newNodes.push({
            type: "text",
            value: text.slice(lastIndex, matchStart),
          });
        }

        // Add a link node for the citation
        newNodes.push({
          type: "link",
          url: `#source-${num}`,
          data: {
            hProperties: { className: "citation-ref" },
          },
          children: [
            {
              type: "html" as "html",
              value: `<sup>[${num}]</sup>`,
            } as unknown as Text,
          ],
        } as Link);

        lastIndex = matchStart + fullMatch.length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        newNodes.push({
          type: "text",
          value: text.slice(lastIndex),
        });
      }

      // Replace the current text node with new nodes
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...(newNodes as typeof parent.children));
        return index + newNodes.length;
      }
    });
  };
};

export function renderMarkdown(content: string): string {
  const element = createElement(Markdown, {
    remarkPlugins: [remarkGfm, remarkCitations],
    children: content,
  });

  return ReactDOMServer.renderToStaticMarkup(element);
}
