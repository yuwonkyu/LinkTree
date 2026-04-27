import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "환불 정책 — InstaLink",
  description: "InstaLink 환불 정책",
};

const EMAIL = COMPANY_INFO.email;
const DATE  = "2026년 4월 22일";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">환불 정책</h1>
          <p className="mt-1 text-sm text-(--muted)">시행일: {DATE}</p>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] text-sm leading-relaxed text-foreground">

          <Section title="제1조 (구독 결제 방식)">
            <p>
              InstaLink 유료 플랜은 월 단위 자동 갱신 구독 방식으로 운영됩니다.
              결제는 토스페이먼츠를 통해 처리되며, <b className="text-foreground">최초 결제일을 기준으로 매월 동일 날짜에 자동으로 청구</b>됩니다.
              (예: 5월 15일 가입 → 매월 15일 청구)
            </p>
            <p className="mt-2 text-xs text-(--muted)">
              결제 실패 시 이메일로 안내드리며, 실패 후 7일 이내 결제가 이루어지지 않으면 유료 플랜이 자동 해지됩니다.
            </p>
          </Section>

          <Section title="제2조 (환불 기준)">
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-(--secondary) p-4">
                <p className="font-medium">결제 후 7일 이내 — 전액 환불</p>
                <p className="mt-1 text-xs text-(--muted)">
                  유료 플랜 전환 후 7일 이내에 서비스를 실질적으로 이용하지 않은 경우 전액 환불이 가능합니다.
                  단, AI 추천 기능을 5회 이상 사용한 경우는 이용한 것으로 간주합니다.
                </p>
              </div>
              <div className="rounded-xl bg-(--secondary) p-4">
                <p className="font-medium">결제 후 7일 초과 — 환불 불가</p>
                <p className="mt-1 text-xs text-(--muted)">
                  디지털 서비스 특성상, 결제일로부터 7일이 경과하거나 서비스를 실질적으로 이용한 경우
                  원칙적으로 환불이 제한됩니다.
                </p>
              </div>
            </div>
          </Section>

          <Section title="제3조 (구독 해지)">
            <p>
              구독은 언제든지 해지할 수 있습니다. 해지 신청 후에도 현재 구독 기간이 만료될 때까지 서비스를 이용할 수 있으며,
              잔여 기간에 대한 환불은 제공되지 않습니다.
            </p>
            <div className="mt-3 rounded-xl bg-(--secondary) p-4">
              <p className="font-medium">셀프 해지 방법</p>
              <p className="mt-1 text-xs text-(--muted)">
                대시보드 → 구독 관리 메뉴에서 직접 해지할 수 있습니다.<br />
                별도 이메일 신청 없이 즉시 처리됩니다.
              </p>
            </div>
            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>해지 신청 즉시 다음 결제일 자동 갱신이 중단됩니다.</li>
              <li>현재 구독 기간 만료일까지 유료 기능을 계속 이용할 수 있습니다.</li>
              <li>해지 후 무료 플랜으로 전환되며, 기존 적용된 테마·설정은 유지됩니다.</li>
              <li>계정 삭제를 원하는 경우 대시보드 하단 회원탈퇴 메뉴를 이용해 주세요.</li>
            </ul>
          </Section>

          <Section title="제4조 (예외 및 특별 환불)">
            <p>다음 경우에는 개별적으로 환불 여부를 검토합니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>회사 귀책 사유로 서비스가 연속 72시간 이상 중단된 경우</li>
              <li>결제 시스템 오류로 중복 결제된 경우</li>
              <li>기타 회사가 합리적으로 판단하여 인정하는 경우</li>
            </ul>
          </Section>

          <Section title="제5조 (환불 신청 방법)">
            <div className="rounded-xl bg-(--secondary) p-4">
              <p className="font-medium">환불 신청</p>
              <p className="mt-1 text-xs text-(--muted)">
                이메일: <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">{EMAIL}</a><br />
                제목: [환불 신청] 가입 이메일 주소<br />
                내용: 결제일, 환불 사유를 포함해 보내주세요.<br />
                처리 기간: 영업일 기준 3~5일 이내
              </p>
            </div>
            <p className="mt-3 text-xs text-(--muted)">
              환불 금액은 결제 수단에 따라 카드사 처리 일정에 따라 반영됩니다 (통상 3~7 영업일 소요).
            </p>
          </Section>

        </div>

        <LegalNav current="refund" />
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function LegalNav({ current }: { current: "terms" | "content-policy" | "refund" | "privacy" }) {
  const links = [
    { href: "/terms", label: "이용약관" },
    { href: "/content-policy", label: "콘텐츠 정책" },
    { href: "/refund", label: "환불 정책" },
    { href: "/privacy", label: "개인정보처리방침" },
  ];
  return (
    <nav className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-(--muted)">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={href === `/${current}` ? "font-semibold text-foreground" : "hover:text-foreground"}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
