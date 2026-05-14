"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

// Pages that have their own built-in footer — don't render the global one
const PAGES_WITH_OWN_FOOTER = ["/cv-builder", "/routine-builder"];

export default function AppFooter() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/student") ||
    PAGES_WITH_OWN_FOOTER.includes(pathname || "")
  ) {
    return null;
  }

  return <Footer />;
}
