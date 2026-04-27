import { COMPANY_INFO } from "@/lib/company-info";

export default function LandingFooter() {
  return (
    <footer className="border-t border-black/5 px-4 py-8 text-center text-xs text-(--muted) sm:px-6">
      <p>© 2026 InstaLink · 소상공인을 위한 인스타 링크 페이지</p>
      <nav className="mt-3 flex flex-wrap justify-center gap-4">
        <a href="/terms" className="hover:text-foreground">이용약관</a>
        <a href="/content-policy" className="hover:text-foreground">콘텐츠 정책</a>
        <a href="/refund" className="hover:text-foreground">환불 정책</a>
        <a href="/privacy" className="hover:text-foreground">개인정보처리방침</a>
      </nav>
      <div className="mt-4 space-y-0.5">
        <p>{COMPANY_INFO.name}({COMPANY_INFO.nameEn}) · 대표 {COMPANY_INFO.ceo}</p>
        <p>
          사업자등록번호 {COMPANY_INFO.bizNo}
          {COMPANY_INFO.reportNo && ` · 통신판매업 ${COMPANY_INFO.reportNo}`}
        </p>
        <p>
          <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-foreground">
            {COMPANY_INFO.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
