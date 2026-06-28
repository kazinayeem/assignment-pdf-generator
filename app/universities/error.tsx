"use client";

export default function UniversitiesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">We could not load this university page.</p>
      <button
        type="button"
        onClick={reset}
        className="px-6 py-3 rounded-xl bg-brand text-brand-foreground font-semibold min-h-[44px]"
      >
        Try again
      </button>
    </div>
  );
}
