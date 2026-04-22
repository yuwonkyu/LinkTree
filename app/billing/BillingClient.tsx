"use client";

import { useState } from "react";
import Script from "next/script";
import { PLAN_META, type Plan, type BillingPeriod } from "@/lib/types";

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      billing: (opts: { customerKey: string }) => {
        requestBillingAuth: (opts: {
          method: string;
          successUrl: string;
          failUrl: string;
          customerEmail?: string;
          customerName?: string;
        }) => Promise<void>;
      };
    };
  }
}

type Props = {
  currentPlan: Plan;
  userId: string;
  userEmail: string;
  userName: string;
  clientKey: string;
  siteUrl: string;
};

// 기능별 비교 테이블 데이터
const COMPARE_ROWS: { label: string; free: string | boolean; basic: string | boolean; pro: string | boolean }[] = [
  { label: "프로필 페이지",    free: true,       basic: true,       pro: true },
  { label: "테마",             free: "1종",      basic: "6종",      pro: "6종" },
  { label: "서비스 등록",      free: "3개",      basic: "무제한",   pro: "무제한" },
  { label: "후기 등록",        free: "3개",      basic: "무제한",   pro: "무제한" },
  { label: "카카오 문의 버튼", free: false,      basic: true,       pro: true },
  { label: "방문자 통계",      free: false,      basic: false,      pro: true },
  { label: "멀티 링크",        free: false,      basic: false,      pro: "예정" },
  { label: "우선 지원",        free: false,      basic: false,      pro: true },
];

function CellValue({ v }: { v: string | boolean }) {
  if (v === true)  return <span className="text-green-500 font-bold">✓</span>;
  if (v === false) return <span className="text-(--muted)">—</span>;
  return <span className="text-xs font-medium text-foreground">{v}</span>;
}

