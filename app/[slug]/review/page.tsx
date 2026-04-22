"use client";

import { useState, use } from "react";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export default function ReviewPage({ params }: Props) {
  const { slug } = use(params);

  const [text, setText]     = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, text, author }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrMsg(json.error ?? "오류가 발생했습니다.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrMsg("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setStatus("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-(--secondary) px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href={`/${slug}`} className="text-sm text-(--muted) hover:text-foreground">
            ← 페이지로 돌아가기
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.08)]">
          {status === "done" ? (
            <div className="py-4 text-center">
              <p className="text-3xl mb-3">🎉</p>
              <h2 className="text-base font-bold text-foreground">후기가 등록됐어요!</h2>
              <p className="mt-1 text-sm text-(--muted)">소중한 후기 감사합니다.</p>
              <Link
                href={`/${slug}`}
                className="mt-5 inline-block rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
              >
                페이지 보러 가기 →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-1 text-base font-bold text-foreground">후기 남기기</h1>
              <p className="mb-5 text-sm text-(--muted)">
                솔직한 후기가 다른 분들에게 큰 도움이 됩니다 😊
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-(--muted)">
                    후기 내용 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="서비스 이용 후 느낀 점을 솔직하게 작성해주세요."
                    maxLength={300}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors resize-none"
                  />
                  <p className="text-right text-[11px] text-(--muted)">{text.length} / 300</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-(--muted)">
                    이름 (닉네임) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="홍길동 / 30대 직장인"
                    maxLength={30}
                    required
                    className={inputCls}
                  />
                </div>

                {status === "error" && (
                  <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{errMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !text.trim() || !author.trim()}
                  className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50 transition-opacity"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      등록 중…
                    </span>
                  ) : (
                    "후기 등록하기"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
