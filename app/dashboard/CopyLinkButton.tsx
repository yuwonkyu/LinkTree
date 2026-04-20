"use client";

import { useState } from "react";

export default function CopyLinkButton({ slug }: { slug: string }) {
  const url = `https://instalink.vercel.app/${slug}`;
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-(--secondary) px-3 py-2">
      <span className="flex-1 truncate text-sm text-(--muted)">{url}</span>
      <button onClick={copy} className="text-xs font-medium text-foreground">
        {copied ? "✓ 복사됨" : "복사"}
      </button>
    </div>
  );
}
