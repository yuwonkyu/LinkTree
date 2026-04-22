"use client";

import { useFormStatus } from "react-dom";
import { signIn } from "@/app/auth/actions";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          로그인 중…
        </span>
      ) : (
        "로그인"
      )}
    </button>
  );
}

export default function LoginForm() {
  return (
    <form action={signIn} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="hello@example.com"
          required
          className={inputCls}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className={inputCls}
        />
      </div>
      <SubmitButton />
      <div className="text-center">
        <a
          href="/auth/reset-password"
          className="text-xs text-(--muted) hover:text-foreground transition-colors"
        >
          비밀번호를 잊으셨나요?
        </a>
      </div>
    </form>
  );
}
