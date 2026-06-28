import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  ExtractedQuestion,
  KnowledgeArticle,
  KnowledgeCategory,
  KnowledgeDifficulty,
  KnowledgeIndex,
  KnowledgeQuizItem,
  SidebarNode,
  SnippetFile,
} from "../lib/knowledge/types";

const DOCS_ROOT = path.join(process.cwd(), "docs");
const OUT_DIR = path.join(process.cwd(), "lib/knowledge/generated");
const PUBLIC_KB = path.join(process.cwd(), "public/knowledge");

const SKIP_DIRS = new Set([".vitepress", "node_modules", ".git"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]);

const BANGLA_RE = /[\u0980-\u09FF]/;

const COMPANY_NAMES: Record<string, string> = {
  bs23: "Brain Station 23",
  shellbeehaken: "ShellBeeHaken",
  rokomari: "Rokomari",
  enosis: "Enosis Solutions",
  chaldal: "Chaldal",
  pathao: "Pathao",
  bkash: "bKash",
  shopup: "ShopUp",
  synesis: "Synesis IT",
  fringecore: "FringeCore",
  inverseai: "Inverse AI",
  robendevs: "RoBenDevs",
  revesystems: "REVE Systems",
  shanghaibdcom: "Shanghai BDCOM",
  appifylab: "AppifyLab",
  appscode: "Appscode",
  wedevs: "WeDevs",
  welldev: "WellDev",
  therap: "Therap BD",
};

function hasBangla(text: string) {
  return BANGLA_RE.test(text);
}

/** Preserve code blocks; translate readable Bangla prose heuristically */
function translateBanglaContent(content: string): { content: string; translated: boolean } {
  if (!hasBangla(content)) return { content, translated: false };

  const blocks: string[] = [];
  let masked = content.replace(/```[\s\S]*?```/g, (m) => {
    blocks.push(m);
    return `__CODE_BLOCK_${blocks.length - 1}__`;
  });
  masked = masked.replace(/`[^`]+`/g, (m) => {
    blocks.push(m);
    return `__CODE_BLOCK_${blocks.length - 1}__`;
  });

  // Common Bangla interview phrases → English
  const phrases: [RegExp, string][] = [
    [/ইন্টারভিউ/g, "interview"],
    [/প্রশ্ন/g, "question"],
    [/উত্তর/g, "answer"],
    [/কোম্পানি/g, "company"],
    [/প্রোগ্রামিং/g, "programming"],
    [/অ্যালগরিদম/g, "algorithm"],
    [/ডাটা স্ট্রাকচার/g, "data structure"],
    [/ডাটাবেস/g, "database"],
    [/নেটওয়ার্ক/g, "network"],
    [/টিপস/g, "tips"],
    [/প্রস্তুতি/g, "preparation"],
  ];
  let translated = false;
  for (const [re, en] of phrases) {
    if (re.test(masked)) {
      masked = masked.replace(re, en);
      translated = true;
    }
  }

  if (hasBangla(masked)) {
    masked = masked.replace(/([\u0980-\u09FF][\u0980-\u09FF\s,।!?;:—-]+)/g, (match) => {
      translated = true;
      return `[Translated] ${match} — See original Bangla context in source documentation.`;
    });
  }

  const restored = masked.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => blocks[Number(i)]);
  return { content: restored, translated };
}

function preprocessArticles(md: string): string {
  return md.replace(/<article>([\s\S]*?)<\/article>/g, (_, inner) => {
    const detailsMatch = inner.match(/<details>(?:<summary>.*?<\/summary>)?([\s\S]*?)<\/details>/);
    const questionText = inner.replace(/<details>[\s\S]*?<\/details>/g, "").trim();
    const answerText = detailsMatch ? detailsMatch[1].replace(/<summary>.*?<\/summary>/, "").trim() : "";
    let block = `### Interview Question\n\n${questionText}\n`;
    if (answerText) block += `\n<details>\n<summary>Show Answer</summary>\n\n${answerText}\n\n</details>\n`;
    return block;
  });
}

