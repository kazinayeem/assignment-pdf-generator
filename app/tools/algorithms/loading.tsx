export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-3 w-3 bg-slate-200 rounded" />
        <div className="h-3 w-24 bg-slate-200 rounded" />
      </div>
      <div className="h-10 w-72 bg-slate-200 rounded-xl mb-3" />
      <div className="h-5 w-96 bg-slate-200 rounded-lg mb-10" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="h-8 w-8 bg-slate-200 rounded-lg mb-3" />
            <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-full bg-slate-200 rounded mb-4" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
