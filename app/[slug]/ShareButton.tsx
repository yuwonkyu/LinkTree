"use client";

export default function ShareButton({ url }: { url: string }) {
  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }

    await navigator.clipboard.writeText(url);
    alert("링크가 복사됐어요!");
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