export default function BillingClient({
  currentPlan,
  userId,
  userEmail,
  userName,
  clientKey,
  siteUrl,
}: Props) {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  // 모바일 탭 선택 (데스크톱에서는 무시)
  const [mobilePlan, setMobilePlan] = useState<Plan>(
    currentPlan !== "free" ? currentPlan : "basic",
  );

  async function handleSelectPlan(plan: Plan) {
    if (plan === "free") {
      if (!confirm("Free 플랜으로 다운그레이드하면 구독이 취소됩니다. 계속하시겠습니까?")) return;
      setLoading("free");
      await fetch("/api/billing/cancel", { method: "POST" });
      window.location.href = "/dashboard";
      return;
    }

    if (!sdkReady || !window.TossPayments) {
      alert("결제 모듈이 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(plan);
    try {
      const tossPayments = window.TossPayments(clientKey);
      const billing = tossPayments.billing({ customerKey: userId });
      await billing.requestBillingAuth({
        method: "카드",
        successUrl: `${siteUrl}/billing/success?plan=${plan}&period=${period}`,
        failUrl: `${siteUrl}/billing/fail`,
        customerEmail: userEmail,
        customerName: userName || userEmail.split("@")[0],
      });
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  }

  const plans: Plan[] = ["free", "basic", "pro"];

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onReady={() => setSdkReady(true)}
        strategy="afterInteractive"
      />

      {/* 월/연 토글 */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center rounded-xl border border-black/10 bg-white p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            className={`rounded-lg px-4 py-1.5 transition-all ${
              period === "monthly"
                ? "bg-foreground text-white shadow-sm"
                : "text-(--muted) hover:text-foreground"
            }`}
          >
            월 결제
          </button>
          <button
            type="button"
            onClick={() => setPeriod("annual")}
            className={`relative rounded-lg px-4 py-1.5 transition-all ${
              period === "annual"
                ? "bg-foreground text-white shadow-sm"
                : "text-(--muted) hover:text-foreground"
            }`}
          >
            연 결제
            <span className="absolute -right-2 -top-2.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-white">
              2달 무료
            </span>
          </button>
        </div>
      </div>

      {/* ── 모바일: 플랜 탭 + 단일 카드 ── */}
      <div className="sm:hidden flex flex-col gap-4">
        {/* 탭 */}
        <div className="grid grid-cols-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {plans.map((plan) => {
            const meta = PLAN_META[plan];
            const isSel = mobilePlan === plan;
            return (
              <button
                key={plan}
                type="button"
                onClick={() => setMobilePlan(plan)}
                className={`py-2.5 text-sm font-semibold transition-colors relative ${
                  isSel
                    ? "bg-foreground text-white"
                    : "text-(--muted) hover:text-foreground"
                }`}
              >
                {meta.label}
                {plan === "basic" && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                    추천
                  </span>
                )}
                {currentPlan === plan && (
                  <span className="absolute -top-2 right-1 rounded-full bg-green-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">
                    현재
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 선택된 플랜 카드 */}
        {plans.map((plan) => {
          if (plan !== mobilePlan) return null;
          const meta = PLAN_META[plan];
          const isCurrent = currentPlan === plan;
          const isLoading = loading === plan;
          const displayPrice = period === "annual" ? meta.annualPrice : meta.price;

          return (
            <div
              key={plan}
              className={`rounded-2xl border-2 bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)] ${
                isCurrent
                  ? "border-foreground"
                  : plan === "pro"
                    ? "border-amber-300"
                    : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{meta.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {displayPrice === 0
                      ? "무료"
                      : `${displayPrice.toLocaleString()}원`}
                    {displayPrice > 0 && (
                      <span className="text-sm font-normal text-(--muted)">
                        /{period === "annual" ? "년" : "월"}
                      </span>
                    )}
                  </p>
                  {period === "annual" && plan !== "free" && (
                    <p className="mt-0.5 text-xs text-amber-600 font-medium">
                      월 {Math.round(displayPrice / 12).toLocaleString()}원 · 2개월 무료
                    </p>
                  )}
                </div>
              </div>

              <ul className="mt-4 flex flex-col gap-1.5">
                {meta.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-sm text-(--muted)">
                    <span className="mt-0.5 text-green-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isCurrent || isLoading}
                onClick={() => handleSelectPlan(plan)}
                className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                  plan === "free"
                    ? "border border-gray-200 text-foreground hover:bg-(--secondary)"
                    : "bg-foreground text-white hover:opacity-80"
                }`}
              >
                {isLoading
                  ? "처리 중…"
                  : isCurrent
                    ? "현재 플랜"
                    : plan === "free"
                      ? "다운그레이드"
                      : "이 플랜 시작하기"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── 데스크톱: 3열 카드 ── */}
      <div className="hidden sm:grid grid-cols-3 gap-4">
        {plans.map((plan) => {
          const meta = PLAN_META[plan];
          const isCurrent = currentPlan === plan;
          const isLoading = loading === plan;
          const displayPrice = period === "annual" ? meta.annualPrice : meta.price;

          return (
            <div
              key={plan}
              className={`relative flex flex-col rounded-2xl border-2 bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)] transition-all ${
                isCurrent
                  ? "border-foreground"
                  : plan === "pro"
                    ? "border-amber-300"
                    : "border-gray-100"
              }`}
            >
              {plan === "basic" && !isCurrent && (
                <span className="absolute -top-3 left-4 rounded-full bg-foreground px-3 py-0.5 text-xs font-semibold text-white">
                  추천
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-0.5 text-xs font-semibold text-white">
                  현재 플랜
                </span>
              )}

              <p className="text-sm font-bold text-foreground">{meta.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {displayPrice === 0
                  ? "무료"
                  : `${displayPrice.toLocaleString()}원`}
                {displayPrice > 0 && (
                  <span className="text-sm font-normal text-(--muted)">
                    /{period === "annual" ? "년" : "월"}
                  </span>
                )}
              </p>
              {period === "annual" && plan !== "free" && (
                <p className="mt-0.5 text-xs text-amber-600 font-medium">
                  월 {Math.round(displayPrice / 12).toLocaleString()}원 · 2개월 무료
                </p>
              )}

              <ul className="mt-4 flex flex-1 flex-col gap-1.5">
                {meta.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-(--muted)">
                    <span className="mt-0.5 text-green-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isCurrent || isLoading}
                onClick={() => handleSelectPlan(plan)}
                className={`mt-5 w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                  plan === "free"
                    ? "border border-gray-200 text-foreground hover:bg-(--secondary)"
                    : "bg-foreground text-white hover:opacity-80"
                }`}
              >
                {isLoading
                  ? "처리 중…"
                  : isCurrent
                    ? "현재 플랜"
                    : plan === "free"
                      ? "다운그레이드"
                      : "이 플랜 시작하기"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── 기능 비교 테이블 (공통) ── */}
      <div className="mt-6 rounded-2xl bg-white shadow-[0_2px_12px_rgba(17,24,39,0.06)] overflow-hidden">
        <p className="px-4 pt-4 pb-2 text-xs font-semibold text-(--muted) uppercase tracking-wide">
          기능 비교
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-(--muted) w-1/2">기능</th>
              {plans.map((plan) => (
                <th
                  key={plan}
                  className={`px-2 py-2.5 text-center text-xs font-semibold w-[16.66%] ${
                    currentPlan === plan ? "text-foreground" : "text-(--muted)"
                  }`}
                >
                  {PLAN_META[plan].label}
                  {currentPlan === plan && (
                    <span className="ml-1 text-[9px] text-green-500">●</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}
              >
                <td className="px-4 py-2.5 text-xs text-foreground">{row.label}</td>
                <td className="px-2 py-2.5 text-center"><CellValue v={row.free} /></td>
                <td className="px-2 py-2.5 text-center"><CellValue v={row.basic} /></td>
                <td className="px-2 py-2.5 text-center"><CellValue v={row.pro} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-xs text-(--muted)">
        결제는 토스페이먼츠를 통해 안전하게 처리됩니다. 언제든지 취소할 수 있습니다.
      </p>
    </>
  );
}
