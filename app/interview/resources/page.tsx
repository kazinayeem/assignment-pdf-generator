import Link from "next/link";
import { getArticlesByCategory } from "@/lib/knowledge/loader";

export default function ResourcesPage() {
  const articles = getArticlesByCategory("resources");
  return (
    <div className="flex-1 min-w-0">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Resources</h1>
      <p className="text-slate-500 mb-8">{articles.length} resources</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <Link key={a.id} href={a.route} className="glass-card p-5 hover:border-[#6D5DF6]/30 transition-colors group">
            <h3 className="font-bold group-hover:text-[#6D5DF6] transition-colors">{a.title}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{a.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