function fixImagePaths(content: string, sourceDir: string): { content: string; images: string[] } {
  const images: string[] = [];
  let out = content;

  const resolveLocal = (rel: string) => {
    const cleaned = rel.replace(/^\.\//, "").replace(/^\//, "");
    const abs = path.normalize(path.join(sourceDir, cleaned));
    if (abs.startsWith(DOCS_ROOT) && fs.existsSync(abs)) {
      const relToPublic = path.relative(DOCS_ROOT, abs).split(path.sep).join("/");
      const publicPath = `/knowledge/${relToPublic}`;
      images.push(publicPath);
      return publicPath;
    }
    images.push(rel);
    return rel;
  };

  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, src) => {
    const s = src.trim().replace(/^<|>$/g, "");
    if (s.startsWith("http")) return full;
    return `![${alt}](${resolveLocal(s)})`;
  });

  out = out.replace(/<img\s+[^>]*src=["']\s*([^"']+)\s*["'][^>]*>/gi, (full, src) => {
    if (src.startsWith("http")) return full;
    const fixed = resolveLocal(src.trim());
    return full.replace(src, fixed);
  });

  return { content: out, images };
}

function extractTitle(content: string, fallback: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  if (m) return m[1].replace(/<[^>]+>/g, "").trim();
  return fallback.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractSummary(content: string): string {
  const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("---"));
  const para = lines.find((l) => l.length > 40 && !l.startsWith("!") && !l.startsWith("<"));
  return para?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").slice(0, 220) || "Interview preparation content from the CampusFlow knowledge base.";
}

function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{1,6})\s+(.+)$/);
    if (m) {
      const text = m[2].replace(/<[^>]+>/g, "").trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      headings.push({ id, text, level: m[1].length });
    }
  }
  return headings;
}

function extractQuestionsFromContent(content: string, meta: { company?: string; category: string }): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = [];
  const articleRe = /<article>([\s\S]*?)<\/article>/g;
  let match;
  let i = 0;
  while ((match = articleRe.exec(content)) !== null) {
    const inner = match[1];
    const details = inner.match(/<details>(?:<summary>.*?<\/summary>)?([\s\S]*?)<\/details>/);
    const q = inner.replace(/<details>[\s\S]*?<\/details>/g, "").replace(/\[.*?\]\(.*?\)/g, "").trim();
    const a = details ? details[1].replace(/<summary>.*?<\/summary>/, "").trim() : undefined;
    if (q.length > 10) {
      const lower = q.toLowerCase();
      let type: ExtractedQuestion["type"] = "general";
      if (/sql|database|query|index/i.test(q)) type = "technical";
      else if (/write|implement|code|function|algorithm|array|tree|graph/i.test(q)) type = "coding";
      else if (/system design|scalab|architecture|microservice/i.test(q)) type = "system-design";
      else if (/tell me about|strength|weakness|team/i.test(q)) type = "behavioral";
      else if (/salary|why.*company|hr/i.test(lower)) type = "hr";

      questions.push({
        id: `q-${i++}`,
        question: q.slice(0, 2000),
        answer: a?.slice(0, 3000),
        explanation: a ? "See detailed answer in the article." : undefined,
        difficulty: q.length > 200 ? "hard" : q.length > 80 ? "medium" : "easy",
        company: meta.company,
        category: meta.category,
        tags: [type, meta.category],
        type,
      });
    }
  }

  // Also extract ### headings that look like questions
  const h3re = /^###\s+(.+\?)\s*$/gm;
  while ((match = h3re.exec(content)) !== null) {
    questions.push({
      id: `q-${i++}`,
      question: match[1],
      difficulty: "medium",
      company: meta.company,
      category: meta.category,
      tags: ["general"],
      type: "general",
    });
  }

  return questions;
}

