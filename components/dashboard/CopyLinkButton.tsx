"use client";

import { useState, useEffect } from "react";

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? `${origin}/${slug}` : `/${slug}`;

  async function copy() {
    const fullUrl = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(fullUrl);
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
