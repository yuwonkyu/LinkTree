"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";

type Props = {
  services: Service[];
  isPaidPlan: boolean;
  aiLoading: string | null;
  onAISuggest: () => void;
  onChange: (services: Service[]) => void;
};

export default function ServiceManager({
  services,
  isPaidPlan,
  aiLoading,
  onAISuggest,
  onChange,
}: Props) {
  const [name, setName]   = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote]   = useState("");

  const [editIdx, setEditIdx]     = useState<number | null>(null);
  const [editName, setEditName]   = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editNote, setEditNote]   = useState("");

  function add() {
    if (!name.trim() || !price.trim()) return;
    onChange([...services, { name: name.trim(), price: price.trim(), note: note.trim() || undefined }]);
    setName(""); setPrice(""); setNote("");
  }

  function remove(idx: number) {
    onChange(services.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    const s = services[idx];
    setEditIdx(idx);
    setEditName(s.name);
    setEditPrice(s.price);
    setEditNote(s.note ?? "");
  }

  function saveEdit() {
    if (editIdx === null || !editName.trim() || !editPrice.trim()) return;
    onChange(services.map((s, i) =>
      i === editIdx
        ? { name: editName.trim(), price: editPrice.trim(), note: editNote.trim() || undefined }
        : s
    ));
    setEditIdx(null);
  }

  const inputCls = "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-gray-400";

  return (
    <div>
      {/* AI 추천 버튼 */}
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={onAISuggest}
          disabled={aiLoading === "services"}
          className="text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50"
        >
          {aiLoading === "services" ? "생성 중…" : "✨ AI로 서비스 목록 채우기"}
        </button>
      </div>

      {/* 기존 목록 */}
      {services.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {services.map((svc, idx) => (
            <li key={idx} className="rounded-xl bg-(--secondary) px-3.5 py-2.5">
              {editIdx === idx ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input value={editName}  onChange={(e) => setEditName(e.target.value)}  placeholder="서비스명" className={`flex-1 ${inputCls}`} />
                    <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="가격"    className={`w-28 ${inputCls}`} />
                  </div>
                  <input value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="메모 (선택)" className={`w-full ${inputCls}`} />
                  <div className="flex gap-2">
                    <button type="button" onClick={saveEdit} disabled={!editName.trim() || !editPrice.trim()}
                      className="rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-white disabled:opacity-40">저장</button>
                    <button type="button" onClick={() => setEditIdx(null)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-(--muted)">취소</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{svc.name}</span>
                    {svc.note && <span className="text-xs text-(--muted)">{svc.note}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{svc.price}</span>
                    <button type="button" onClick={() => startEdit(idx)} className="text-xs text-blue-400 hover:text-blue-600">수정</button>
                    <button type="button" onClick={() => remove(idx)}    className="text-xs text-red-400 hover:text-red-600">삭제</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 추가 폼 */}
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3">
        <p className="text-xs font-medium text-(--muted)">서비스 추가</p>
        <div className="flex gap-2">
          <input type="text" value={name}  onChange={(e) => setName(e.target.value)}  placeholder="서비스명 (예: PT 1회)"
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400" />
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="가격 (예: 50,000원)"
            className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400" />
        </div>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="메모 (선택)"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400" />
        <button type="button" onClick={add} disabled={!name.trim() || !price.trim()}
          className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40">
          + 추가
        </button>
      </div>
    </div>
  );
}
