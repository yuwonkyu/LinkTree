import Link from "next/link";
import { COMPANY_INFO } from "@/lib/company-info";

export default function LandingFooter() {
  return (
    <footer className="border-t border-black/5 bg-(--card) px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* 3컬럼 그리드 — 모바일: 세로 스택, sm 이상: 3열 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">

          {/* 좌: 로고 + 서비스 설명 */}
          <div>
            <Link
              href="/"
              className="text-base font-bold tracking-tight text-foreground hover:opacity-80 transition"
            >
              InstaLink
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-6 text-(--muted)">
              소상공인을 위한 인스타 링크 페이지.
              포트폴리오 · 예약 · 후기를 1페이지에 담아 고객을 바로 문의로 이끕니다.
            </p>
            <p className="mt-4 text-xs text-(--muted)">© 2026 InstaLink</p>
          </div>

          {/* 중: 메뉴 링크 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-(--muted)">
              메뉴
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-(--muted) transition hover:text-foreground">
                이용약관
              </Link>
              <Link href="/content-policy" className="text-sm text-(--muted) transition hover:text-foreground">
                콘텐츠 정책
              </Link>
              <Link href="/refund" className="text-sm text-(--muted) transition hover:text-foreground">
                환불 정책
              </Link>
              <Link href="/privacy" className="text-sm text-(--muted) transition hover:text-foreground">
                개인정보처리방침
              </Link>
            </nav>
          </div>

          {/* 우: 연락처 + 후원 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-(--muted)">
              연락처
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-(--muted)">
              <p>
                {COMPANY_INFO.name}({COMPANY_INFO.nameEn}) · 대표 {COMPANY_INFO.ceo}
              </p>
              <p>사업자등록번호 {COMPANY_INFO.bizNo}</p>
              {COMPANY_INFO.reportNo && (
                <p>통신판매업 {COMPANY_INFO.reportNo}</p>
              )}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="transition hover:text-foreground"
              >
                {COMPANY_INFO.email}
              </a>
            </div>

            {/* 후원 */}
            {(COMPANY_INFO.donationKakao || COMPANY_INFO.donationTossBank) && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-(--muted)">
                  후원
                </p>
                <p className="mt-1 text-xs leading-5 text-(--muted)">
                  InstaLink가 유용했다면 커피 한 잔 선물해 주세요 ☕
                </p>
                {COMPANY_INFO.donationKakao && (
                  <a
                    href={COMPANY_INFO.donationKakao}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#FEE500] px-3 py-1.5 text-xs font-bold text-[#3C1E1E] transition hover:brightness-95"
                  >
                    💛 카카오페이 후원
                  </a>
                )}
              </div>
            )}
          </div>

        </div>

        {/* 하단 구분선 + 마지막 한 줄 */}
        <div className="mt-10 border-t border-black/5 pt-6 text-center text-xs text-(--muted)">
          InstaLink는 소상공인 사장님들을 응원합니다 🙌
        </div>

      </div>
    </footer>
  );
}
