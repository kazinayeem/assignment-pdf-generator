import Link from "next/link";
import { getArticlesByCategory } from "@/lib/knowledge/loader";

function CategoryList({ category, title }: { category: "notes" | "resources" | "archive" | "upcoming"; title: string }) {
  const articles = getArticlesByCategory(category);
  return (
    <div className="flex-1 min-w-0">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{title}</h1>
      <p className="text-slate-500 mb-8">{articles.length} articles</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <Link key={a.id} href={a.route} className="glass-card p-5 hover:border-[#6D5DF6]/30 transition-colors group">
            <h3 className="font-bold group-hover:text-[#6D5DF6] transition-colors">{a.title}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{a.summary}</p>
            <p className="text-xs text-slate-400 mt-2">{a.readingMinutes} min · {a.questions.length} questions</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function NotesPage() { return <CategoryList category="notes" title="Theory Notes" />; }
