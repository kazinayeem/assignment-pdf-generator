export default function CareerLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-white/10 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
