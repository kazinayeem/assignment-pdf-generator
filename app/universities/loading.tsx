export default function UniversitiesLoading() {
  return (
    <div className="min-h-full animate-pulse">
      <div className="border-b border-border py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="h-6 w-32 bg-muted rounded-full mb-4" />
        <div className="h-10 w-2/3 max-w-lg bg-muted rounded-xl mb-4" />
        <div className="h-5 w-full max-w-2xl bg-muted rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-6 w-48 bg-muted rounded-lg mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="h-14 bg-muted rounded-2xl mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
