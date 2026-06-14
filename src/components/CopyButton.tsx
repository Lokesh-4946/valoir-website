"use client";

import { useState } from "react";

/** Copy-to-clipboard button used for install/usage commands. */
export default function CopyButton({
  text,
  label = "copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={onCopy}
      data-cursor="grow"
      aria-label="Copy to clipboard"
      className={`shrink-0 rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {copied ? "copied ✓" : label}
    </button>
  );
}