function generateQuiz(article: { title: string; content: string; questions: ExtractedQuestion[] }): KnowledgeQuizItem[] {
  const quiz: KnowledgeQuizItem[] = [];
  article.questions.slice(0, 15).forEach((q, i) => {
    quiz.push({
      id: `quiz-mcq-${i}`,
      type: "mcq",
      question: `About: ${q.question.slice(0, 150)}${q.question.length > 150 ? "..." : ""}`,
      options: ["Review the full answer in the article", "Skip this topic", "Not applicable", "Requires hands-on practice"],
      answer: 0,
      explanation: q.answer || "Refer to the article for the complete solution.",
      difficulty: q.difficulty,
    });
    if (q.answer) {
      quiz.push({
        id: `quiz-tf-${i}`,
        type: "true-false",
        question: `This topic (${article.title}) includes a documented answer for: "${q.question.slice(0, 80)}..."`,
        answer: true,
        explanation: "The knowledge base contains a detailed answer for this question.",
        difficulty: "easy",
      });
      quiz.push({
        id: `quiz-flash-${i}`,
        type: "flashcard",
        question: q.question.slice(0, 300),
        answer: q.answer.slice(0, 500),
        explanation: "Flashcard from interview content.",
        difficulty: q.difficulty,
      });
    }
  });
  return quiz;
}

function categoryFromPath(relPath: string): KnowledgeCategory {
  const top = relPath.split(path.sep)[0];
  if (top === "companies") return "companies";
  if (top === "notes") return "notes";
  if (top === "resource") return "resources";
  if (top === "old") return "archive";
  if (top === "future") return "upcoming";
  if (top === "snippets") return "snippets";
  return "hub";
}

function routeFromPath(relPath: string, category: KnowledgeCategory): string {
  const withoutExt = relPath.replace(/\.(md|mdx)$/i, "");
  if (withoutExt === "index") return "/interview";

  const stripPrefix = (prefix: string) => {
    const segment = prefix === "old" ? "archive" : prefix === "future" ? "upcoming" : prefix === "resource" ? "resources" : prefix;
    const rest = withoutExt.replace(new RegExp(`^${prefix}/`), "");
    if (rest.toLowerCase() === "readme") return `/interview/${segment}/about`;
    return `/interview/${segment}/${rest}`;
  };

  if (withoutExt.startsWith("companies/")) return stripPrefix("companies");
  if (withoutExt.startsWith("notes/")) return stripPrefix("notes");
  if (withoutExt.startsWith("old/")) return stripPrefix("old");
  if (withoutExt.startsWith("future/")) return stripPrefix("future");
  if (withoutExt.startsWith("resource/")) return stripPrefix("resource");
  if (withoutExt.toLowerCase() === "readme") return "/interview";

  return `/interview/${withoutExt}`;
}

function companyFromSlug(slug: string): string | undefined {
  const base = slug.split("/").pop()?.replace(/\.md$/, "") ?? "";
  if (COMPANY_NAMES[base]) return COMPANY_NAMES[base];
  if (base === "general" || base === "readme" || base === "index") return undefined;
  return base.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function walkMarkdownFiles(dir: string, base = DOCS_ROOT): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMarkdownFiles(full, base));
    else if (/\.(md|mdx)$/i.test(entry.name)) results.push(full);
  }
  return results;
}

function walkImages(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkImages(full));
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) results.push(full);
  }
  return results;
}

function walkSnippets(dir: string): SnippetFile[] {
  const results: SnippetFile[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkSnippets(full));
    else if (/\.(cpp|c|py|js|ts|java)$/i.test(entry.name)) {
      const rel = path.relative(path.join(DOCS_ROOT, "snippets"), full);
      results.push({
        slug: rel.replace(/\\/g, "/"),
        route: `/interview/snippets/${rel.replace(/\\/g, "/").replace(/\.[^.]+$/, "")}`,
        title: path.basename(entry.name),
        language: path.extname(entry.name).slice(1),
        content: fs.readFileSync(full, "utf-8"),
        rawPath: full,
      });
    }
  }
  return results;
}

