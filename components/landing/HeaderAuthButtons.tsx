"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function HeaderAuthButtons() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // 로딩 중: 자리 유지용 placeholder
  if (loggedIn === null) {
    return <div className="h-8 w-32 animate-pulse rounded-lg bg-black/5" />;
  }

  if (loggedIn) {
    return (
      <nav className="flex items-center gap-2 text-sm font-medium">
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-(--muted) transition hover:text-foreground"
        >
          로그아웃
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-85"
        >
          대시보드
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      <Link
        href="/auth/login"
        className="rounded-lg px-3 py-1.5 text-(--muted) transition hover:text-foreground"
      >
        로그인
      </Link>
      <Link
        href="/auth/signup"
        className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-85"
      >
        무료 시작
      </Link>
    </nav>
  );
}
