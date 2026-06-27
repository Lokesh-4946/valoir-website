/**
 * Docs content model — typed, dependency-free blocks.
 *
 * Adding a docs page = add one `DocPage` to `pages.ts`. The `src/lib/docs.ts`
 * service reads/sorts/selects these; routes under `app/docs/` render them.
 *
 * Inline text in `p`, list items, table cells, and callouts supports a tiny
 * markup subset (see `renderInline`): `code`, **bold**, [text](url), bare URLs,
 * and the status tokens [now] / [preview] / [planned] rendered as badges.
 */

export type DocStatus = "now" | "preview" | "planned";

export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h"; level: 2 | 3; text: string; status?: DocStatus }
  | { type: "code"; lang?: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "callout"; tone: "note" | "now" | "preview" | "planned"; text: string };

export type DocPage = {
  /** URL segment under /docs, e.g. "quickstart" */
  slug: string;
  /** short nav + heading label, e.g. "Quickstart" */
  title: string;
  /** one-line summary for <title>/meta description */
  description: string;
  /** sidebar + sitemap ordering (ascending) */
  order: number;
  blocks: DocBlock[];
};
