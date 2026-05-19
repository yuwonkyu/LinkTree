import Link from "next/link";

type Props = {
  slug?: string | null;
  onClose: () => void;
};

export default function SaveSuccessModal({ slug, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xl">🎉</span>
          <p className="text-base font-bold text-foreground">저장 완료!</p>
        </div>
        <p className="ml-11 text-sm text-(--muted)">변경사항이 내 페이지에 즉시 반영됐어요.</p>
        <div className="mt-5 flex flex-col gap-2">
          {slug && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-foreground py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-85"
            >
              완성페이지 보러가기 →
            </a>
          )}
          <Link
            href="/dashboard"
            className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
          >
            대시보드로 이동
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs text-(--muted) hover:text-foreground transition-colors"
          >
            계속 편집하기
          </button>
        </div>
      </div>
    </div>
  );
}
