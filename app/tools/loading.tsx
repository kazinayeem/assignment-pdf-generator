export default function ToolsLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#E5E7EB] dark:border-white/10 border-t-[#6D5DF6] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading learning tools...</p>
        <div className="flex gap-2 justify-center mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#6D5DF6]/40 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
