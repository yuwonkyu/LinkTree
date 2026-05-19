"use client";

export default function ShareButton({ url }: { url: string }) {
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch (e) {
        // AbortError = 사용자가 직접 취소한 것이므로 무시
        if (e instanceof Error && e.name !== "AbortError") {
          await clipboardFallback();
        }
      }
      return;
    }
    await clipboardFallback();
  }

  async function clipboardFallback() {
    try {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사됐어요!");
    } catch {
      alert(`직접 복사해주세요:\n${url}`);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black hover:text-foreground transition hover:bg-black/5"
    >
      🔗 이 페이지 공유하기
    </button>
  );
}
