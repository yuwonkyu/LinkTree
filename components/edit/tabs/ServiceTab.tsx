import Link from "next/link";
import Section from "@/components/edit/Section";
import ServiceManager from "@/components/dashboard/ServiceManager";
import LinkManager from "@/components/dashboard/LinkManager";
import BusinessHoursEditor from "@/components/dashboard/BusinessHoursEditor";
import { TEMPLATES } from "@/data/templates";
import type { Service, CustomLink, BusinessHours } from "@/lib/types";

export type ServiceTabProps = {
  services: Service[];          setServices: (v: Service[]) => void;
  servicesLimit?: number;
  customLinks: CustomLink[];    setCustomLinks: (v: CustomLink[]) => void;
  businessHours: BusinessHours; setBusinessHours: (v: BusinessHours) => void;
  isPaidPlan: boolean;
  isProPlan: boolean;
  category: string;             setCategory: (v: string) => void;
  aiLoading: string | null;
  onAISuggest: (type: "tagline" | "description" | "services") => void;
};

export default function ServiceTab({
  services, setServices, servicesLimit,
  customLinks, setCustomLinks,
  businessHours, setBusinessHours,
  isPaidPlan, isProPlan,
  category, setCategory,
  aiLoading, onAISuggest,
}: ServiceTabProps) {
  return (
    <>
      {/* ── 서비스 & 가격 ── */}
      <Section title="서비스 &amp; 가격">
        <ServiceManager
          services={services}
          isPaidPlan={isPaidPlan}
          isProPlan={isProPlan}
          limit={servicesLimit}
          aiLoading={aiLoading}
          onAISuggest={() => onAISuggest("services")}
          onChange={setServices}
          category={category}
          onCategoryChange={setCategory}
          templateServices={TEMPLATES[category]?.services ?? []}
        />
      </Section>

      {/* ── 추가 링크 ── */}
      <Section title="추가 링크 (선택)">
        <LinkManager links={customLinks} onChange={setCustomLinks} />
      </Section>

      {/* ── 영업일 & 운영시간 ── */}
      {isPaidPlan ? (
        <Section title="영업일 & 운영시간 (Basic+)">
          <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
            <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
            <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
              요일 버튼을 눌러 영업일을 설정하면 고객 페이지에 시각적으로 표시됩니다.<br />
              기존 &apos;운영시간&apos; 텍스트 입력과 함께 사용할 수 있습니다.
            </p>
          </div>
          <BusinessHoursEditor value={businessHours} onChange={setBusinessHours} />
        </Section>
      ) : (
        <Section title="영업일 & 운영시간">
          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-(--muted)">
            🔒 요일별 영업시간 설정은 Basic 이상 플랜에서 사용 가능합니다.{" "}
            <Link href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">
              업그레이드
            </Link>
          </div>
        </Section>
      )}
    </>
  );
}
