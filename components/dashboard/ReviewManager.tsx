"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";

type Props = {
  reviews: Review[];
  onChange: (reviews: Review[]) => void;
  limit?: number; // 추가 가능한 최대 개수 (undefined = 무제한)
};

// "2025-03" → "2025년 3월"
function formatDate(d: string) {
  const [y, m] = d.split("-");
  if (!y || !m) return d;
  return `${y}년 ${parseInt(m)}월`;
}

// 연도 선택 옵션: 현재 연도부터 5년 전까지
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function DatePicker({
  value,
  onChange,
}: {
  value: string; // "YYYY-MM" or ""
  onChange: (v: string) => void;
}) {
  const [year, month] = value ? value.split("-") : ["", ""];

  function update(y: string, m: string) {
    if (y && m) onChange(`${y}-${m.padStart(2, "0")}`);
    else onChange("");
  }

  return (
    <div className="flex gap-2">
      <select
        value={year}
        onChange={(e) => update(e.target.value, month)}
        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
      >
        <option value="">연도</option>
        {YEARS.map((y) => (
          <option key={y} value={String(y)}>
            {y}년
          </option>
        ))}
      </select>
      <select
        value={month}
        onChange={(e) => update(year, e.target.value)}
        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
      >
        <option value="">월</option>
        {MONTHS.map((m) => (
          <option key={m} value={String(m)}>
            {m}월
          </option>
        ))}
      </select>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-lg border border-gray-200 px-2 text-xs text-(--muted) hover:text-foreground"
          title="날짜 제거"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function ReviewManager({ reviews, onChange, limit }: Props) {
  const atLimit = limit !== undefined && reviews.length >= limit;
  const [text,   setText]   = useState("");
  const [author, setAuthor] = useState("");
  const [date,   setDate]   = useState("");

  const [editIdx,    setEditIdx]    = useState<number | null>(null);
  const [editText,   setEditText]   = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editDate,   setEditDate]   = useState("");

  function add() {
    if (!text.trim() || !author.trim()) return;
    onChange([
      ...reviews,
      { text: text.trim(), author: author.trim(), date: date || undefined },
    ]);
    setText(""); setAuthor(""); setDate("");
  }

  function remove(idx: number) {
    onChange(reviews.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    const r = reviews[idx];
    setEditIdx(idx);
    setEditText(r.text);
    setEditAuthor(r.author);
    setEditDate(r.date ?? "");
  }

  function saveEdit() {
    if (editIdx === null || !editText.trim() || !editAuthor.trim()) return;
    onChange(
      reviews.map((r, i) =>
        i === editIdx
          ? { text: editText.trim(), author: editAuthor.trim(), date: editDate || undefined }
          : r
      )
    );
    setEditIdx(null);
  }

  return (
    <div>
      {/* 기존 목록 */}
      {reviews.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {reviews.map((rev, idx) => (
            <li key={idx} className="rounded-xl bg-(--secondary) px-3.5 py-2.5">
              {editIdx === idx ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="후기 내용"
                    className="resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                  <input
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="작성자 (예: 30대 여성 회원)"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-gray-400"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-(--muted)">후기 날짜 (선택)</span>
                    <DatePicker value={editDate} onChange={setEditDate} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={!editText.trim() || !editAuthor.trim()}
                      className="rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIdx(null)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-(--muted)"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-foreground">"{rev.text}"</span>
                    <span className="text-xs font-semibold text-(--muted)">
                      — {rev.author}
                      {rev.date && (
                        <span className="ml-1.5 font-normal opacity-70">
                          {formatDate(rev.date)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(idx)}
                      className="text-xs text-blue-400 hover:text-blue-600"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 추가 폼 */}
      {atLimit ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-(--muted)">
          🔒 후기 {limit}개 한도에 도달했습니다.{" "}
          <a href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">
            업그레이드
          </a>
          하면 더 추가할 수 있습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3">
          <p className="text-xs font-medium text-(--muted)">
            후기 추가
            {limit !== undefined && (
              <span className="ml-1 text-gray-400">({reviews.length}/{limit})</span>
            )}
          </p>
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="후기 내용"
            className="resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자 (예: 30대 여성 회원)"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-(--muted)">후기 날짜 (선택)</span>
            <DatePicker value={date} onChange={setDate} />
          </div>
          <button
            type="button"
            onClick={add}
            disabled={!text.trim() || !author.trim()}
            className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
          >
            + 추가
          </button>
        </div>
      )}
    </div>
  );
}
