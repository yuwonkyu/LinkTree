"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type Props = {
  url: string;
  isPaid: boolean;
};

export default function QRCodeCard({ url, isPaid }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 180,
      margin: 2,
      color: { dark: "#111827", light: "#ffffff" },
    }).then(() => setReady(true));
  }, [url]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "instalink-qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">QR코드</h2>
        {!isPaid && (
          <a href="/billing" className="text-xs font-medium text-foreground hover:underline">
            다운로드 →
          </a>
        )}
      </div>

      <p className="mb-4 text-xs text-(--muted)">
        테이블·명함·포스터에 붙여서 고객이 바로 스캔할 수 있어요.
      </p>

      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          className={`rounded-xl ${!isPaid ? "opacity-40 blur-[2px]" : ""}`}
        />
        {!isPaid && ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px]">
            <span className="text-lg mb-1">🔒</span>
            <p className="text-xs font-semibold text-foreground">베이직 이상</p>
            <a
              href="/billing"
              className="mt-1.5 rounded-lg bg-foreground px-3 py-1 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
            >
              업그레이드
            </a>
          </div>
        )}
      </div>

      {isPaid && ready && (
        <button
          type="button"
          onClick={handleDownload}
          className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
        >
          PNG 다운로드
        </button>
      )}
    </div>
  );
}
