"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import type { GalleryImage } from "@/lib/types";

const DEFAULT_MAX_GALLERY = 9;

// Cloudinary 소스: 로컬 파일 + 카메라만 (구글드라이브·Shutterstock 등 제거)
const UPLOAD_SOURCES = ["local" as const, "camera" as const];

type Props = {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  limit?: number; // undefined = DEFAULT_MAX_GALLERY(9), 0 = 업로드 불가 (Free), Infinity = 무제한
};

export default function GalleryManager({ images, onChange, limit }: Props) {
  const maxGallery = limit === undefined ? DEFAULT_MAX_GALLERY : Math.min(limit, DEFAULT_MAX_GALLERY);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");

  // 현재 images 최신값을 항상 ref로 추적
  const imagesRef = useRef<GalleryImage[]>(images);
  useEffect(() => { imagesRef.current = images; }, [images]);

  // 위젯이 열려있는 동안 업로드된 이미지를 임시 보관 → 닫을 때 일괄 추가
  const pendingRef = useRef<GalleryImage[]>([]);

  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    setEditIdx(idx);
    setEditCaption(images[idx].caption ?? "");
  }

  function saveCaption() {
    if (editIdx === null) return;
    onChange(
      images.map((img, i) =>
        i === editIdx ? { ...img, caption: editCaption.trim() || undefined } : img
      )
    );
    setEditIdx(null);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const next = [...images];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  }

  function moveDown(idx: number) {
    if (idx === images.length - 1) return;
    const next = [...images];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  }

  const canAdd = limit !== 0 && images.length < maxGallery;

  return (
    <div className="flex flex-col gap-3">
      {/* 갤러리 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={img.url + idx} className="flex flex-col gap-1">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 group">
                <Image
                  src={img.url}
                  alt={img.caption ?? `갤러리 ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {/* 오버레이 버튼 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-900 disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-900 disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(idx)}
                    className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-medium text-gray-900"
                  >
                    캡션
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white"
                  >
                    삭제
                  </button>
                </div>
              </div>
              {/* 캡션 수정 인라인 */}
              {editIdx === idx ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="사진 설명 (선택)"
                    autoFocus
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-900 outline-none focus:border-gray-400"
                  />
                  <button
                    type="button"
                    onClick={saveCaption}
                    className="rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-white"
                  >
                    저장
                  </button>
                </div>
              ) : (
                img.caption && (
                  <p className="truncate text-[10px] text-(--muted)">{img.caption}</p>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* 업로드 버튼 */}
      {canAdd ? (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "instalink_unsigned"}
          options={{
            multiple: true,
            maxFiles: maxGallery - images.length,
            sources: UPLOAD_SOURCES,  // 내 파일 + 카메라만 표시
          }}
          onSuccess={(result) => {
            // 위젯 닫기 전까지 pending에 쌓기만 함 (stale closure 없음)
            if (
              result.event === "success" &&
              typeof result.info === "object" &&
              result.info !== null &&
              "secure_url" in result.info
            ) {
              const url = result.info.secure_url as string;
              pendingRef.current = [...pendingRef.current, { url }];
            }
          }}
          onClose={() => {
            // 위젯 닫힐 때 한꺼번에 추가 → 여러 장 일괄 반영
            if (pendingRef.current.length > 0) {
              onChange([...imagesRef.current, ...pendingRef.current]);
              pendingRef.current = [];
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-(--muted) hover:border-gray-400 hover:text-foreground transition-colors"
            >
              <span className="text-lg leading-none">＋</span>
              사진 추가 ({images.length}/{maxGallery === Infinity ? "∞" : maxGallery})
            </button>
          )}
        </CldUploadWidget>
      ) : limit === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-(--muted)">
          🔒 갤러리는 Basic 이상 플랜에서 사용 가능합니다.{" "}
          <a href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">업그레이드</a>
        </p>
      ) : (
        <p className="text-center text-xs text-(--muted)">
          최대 {maxGallery}장까지 업로드할 수 있습니다.
        </p>
      )}

      <p className="text-xs text-(--muted)">
        작업물·매장 사진을 올리면 고객 신뢰도가 높아집니다. 사진 위에 마우스를 올리면 순서 변경·캡션·삭제가 가능합니다.
      </p>
    </div>
  );
}
