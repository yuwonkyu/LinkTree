type Props = {
  subtitle: string;
  heading: string;
  error?: string;
  success?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthCard({ subtitle, heading, error, success, children, footer }: Props) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-10">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">InstaLink</h1>
          <p className="mt-1 text-sm text-(--muted)">{subtitle}</p>
        </div>

        <div className="rounded-2xl bg-(--card) p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-5 text-lg font-semibold text-foreground">{heading}</h2>

          {success && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
          )}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {children}

          <p className="mt-4 text-center text-sm text-(--muted)">{footer}</p>
        </div>
      </div>
    </main>
  );
}
