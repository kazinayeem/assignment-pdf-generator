import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mobile Development" };

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