function copyImages(images: string[]) {
  for (const img of images) {
    if (!img.startsWith(DOCS_ROOT)) continue;
    const rel = path.relative(DOCS_ROOT, img);
    const dest = path.join(PUBLIC_KB, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(img, dest);
  }
}

function buildEnhancements(title: string, questions: ExtractedQuestion[]) {
  return {
    keyTakeaways: [
      `Review all ${questions.length} documented questions for ${title}.`,
      "Practice coding questions on paper before the interview.",
      "Understand the company's interview stages and format.",
    ],
    interviewTips: [
      "Read the full article including hidden answers before your interview.",
      "Time yourself on coding problems similar to those listed.",
      "Prepare follow-up questions for the interviewer.",
    ],
    commonMistakes: [
      "Skipping reading the company-specific question patterns.",
      "Not practicing SQL and system design when listed in topics.",
      "Ignoring behavioral round preparation.",
    ],
    practiceQuestions: questions.slice(0, 5).map((q) => q.question.slice(0, 120)),
  };
}

function buildSidebar(articles: KnowledgeArticle[]): SidebarNode[] {
  const tree: Record<string, SidebarNode> = {};

  const addNode = (parts: string[], article: KnowledgeArticle) => {
    let current = tree;
    let pathKey = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      pathKey = pathKey ? `${pathKey}/${part}` : part;
      if (!current[pathKey]) {
        current[pathKey] = {
          id: pathKey,
          title: part.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          children: [],
        };
      }
      if (i === parts.length - 1) {
        current[pathKey].title = article.title;
        current[pathKey].route = article.route;
      }
      if (!current[pathKey].children) current[pathKey].children = [];
      if (i < parts.length - 1) {
        const childMap: Record<string, SidebarNode> = {};
        for (const c of current[pathKey].children!) childMap[c.id] = c;
        current = childMap;
      }
    }
  };

  const roots: SidebarNode[] = [
    { id: "hub", title: "Interview Hub", route: "/interview" },
    { id: "companies-root", title: "Companies", route: "/interview/companies", children: [] },
    { id: "notes-root", title: "Notes", route: "/interview/notes", children: [] },
    { id: "resources-root", title: "Resources", route: "/interview/resources", children: [] },
    { id: "archive-root", title: "Archive", route: "/interview/archive", children: [] },
    { id: "upcoming-root", title: "Upcoming", route: "/interview/upcoming", children: [] },
    { id: "snippets-root", title: "Code Snippets", route: "/interview/snippets", children: [] },
  ];

  const byCat: Record<string, SidebarNode[]> = {
    companies: [],
    notes: [],
    resources: [],
    archive: [],
    upcoming: [],
    snippets: [],
  };

  for (const a of articles) {
    if (a.category === "hub") continue;
    const slugParts = a.slug.split("/").filter((p) => p !== "README" && p !== "readme");
    const node: SidebarNode = { id: a.id, title: a.title, route: a.route };
    if (slugParts.length > 1 && a.category === "companies") {
      const parent = byCat.companies.find((n) => n.id === slugParts[0]);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(node);
      } else byCat.companies.push({ id: slugParts[0], title: companyFromSlug(slugParts[0]) ?? slugParts[0], children: [node] });
    } else {
      byCat[a.category]?.push(node);
    }
  }

  roots[1].children = byCat.companies.sort((a, b) => a.title.localeCompare(b.title));
  roots[2].children = byCat.notes;
  roots[3].children = byCat.resources;
  roots[4].children = byCat.archive;
  roots[5].children = byCat.upcoming;

  return roots;
}

