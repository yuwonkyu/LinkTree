"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateSlug } from "@/app/dashboard/edit/actions";

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,1})$/;

type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

type Props = {
  currentSlug: string;
  siteUrl: string;
};

export default function SlugEditor({ currentSlug, siteUrl }: Props) {
  const [slug, setSlug]           = useState(currentSlug);
  const [status, setStatus]       = useState<SlugStatus>("idle");
  const [msg, setMsg]             = useState("");
  const [saveMsg, setSaveMsg]     = useState("");
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const val = slug.trim().toLowerCase();

    if (!val || val === currentSlug) {
      setStatus("idle");
      setMsg("");
      return;
    }

    if (val.length < 3) {
      setStatus("invalid");
      setMsg("3자 이상 입력해주세요.");
      return;
    }

    if (val.length > 30) {
      setStatus("invalid");
      setMsg("30자 이하로 입력해주세요.");
      return;
    }

    if (!SLUG_REGEX.test(val)) {
      setStatus("invalid");
      setMsg("소문자, 숫자, 하이픈(-)만 사용 가능합니다. 앞뒤·연속 하이픈 불가.");
      return;
    }

    setStatus("checking");
    setMsg("확인 중…");

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/profile/check-slug?slug=${encodeURIComponent(val)}&current=${encodeURIComponent(currentSlug)}`,
        );
        const { available, error } = await res.json();

        if (error) {
          setStatus("invalid");
          setMsg(error);
        } else if (available) {
          setStatus("available");
          setMsg("사용 가능한 주소입니다.");
        } else {
          setStatus("taken");
          setMsg("이미 사용 중인 주소입니다.");
        }
      } catch {
        setStatus("idle");
        setMsg("");
      }
    }, 500);
  }, [slug, currentSlug]);

  const isChanged = slug.trim().toLowerCase() !== currentSlug;
  const canSave   = isChanged && status === "available" && !isPending;

  const statusColor: Record<SlugStatus, string> = {
    idle:      "",
    checking:  "text-(--muted)",
    available: "text-green-600",
    taken:     "text-red-500",
    invalid:   "text-red-500",
  };

  function handleSave() {
    const val = slug.trim().toLowerCase();
    setSaveMsg("");
    startTransition(async () => {
      try {
        await updateSlug(val);
        setSaveMsg("✓ 주소가 변경되었습니다.");
      } catch (e) {
        setSaveMsg((e as Error).message ?? "저장 중 오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-(--muted)">
        현재 주소:{" "}
        <span className="font-medium text-foreground">
          {siteUrl}/<strong>{currentSlug}</strong>
        </span>
      </p>

      <div className="flex min-w-0 gap-2">
        <div
          className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border bg-white px-3 py-2.5 text-sm transition-colors focus-within:border-gray-400"
          style={{
            borderColor:
              status === "available" ? "#4ade80"
              : status === "taken" || status === "invalid" ? "#f87171"
              : undefined,
          }}
        >
          <span className="shrink-0 text-xs text-(--muted)">…/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder={currentSlug}
            maxLength={30}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-(--muted)"
          />
        </div>

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="shrink-0 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "저장 중…" : "저장"}
        </button>
      </div>

      {msg && (
        <p className={`flex items-center gap-1 text-xs ${statusColor[status]}`}>
          {status === "checking" && (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {status === "available" && "✓"}
          {(status === "taken" || status === "invalid") && "✕"}
          {msg}
        </p>
      )}

      {saveMsg && (
        <p className={`text-xs ${saveMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
          {saveMsg}
        </p>
      )}

      <p className="text-xs text-(--muted)">
        소문자·숫자·하이픈(-) 사용 가능 · 3~30자 · 앞뒤 및 연속 하이픈 불가
      </p>
    </div>
  );
}
