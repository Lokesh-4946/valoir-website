import type { DocBlock } from "@/content/docs/types";
import { slugifyHeading } from "@/lib/docs";
import CopyButton from "@/components/CopyButton";
import StatusBadge from "./StatusBadge";
import { renderInline } from "./inline";

const CALLOUT_TONES = {
  note: "border-line text-muted",
  now: "border-teal text-muted",
  preview: "border-accent text-muted",
  planned: "border-rose text-muted",
} as const;

function Heading({ block }: { block: Extract<DocBlock, { type: "h" }> }) {
  const id = slugifyHeading(block.text);
  const Tag = block.level === 2 ? "h2" : "h3";
  const size = block.level === 2 ? "text-xl" : "text-lg";
  return (
    <Tag id={id} className={`group scroll-mt-24 ${size} mt-10 font-semibold text-fg`}>
      <a href={`#${id}`} className="no-underline">
        {renderInline(block.text)}
        <span aria-hidden className="ml-2 text-faint opacity-0 transition-opacity group-hover:opacity-100">
          #
        </span>
      </a>
      {block.status && <StatusBadge status={block.status} />}
    </Tag>
  );
}

function CodeBlock({ block }: { block: Extract<DocBlock, { type: "code" }> }) {
  return (
    <div className="group relative mt-5">
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton text={block.code} />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-line bg-[var(--bg-2)] p-5 font-mono text-[13px] leading-relaxed text-bone">
        <code>
          {block.code.split("\n").map((line, i) => {
            const isComment = line.trimStart().startsWith("#");
            return (
              <span key={i} className={isComment ? "block text-faint" : "block"}>
                {line || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function Table({ block }: { block: Extract<DocBlock, { type: "table" }> }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse font-mono text-sm">
        <thead>
          <tr className="border-b border-line bg-[var(--bg-2)]">
            {block.head.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-fg">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-muted">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "h":
      return <Heading block={block} />;
    case "p":
      return <p className="mt-5 leading-relaxed text-muted">{renderInline(block.text)}</p>;
    case "code":
      return <CodeBlock block={block} />;
    case "ul":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="border-l border-line pl-4 leading-relaxed text-muted">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case "table":
      return <Table block={block} />;
    case "callout":
      return (
        <div className={`mt-6 rounded-xl border border-l-2 bg-[var(--bg-2)] px-5 py-4 text-sm leading-relaxed ${CALLOUT_TONES[block.tone]}`}>
          {renderInline(block.text)}
        </div>
      );
  }
}

export default function DocContent({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="font-mono text-[15px]">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
