import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "콘텐츠 정책 — InstaLink",
  description: "InstaLink 콘텐츠 정책",
};

const EMAIL = "duck01777@naver.com";
const DATE = "2026년 4월 22일";

export default function ContentPolicyPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">콘텐츠 정책</h1>
          <p className="mt-1 text-sm text-(--muted)">시행일: {DATE}</p>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] text-sm leading-relaxed text-foreground">

          <Section title="제1조 (금지 콘텐츠)">
            <p className="mb-2 text-(--muted)">아래 콘텐츠는 등록·공유가 금지됩니다.</p>
            <div className="flex flex-col gap-4">
              <Category label="성인·음란 콘텐츠">
                <li>노골적인 성인물, 성적 수치심을 유발하는 이미지·텍스트</li>
                <li>미성년자를 대상으로 하는 성적 콘텐츠</li>
              </Category>
              <Category label="불법 콘텐츠">
                <li>불법 도박, 사설 스포츠 토토 홍보</li>
                <li>마약류·불법 약물 판매·홍보</li>
                <li>사기, 피싱, 스미싱 유도</li>
                <li>기타 대한민국 법령에서 금지하는 콘텐츠</li>
              </Category>
              <Category label="혐오·폭력 콘텐츠">
                <li>인종, 성별, 종교, 장애 등을 이유로 한 혐오 표현</li>
                <li>폭력을 미화하거나 조장하는 콘텐츠</li>
              </Category>
            </div>
          </Section>

          <Section title="제2조 (저작권 준수)">
            <p>이용자는 본인이 권리를 보유한 콘텐츠만 등록할 수 있습니다. 아래 행위는 금지됩니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>연예인·유명인 이미지를 허가 없이 사용하는 행위</li>
              <li>브랜드 로고·상표를 무단으로 사용하는 행위</li>
              <li>타인의 SNS 게시물·사진을 허가 없이 복제하는 행위</li>
              <li>음악, 영상, 디자인 등 저작물을 무단으로 사용하는 행위</li>
            </ul>
            <p className="mt-3 text-xs text-(--muted)">
              저작권 침해 신고는 <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">{EMAIL}</a>로 보내주세요.
              신고 접수 후 검토를 거쳐 조치합니다.
            </p>
          </Section>

          <Section title="제3조 (콘텐츠 운영 방식)">
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>서비스는 콘텐츠를 사전에 검열하지 않습니다.</li>
              <li>신고 접수 시 검토 후 조치합니다.</li>
              <li>문제 콘텐츠로 확인되면 비공개 처리 또는 삭제할 수 있습니다.</li>
              <li>심각한 위반은 계정 정지로 이어질 수 있습니다.</li>
            </ul>
            <div className="mt-3 rounded-xl bg-(--secondary) p-4">
              <p className="font-medium">신고 방법</p>
              <p className="mt-1 text-xs text-(--muted)">
                이메일: <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">{EMAIL}</a><br />
                제목: [신고] + 신고 대상 URL 및 사유를 포함해 보내주세요.
              </p>
            </div>
          </Section>

          <Section title="제4조 (제재 절차)">
            <p>위반 정도에 따라 아래 절차로 제재합니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li><b className="text-foreground">1차</b>: 경고 및 해당 콘텐츠 삭제</li>
              <li><b className="text-foreground">2차</b>: 서비스 이용 일시 제한</li>
              <li><b className="text-foreground">3차</b>: 계정 영구 정지</li>
              <li><b className="text-foreground">즉시 조치</b>: 불법 콘텐츠, 아동 보호 위반 등 심각한 위반</li>
            </ul>
          </Section>

        </div>

        <LegalNav current="content-policy" />
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

function Category({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-(--muted)">{label}</p>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-(--muted)">{children}</ul>
    </div>
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
