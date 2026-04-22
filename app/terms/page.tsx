import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 — InstaLink",
  description: "InstaLink 서비스 이용약관",
};

const COMPANY = "InstaLink";
const EMAIL = "duck01777@naver.com";
const DATE = "2026년 4월 22일";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">이용약관</h1>
          <p className="mt-1 text-sm text-(--muted)">시행일: {DATE}</p>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] text-sm leading-relaxed text-foreground">

          <Section title="제1조 (목적)">
            <p>
              이 약관은 {COMPANY}(이하 "회사")가 제공하는 인스타 링크 페이지 서비스(이하 "서비스")의
              이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임에 관한 사항을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (정의)">
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li><b className="text-foreground">서비스</b>: 회사가 운영하는 {COMPANY} 플랫폼 및 관련 제반 서비스</li>
              <li><b className="text-foreground">이용자</b>: 이 약관에 동의하고 서비스를 이용하는 모든 회원</li>
              <li><b className="text-foreground">콘텐츠</b>: 이용자가 서비스에 등록·게시한 텍스트, 이미지, 링크 등 일체의 정보</li>
              <li><b className="text-foreground">유료 플랜</b>: 월 구독료를 납부하고 이용하는 Basic·Pro 플랜</li>
            </ul>
          </Section>

          <Section title="제3조 (약관의 효력 및 변경)">
            <p>
              이 약관은 서비스 화면에 게시하거나 이메일로 공지함으로써 효력이 발생합니다.
              회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며,
              변경 시 시행 7일 전에 공지합니다. 변경 후에도 서비스를 계속 이용하면 변경 약관에 동의한 것으로 간주합니다.
            </p>
          </Section>

          <Section title="제4조 (서비스 내용)">
            <p>회사는 다음 서비스를 제공합니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>인스타그램 프로필 링크용 개인 랜딩 페이지 생성·편집·공개</li>
              <li>서비스·가격·후기·링크 등 콘텐츠 관리 도구</li>
              <li>AI 기반 콘텐츠 작성 보조 (유료 플랜)</li>
              <li>페이지 방문 통계 제공 (유료 플랜)</li>
            </ul>
            <p className="mt-3 text-xs text-(--muted)">
              회사는 서비스의 내용을 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.
            </p>
          </Section>

          <Section title="제5조 (이용자의 의무)">
            <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스의 안정적인 운영을 방해하는 행위</li>
              <li>콘텐츠 정책에서 금지된 콘텐츠를 등록·공유하는 행위</li>
              <li>타인의 지식재산권을 침해하는 행위</li>
              <li>관련 법령을 위반하는 행위</li>
            </ul>
          </Section>

          <Section title="제6조 (콘텐츠 권리와 책임)">
            <p>
              이용자가 서비스에 등록한 콘텐츠에 대한 저작권 및 모든 법적 책임은 해당 이용자에게 있습니다.
              회사는 서비스 운영·개선 목적으로 콘텐츠를 이용할 수 있으며, 이 권리는 서비스 종료 시 소멸합니다.
            </p>
            <p className="mt-2">
              타인으로부터 저작권 침해 등 신고가 접수될 경우, 회사는 사전 통보 없이 해당 콘텐츠를 비공개 처리하거나 삭제할 수 있습니다.
            </p>
          </Section>

          <Section title="제7조 (서비스 이용 제한 및 계정 정지)">
            <p>
              회사는 이용자가 이 약관 또는 콘텐츠 정책을 위반한 경우 다음 조치를 취할 수 있습니다.
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>1차: 경고 및 해당 콘텐츠 삭제</li>
              <li>2차: 일정 기간 서비스 이용 제한</li>
              <li>3차: 계정 영구 정지</li>
              <li>불법 콘텐츠 등 심각한 위반 시 즉시 계정 정지</li>
            </ul>
          </Section>

          <Section title="제8조 (책임의 한계)">
            <p>
              회사는 이용자가 서비스를 이용하여 기대하는 수익·결과를 보장하지 않습니다.
              회사는 이용자가 게시한 콘텐츠로 인해 발생하는 분쟁·손해에 대해 책임을 지지 않습니다.
              천재지변, 통신 장애 등 불가항력으로 인한 서비스 중단에 대해서도 책임이 면제됩니다.
            </p>
          </Section>

          <Section title="제9조 (문의 및 준거법)">
            <p>
              서비스 이용에 관한 문의는 <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">{EMAIL}</a>로 보내주세요.
              이 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 서울중앙지방법원을 제1심 관할 법원으로 합니다.
            </p>
          </Section>

        </div>

        <LegalNav current="terms" />
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
