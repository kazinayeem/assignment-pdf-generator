export function MarkdownSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden>
      <div className="h-8 bg-muted rounded-lg w-3/4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-4/6" />
      <div className="h-48 bg-muted rounded-xl mt-6" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
  );
}
