import { Metadata } from "next";
import { ChangelogPage } from "@/components/changelog/changelog-page";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "BornoFlow release notes — stay up to date with the latest features, improvements, bug fixes, security patches, and product releases from Bornosoft.",
  openGraph: {
    title: "BornoFlow Changelog",
    description: "Professional release management center for BornoFlow by Bornosoft.",
  },
};

export default function Page() {
  return <ChangelogPage />;
}
