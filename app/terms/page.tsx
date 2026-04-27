import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "이용약관 — InstaLink",
  description: "InstaLink 서비스 이용약관",
};

const COMPANY = COMPANY_INFO.brand;
const EMAIL   = COMPANY_INFO.email;
const DATE    = "2026년 4월 27일";

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
              <li><b className="text-foreground">서비스</b>: 회사가 운영하는 {COMPANY} 플랫폼 및 관련 제반 서비스 일체</li>
              <li><b className="text-foreground">이용자</b>: 이 약관에 동의하고 서비스를 이용하는 모든 회원</li>
              <li><b className="text-foreground">콘텐츠</b>: 이용자가 서비스에 등록·게시한 텍스트, 이미지, 링크, 후기 등 일체의 정보</li>
              <li><b className="text-foreground">유료 플랜</b>: 월 구독료를 납부하고 이용하는 Basic·Pro 플랜</li>
              <li><b className="text-foreground">후원</b>: 이용자 또는 방문자가 서비스 운영자에게 자발적으로 제공하는 금전적 지원</li>
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
              <li>서비스·가격·후기·갤러리·링크 등 콘텐츠 관리 도구</li>
              <li>카카오·네이버 예약 및 SNS 링크 연결</li>
              <li>AI 기반 콘텐츠 작성 보조 (유료 플랜)</li>
              <li>페이지 방문 통계 제공 (유료 플랜)</li>
              <li>외부 결제 수단(카카오페이·계좌이체 등)을 통한 후원 기능</li>
            </ul>
            <p className="mt-3 text-xs text-(--muted)">
              회사는 서비스의 내용을 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.
            </p>
          </Section>

          <Section title="제5조 (이용자 연령 제한)">
            <p>
              서비스는 만 14세 이상만 이용할 수 있습니다.
              만 14세 미만 아동은 회원가입 및 서비스 이용이 불가합니다.
              만 14세 미만임을 인지한 경우 회사는 해당 계정을 즉시 삭제할 수 있습니다.
            </p>
          </Section>

          <Section title="제6조 (이용자의 의무)">
            <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스의 안정적인 운영을 방해하는 행위</li>
              <li>콘텐츠 정책에서 금지된 콘텐츠를 등록·공유하는 행위</li>
              <li>타인의 지식재산권·초상권·명예를 침해하는 행위</li>
              <li>상업적 광고·홍보 목적의 스팸 콘텐츠를 등록하는 행위</li>
              <li>관련 법령을 위반하는 행위</li>
            </ul>
          </Section>

          <Section title="제7조 (콘텐츠 권리와 책임)">
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium">① 이용자 권리 보유</p>
                <p className="mt-1 text-(--muted)">
                  이용자가 서비스에 등록한 콘텐츠의 저작권은 해당 이용자에게 있습니다.
                  이용자는 본인이 적법한 권리를 보유한 콘텐츠만 등록해야 합니다.
                </p>
              </div>
              <div>
                <p className="font-medium">② 서비스 운영 목적 이용 허락</p>
                <p className="mt-1 text-(--muted)">
                  이용자는 서비스에 콘텐츠를 등록함으로써 회사에 대해 다음 목적의 비독점적·무상 이용 권한을 허락합니다.
                </p>
                <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-(--muted)">
                  <li>서비스 내 공개 페이지 표시 및 공유</li>
                  <li>OG 이미지·썸네일 자동 생성 등 기술적 처리</li>
                  <li>서비스 품질 개선 및 기능 개발 목적의 내부 분석</li>
                  <li>서비스 홍보 목적의 예시 노출 (이용자 사전 동의 시)</li>
                </ul>
                <p className="mt-1.5 text-xs text-(--muted)">
                  이 권한은 이용자가 해당 콘텐츠를 삭제하거나 회원 탈퇴 시 소멸합니다.
                </p>
              </div>
              <div>
                <p className="font-medium">③ 콘텐츠 책임</p>
                <p className="mt-1 text-(--muted)">
                  등록된 콘텐츠로 인해 발생하는 법적 분쟁 및 손해에 대한 책임은 해당 이용자에게 있습니다.
                  타인의 저작권·초상권·상표권 침해로 인한 클레임은 해당 이용자가 직접 해결해야 합니다.
                </p>
              </div>
            </div>
          </Section>

          <Section title="제8조 (저작권 침해 신고 및 처리)">
            <p>
              서비스 내 콘텐츠가 본인의 저작권·초상권·상표권을 침해한다고 판단하는 경우 아래 방법으로 신고하세요.
              회사는 정보통신망법 제44조의2에 따라 신고 접수 후 신속히 처리합니다.
            </p>
            <div className="mt-3 rounded-xl bg-(--secondary) p-4">
              <p className="font-medium">신고 방법</p>
              <p className="mt-1 text-xs text-(--muted)">
                이메일: <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">{EMAIL}</a><br />
                제목: [저작권 침해 신고]<br />
                포함 내용: 침해 주장 콘텐츠 URL, 원본 저작물 정보, 신고자 연락처
              </p>
            </div>
            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>접수 후 영업일 기준 5일 이내 검토</li>
              <li>침해 확인 시 해당 콘텐츠 비공개 처리 또는 삭제</li>
              <li>처리 결과를 신고자 및 게시자에게 이메일로 통보</li>
              <li>허위 신고로 인한 손해는 신고자가 책임</li>
            </ul>
          </Section>

          <Section title="제9조 (유료 서비스 및 자동결제)">
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-(--secondary) p-4">
                <p className="font-medium">자동결제 안내</p>
                <p className="mt-1 text-xs text-(--muted)">
                  유료 플랜은 월 단위 자동갱신 구독 방식입니다.
                  최초 결제일을 기준으로 매월 동일 날짜에 자동으로 청구됩니다.
                  결제는 토스페이먼츠(주)를 통해 처리됩니다.
                </p>
              </div>
              <div>
                <p className="font-medium">① 해지 방법</p>
                <p className="mt-1 text-(--muted)">
                  대시보드 내 구독 관리 메뉴에서 언제든지 직접 해지할 수 있습니다.
                  해지 신청 즉시 다음 결제일 자동 청구가 중단되며,
                  현재 구독 기간 만료일까지 유료 플랜 기능을 계속 이용할 수 있습니다.
                </p>
              </div>
              <div>
                <p className="font-medium">② 해지 후 플랜 변경</p>
                <p className="mt-1 text-(--muted)">
                  해지 후 무료 플랜으로 전환됩니다. 유료 플랜에서 적용한 테마·커스텀 설정은
                  무료 전환 후에도 기존 설정이 유지되나, 유료 기능 추가 편집은 제한됩니다.
                </p>
              </div>
              <div>
                <p className="font-medium">③ 환불</p>
                <p className="mt-1 text-(--muted)">
                  환불 기준은 별도 환불 정책을 따릅니다.
                  중도 해지 시 잔여 이용 기간에 대한 환불은 제공되지 않습니다.
                </p>
              </div>
              <div>
                <p className="font-medium">④ 결제 실패 시 처리</p>
                <p className="mt-1 text-(--muted)">
                  자동결제 실패 시 회사는 이메일로 안내하며,
                  결제 실패 후 7일 이내에 결제가 이루어지지 않으면 유료 플랜이 자동으로 해지됩니다.
                </p>
              </div>
            </div>
          </Section>

          <Section title="제10조 (후원 기능)">
            <div className="flex flex-col gap-3">
              <p>
                이용자는 자신의 공개 페이지에 외부 결제 수단(카카오페이·계좌이체 등)을 통한
                후원 기능을 활성화할 수 있습니다.
              </p>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
                <li>후원은 방문자가 이용자에게 자발적으로 제공하는 것이며, 회사는 후원 자금을 수취·보관·중개하지 않습니다.</li>
                <li>후원자가 이름·응원 메시지 등록 시 공개 동의 여부를 명시적으로 선택해야 하며, 익명 선택이 가능합니다.</li>
                <li>후원 관련 세금 신고 의무는 수취 이용자 본인에게 있습니다.</li>
                <li>후원 기능을 통한 불법 자금 세탁·사기 행위는 즉시 계정 정지 및 수사기관 신고 대상입니다.</li>
              </ul>
            </div>
          </Section>

          <Section title="제11조 (서비스 이용 제한 및 계정 정지)">
            <p>
              회사는 이용자가 이 약관 또는 콘텐츠 정책을 위반한 경우 다음 조치를 취할 수 있습니다.
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>1차: 경고 및 해당 콘텐츠 삭제</li>
              <li>2차: 일정 기간 서비스 이용 제한</li>
              <li>3차: 계정 영구 정지</li>
              <li>불법 콘텐츠·아동 보호 위반 등 심각한 위반 시 즉시 계정 정지</li>
            </ul>
          </Section>

          <Section title="제12조 (책임의 한계)">
            <p>
              회사는 이용자가 서비스를 이용하여 기대하는 수익·결과를 보장하지 않습니다.
              회사는 이용자가 게시한 콘텐츠로 인해 발생하는 제3자와의 분쟁·손해에 대해 책임을 지지 않습니다.
              천재지변, 통신 장애, 외부 서비스(Supabase·Cloudinary·토스페이먼츠 등) 장애 등
              불가항력으로 인한 서비스 중단에 대해서도 책임이 면제됩니다.
            </p>
          </Section>

          <Section title="제13조 (문의 및 준거법)">
            <p>
              서비스 이용에 관한 문의는{" "}
              <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">{EMAIL}</a>로 보내주세요.
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
