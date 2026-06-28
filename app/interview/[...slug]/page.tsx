import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/knowledge/article-reader";
import { getArticleByRoute, getAllRoutes } from "@/lib/knowledge/loader";

export function generateStaticParams() {
  return getAllRoutes()
    .filter((r) => r !== "/interview")
    .map((route) => ({
      slug: route.replace(/^\/interview\//, "").split("/").filter(Boolean),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const route = slug?.length ? `/interview/${slug.join("/")}` : "/interview";
  const article = getArticleByRoute(route);
  return {
    title: article ? `${article.title} | Interview KB` : "Interview Knowledge Base",
    description: article?.summary,
  };
}

export default async function InterviewArticlePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!slug?.length) notFound();

  const route = `/interview/${slug.join("/")}`;
  const article = getArticleByRoute(route);

  if (!article) {
    // Hub sub-routes like /interview/companies are handled by dedicated pages
    notFound();
  }

  return <ArticleReader article={article} />;
}
