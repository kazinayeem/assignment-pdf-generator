import type { CommunityAnswer, CommunityPost } from "./types";

const KEY = "campusflow-uni-community";

function read(): CommunityPost[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(posts: CommunityPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(posts));
}

export function getCommunityPosts(filters?: {
  universitySlug?: string;
  department?: string;
  query?: string;
}): CommunityPost[] {
  let posts = read().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  if (filters?.universitySlug) {
    posts = posts.filter((p) => p.universitySlug === filters.universitySlug);
  }
  if (filters?.department) {
    posts = posts.filter((p) => p.department?.toLowerCase() === filters.department!.toLowerCase());
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }
  return posts;
}

export function addCommunityPost(post: Omit<CommunityPost, "id" | "likes" | "answers" | "createdAt">): CommunityPost {
  const newPost: CommunityPost = {
    ...post,
    id: `post-${Date.now()}`,
    likes: 0,
    answers: [],
    createdAt: new Date().toISOString(),
  };
  write([newPost, ...read()]);
  return newPost;
}

export function addAnswer(postId: string, answer: Omit<CommunityAnswer, "id" | "likes" | "createdAt">): CommunityAnswer | null {
  const posts = read();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx < 0) return null;

  const newAnswer: CommunityAnswer = {
    ...answer,
    id: `ans-${Date.now()}`,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  posts[idx].answers.push(newAnswer);
  write(posts);
  return newAnswer;
}

export function togglePostLike(postId: string): void {
  const posts = read();
  const post = posts.find((p) => p.id === postId);
  if (post) post.likes += 1;
  write(posts);
}

export function togglePostBookmark(postId: string): string[] {
  const KEY_BM = "campusflow-uni-community-bookmarks";
  const current: string[] = JSON.parse(localStorage.getItem(KEY_BM) ?? "[]");
  const next = current.includes(postId)
    ? current.filter((id) => id !== postId)
    : [...current, postId];
  localStorage.setItem(KEY_BM, JSON.stringify(next));
  return next;
}

export function getBookmarkedPosts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("campusflow-uni-community-bookmarks") ?? "[]");
  } catch {
    return [];
  }
}
