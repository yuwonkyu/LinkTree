import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "개인정보처리방침 — InstaLink",
  description: "InstaLink 개인정보처리방침",
};

const COMPANY = COMPANY_INFO.brand;
const EMAIL   = COMPANY_INFO.email;
const DATE    = "2026년 4월 21일";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">개인정보처리방침</h1>
          <p className="mt-1 text-sm text-(--muted)">시행일: {DATE}</p>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] text-sm leading-relaxed text-foreground">

          <Section title="1. 개인정보 수집 항목 및 목적">
            <Table
              headers={["구분", "수집 항목", "수집 목적", "보유 기간"]}
              rows={[
                ["필수", "이메일 주소, 이름(닉네임)", "회원 가입·로그인, 공지 및 서비스 안내", "회원 탈퇴 후 즉시 삭제"],
                ["필수", "결제 정보(카드사·토스페이먼츠 처리)", "유료 플랜 구독 결제", "결제일로부터 5년"],
                ["서비스 이용", "프로필 사진, 상호명, 소개글, 연락처 URL", "공개 페이지 생성·운영", "회원 탈퇴 후 즉시 삭제"],
                ["자동 수집", "접속 IP, 접속 일시, 브라우저 정보, 서비스 이용 기록", "서비스 품질 개선·보안", "6개월"],
              ]}
            />
            <p className="mt-3 text-xs text-(--muted)">
              ※ 결제 카드 정보는 {COMPANY}가 직접 저장하지 않으며, 토스페이먼츠(주)가 관리합니다.
            </p>
          </Section>

          <Section title="2. 개인정보의 제3자 제공">
            <p>
              {COMPANY}는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만 아래의 경우는 예외로 합니다.
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-(--muted)">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 따라 요구되는 경우</li>
            </ul>
            <div className="mt-3 rounded-xl bg-(--secondary) p-4">
              <p className="mb-2 font-medium">위탁 처리 업체</p>
              <Table
                headers={["수탁사", "위탁 업무"]}
                rows={[
                  ["토스페이먼츠(주)", "결제 처리 및 빌링키 관리"],
                  ["Supabase Inc.", "회원 정보 및 서비스 데이터 저장"],
                  ["Cloudinary Inc.", "프로필 이미지 저장·변환"],
                  ["Resend Inc.", "이메일 발송"],
                ]}
              />
            </div>
          </Section>

          <Section title="3. 개인정보의 파기">
            <p>
              {COMPANY}는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
              전자 파일은 복구 불가능한 방법으로 삭제하며, 종이 문서는 분쇄 또는 소각합니다.
            </p>
          </Section>

          <Section title="4. 이용자의 권리">
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>개인정보 열람·정정·삭제·처리정지 요청 가능</li>
              <li>동의 철회는 서비스 내 회원 탈퇴 또는 이메일 문의로 가능</li>
              <li>만 14세 미만 아동은 서비스 이용 및 개인정보 제공 불가. 해당 사실 확인 시 계정 즉시 삭제</li>
            </ul>
          </Section>

          <Section title="5. 쿠키(Cookie) 사용">
            <p>
              {COMPANY}는 서비스 운영에 필요한 필수 쿠키만 사용합니다.
              광고 추적·행동 분석 목적의 제3자 쿠키는 사용하지 않습니다.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-3 py-2 text-left font-medium text-(--muted)">쿠키 종류</th>
                    <th className="px-3 py-2 text-left font-medium text-(--muted)">목적</th>
                    <th className="px-3 py-2 text-left font-medium text-(--muted)">보유 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="px-3 py-2 text-(--muted)">인증 세션 쿠키</td>
                    <td className="px-3 py-2 text-(--muted)">로그인 상태 유지 (Supabase Auth)</td>
                    <td className="px-3 py-2 text-(--muted)">세션 종료 시</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="px-3 py-2 text-(--muted)">보안 토큰</td>
                    <td className="px-3 py-2 text-(--muted)">CSRF 방지</td>
                    <td className="px-3 py-2 text-(--muted)">세션 종료 시</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-(--muted)">
              브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 기능이 제한될 수 있습니다.
            </p>
          </Section>

          <Section title="6. 개인정보 보호책임자">
            <p>개인정보 관련 문의·불만·피해 구제는 아래로 연락해주세요.</p>
            <div className="mt-2 rounded-xl bg-(--secondary) p-4">
              <p><span className="font-medium">서비스명:</span> {COMPANY}</p>
              <p><span className="font-medium">이메일:</span> {EMAIL}</p>
            </div>
            <p className="mt-2 text-xs text-(--muted)">
              기타 개인정보 침해 신고: 개인정보보호위원회 (privacy.go.kr / 국번 없이 182)
            </p>
          </Section>

          <Section title="7. 방침 변경">
            <p>
              이 방침은 {DATE}부터 시행됩니다. 내용 변경 시 변경 7일 전에 서비스 내 공지를 통해 안내합니다.
            </p>
          </Section>

        </div>

        <LegalNav current="privacy" />
      </div>
    </main>
  );
}

/* ── 내부 컴포넌트 ── */
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

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-(--muted)">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-(--muted)">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
