import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import { signOut } from "@/app/auth/actions";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-(--secondary)">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            InstaLink
          </span>
          <div className="flex items-center gap-3">
            {user.email === ADMIN_EMAIL && (
              <Link href="/admin" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-(--muted) hover:border-gray-300 hover:text-foreground transition-colors">
                관리자
              </Link>
            )}
            <Link href="/dashboard/stats" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-(--muted) hover:border-gray-300 hover:text-foreground transition-colors">
              통계
            </Link>
            <span className="hidden text-xs text-(--muted) sm:block">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-(--muted) hover:border-gray-300 hover:text-foreground transition-colors"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
