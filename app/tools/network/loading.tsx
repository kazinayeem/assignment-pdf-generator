export default function NetworkLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading Network module...</p>
      </div>
    </div>
  );
}
