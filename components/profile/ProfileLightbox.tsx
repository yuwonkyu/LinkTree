import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

type Props = {
  gallery: GalleryImage[];
  lightboxIdx: number;
  setLightboxIdx: React.Dispatch<React.SetStateAction<number | null>>;
  closeLightbox: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
};

export default function ProfileLightbox({
  gallery, lightboxIdx, setLightboxIdx, closeLightbox, handleTouchStart, handleTouchEnd,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
      onClick={closeLightbox}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeLightbox}
          className="absolute -right-1 -top-10 z-10 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
          aria-label="닫기"
        >
          ✕ 닫기
        </button>

        <div
          className="relative w-full overflow-hidden rounded-2xl bg-black/30"
          style={{ height: "clamp(240px, 60svh, 480px)" }}
        >
          <Image
            src={gallery[lightboxIdx].url}
            alt={gallery[lightboxIdx].caption ?? ""}
            fill
            sizes="(max-width: 640px) 90vw, 480px"
            className="object-contain"
            priority
          />
        </div>

        {gallery[lightboxIdx].caption && (
          <p className="mt-2 text-center text-sm text-white/80">
            {gallery[lightboxIdx].caption}
          </p>
        )}

        {gallery.length > 1 && (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((i) =>
                  i !== null && i > 0 ? i - 1 : gallery.length - 1,
                );
              }}
              className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/35 transition-colors"
            >
              ‹ 이전
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-white/60">
                {lightboxIdx + 1} / {gallery.length}
              </span>
              {gallery.length <= 9 && (
                <div className="flex gap-1">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                      className={`h-1.5 rounded-full transition-all ${
                        i === lightboxIdx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((i) =>
                  i !== null && i < gallery.length - 1 ? i + 1 : 0,
                );
              }}
              className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/35 transition-colors"
            >
              다음 ›
            </button>
          </div>
        )}

        {gallery.length > 1 && (
          <p className="mt-2 text-center text-[10px] text-white/30 select-none">
            <span className="sm:hidden">← 스와이프하여 이동 →</span>
            <span className="hidden sm:inline">← → 키보드 화살표로 이동 · ESC로 닫기</span>
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
