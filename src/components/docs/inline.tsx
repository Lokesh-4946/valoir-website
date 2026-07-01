import { Fragment, type ReactNode } from "react";
import type { DocStatus } from "@/content/docs/types";
import StatusBadge from "./StatusBadge";

/**
 * Renders the tiny inline markup used in docs text into React nodes:
 *   `code` · **bold** · [text](url) · bare https:// urls · [now]/[planned].
 * Plain text between tokens is returned verbatim (React escapes it).
 */
const TOKEN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|(\[(?:now|planned)\])|(https?:\/\/[^\s)]+)/g;

function externalLink(text: string, href: string, key: number): ReactNode {
  const external = href.startsWith("http");
  return (
    <a
      key={key}
      href={href}
      className="text-accent underline decoration-line underline-offset-2 hover:decoration-accent"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {text}
    </a>
  );
}

export function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, index)}</Fragment>);
    }

    const [token, code, bold, link, status, url] = match;

    if (code) {
      nodes.push(
        <code key={key++} className="rounded bg-[var(--bg-2)] px-1.5 py-0.5 font-mono text-[0.85em] text-bone">
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      nodes.push(
        <strong key={key++} className="font-semibold text-fg">
          {bold.slice(2, -2)}
        </strong>,
      );
    } else if (link) {
      const m = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      nodes.push(m ? externalLink(m[1], m[2], key++) : <Fragment key={key++}>{link}</Fragment>);
    } else if (status) {
      nodes.push(<StatusBadge key={key++} status={status.slice(1, -1) as DocStatus} />);
    } else if (url) {
      nodes.push(externalLink(url, url, key++));
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}
