type Props = {
  error: string;
  onClose: () => void;
};

export default function SaveErrorModal({ error, onClose }: Props) {
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
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-xl">⚠️</span>
          <p className="text-base font-bold text-foreground">저장 실패</p>
        </div>
        <p className="ml-11 text-sm text-(--muted) whitespace-pre-wrap break-keep">{error}</p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
