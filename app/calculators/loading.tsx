export default function CalculatorsLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-20">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-white/10 rounded-lg" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-200 dark:bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
