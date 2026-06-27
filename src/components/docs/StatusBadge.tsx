import type { DocStatus } from "@/content/docs/types";

const LABELS: Record<DocStatus, string> = {
  now: "now",
  preview: "preview",
  planned: "planned",
};

// Teal = shipped, gold = next milestone, rose = later. Text label carries the
// meaning too, so we never rely on color alone.
const TONES: Record<DocStatus, string> = {
  now: "border-teal text-teal",
  preview: "border-accent text-accent",
  planned: "border-rose text-rose",
};

const TITLES: Record<DocStatus, string> = {
  now: "Available in the current build",
  preview: "Available in preview",
  planned: "Planned — not shipped yet",
};

export default function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      title={TITLES[status]}
      className={`ml-2 inline-block translate-y-[-1px] rounded-full border px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-eyebrow ${TONES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
