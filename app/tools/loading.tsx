export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading tools...</p>
      </div>
    </div>
  );
}