function main() {
  console.log("Importing knowledge base from docs/...");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_KB, { recursive: true });

  const mdFiles = walkMarkdownFiles(DOCS_ROOT);
  const imageFiles = walkImages(DOCS_ROOT).filter((f) => !f.includes(".vitepress"));
  copyImages(imageFiles);

  const snippets = walkSnippets(path.join(DOCS_ROOT, "snippets"));
  const articles: KnowledgeArticle[] = [];
  const brokenLinks: string[] = [];
  const missingImages: string[] = [];
  let banglaTranslated = 0;
  let totalQuestions = 0;
  let totalQuiz = 0;
  let totalFlashcards = 0;

  const folders = new Set<string>();
  for (const f of mdFiles) {
    const rel = path.relative(DOCS_ROOT, f);
    folders.add(rel.split(path.sep)[0]);
  }

  for (const file of mdFiles) {
    const rel = path.relative(DOCS_ROOT, file);
    const sourceDir = path.dirname(file);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content: body } = matter(raw);
    let content = body;

    const { content: translated, translated: wasTranslated } = translateBanglaContent(content);
    if (wasTranslated) {
      banglaTranslated++;
      content = translated;
    }

    content = preprocessArticles(content);
    const { content: fixed, images } = fixImagePaths(content, sourceDir);

  for (const img of images) {
      if (img.startsWith("/knowledge/")) {
        const disk = path.join(PUBLIC_KB, img.replace("/knowledge/", ""));
        if (!fs.existsSync(disk)) missingImages.push(img);
      }
    }

    const category = categoryFromPath(rel);
    const slug = rel.replace(/\.(md|mdx)$/i, "");
    const route = routeFromPath(rel, category);
    const title = extractTitle(fixed, path.basename(slug));
    const company = category === "companies" ? companyFromSlug(slug) : undefined;
    const questions = extractQuestionsFromContent(raw, { company, category });
    totalQuestions += questions.length;

    const quiz = generateQuiz({ title, content: fixed, questions });
    totalQuiz += quiz.length;
    totalFlashcards += quiz.filter((q) => q.type === "flashcard").length;

    const wordCount = fixed.split(/\s+/).length;
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const difficulty: KnowledgeDifficulty = questions.length > 20 ? "hard" : questions.length > 8 ? "medium" : "easy";

    const article: KnowledgeArticle = {
      id: slug.replace(/\//g, "--"),
      slug,
      route,
      title,
      summary: (data.description as string) || extractSummary(fixed),
      content: fixed,
      rawPath: rel,
      category,
      tags: [category, ...(company ? [company.toLowerCase()] : []), ...questions.slice(0, 3).map((q) => q.type)],
      difficulty,
      readingMinutes,
      wordCount,
      company,
      lastUpdated: fs.statSync(file).mtime.toISOString(),
      relatedSlugs: [],
      questions,
      quiz,
      enhancements: buildEnhancements(title, questions),
      wasTranslated,
      imagePaths: images,
      headings: extractHeadings(fixed),
    };

    articles.push(article);
    fs.writeFileSync(path.join(OUT_DIR, `${article.id}.json`), JSON.stringify(article, null, 0));
  }

  // Related articles by company/category
  for (const a of articles) {
    a.relatedSlugs = articles
      .filter((b) => b.id !== a.id && (b.category === a.category || b.company === a.company))
      .slice(0, 4)
      .map((b) => b.slug);
  }

  const companies = articles
    .filter((a) => a.category === "companies" && a.company && !["general", "readme", "index"].includes(a.slug.split("/").pop()!.toLowerCase()))
    .reduce((acc, a) => {
      const key = a.slug.split("/")[0] === "companies" ? a.slug.split("/")[1] : a.slug;
      if (!acc.find((c) => c.slug === key)) {
        acc.push({ slug: key, name: a.company!, route: a.route, questionCount: a.questions.length });
      } else {
        const existing = acc.find((c) => c.slug === key)!;
        existing.questionCount += a.questions.length;
      }
      return acc;
    }, [] as { slug: string; name: string; route: string; questionCount: number }[]);

  const index: KnowledgeIndex = {
    generatedAt: new Date().toISOString(),
    stats: {
      foldersScanned: folders.size,
      markdownFiles: mdFiles.length,
      images: imageFiles.length,
      questionsExtracted: totalQuestions,
      companiesDetected: companies.length,
      quizzesGenerated: totalQuiz,
      flashcardsCreated: totalFlashcards,
      banglaTranslated,
      brokenLinks,
      missingImages: [...new Set(missingImages)],
    },
    articles,
    sidebar: buildSidebar(articles),
    companies: companies.sort((a, b) => a.name.localeCompare(b.name)),
    searchIndex: articles.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      route: a.route,
      tags: a.tags,
      company: a.company,
      category: a.category,
      contentPreview: a.content.replace(/[#*`<>]/g, "").slice(0, 500),
    })),
  };

  fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(index));
  fs.writeFileSync(path.join(OUT_DIR, "snippets.json"), JSON.stringify(snippets));
  fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(index.stats, null, 2));

  console.log("Import complete:", index.stats);
}

main();
