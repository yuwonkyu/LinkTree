import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

type Props = { searchParams: Promise<{ slug?: string; rating?: string }> };

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function FeedbackPage({ searchParams }: Props) {
  const { slug, rating } = await searchParams;
  const isValid = !!slug && (rating === "good" || rating === "bad");

  if (isValid) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (profile) {
      await supabaseAdmin.from("feedback_ratings").insert({
        profile_id: profile.id,
        slug,
        rating,
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--secondary) px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-[0_4px_20px_rgba(17,24,39,0.08)]">
        {isValid ? (
          <>
            <div className="mb-4 text-4xl">{rating === "good" ? "🙏" : "💬"}</div>
            <h1 className="mb-2 text-xl font-bold text-foreground">
              {rating === "good" ? "피드백 감사합니다!" : "의견 감사합니다!"}
            </h1>
            <p className="mb-6 text-sm text-(--muted)">
              {rating === "good"
                ? "InstaLink가 도움이 됐다니 정말 기쁩니다. 앞으로도 더 좋은 서비스를 제공하겠습니다."
                : "소중한 의견 감사합니다. 더 나은 서비스를 위해 열심히 개선하겠습니다."}
            </p>
            <Link
              href="/dashboard"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              대시보드로 이동
            </Link>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-xl font-bold text-foreground">잘못된 링크입니다</h1>
            <p className="mb-6 text-sm text-(--muted)">유효하지 않은 피드백 링크입니다.</p>
            <Link href="/" className="text-sm font-medium text-foreground hover:underline">
              홈으로 →
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
