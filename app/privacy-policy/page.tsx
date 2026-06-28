import { Metadata } from "next";
import { PolicyPageContent } from "@/components/static-page/policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Your privacy matters at CampusFlow. Learn how BornoSoft protects student data and academic records.",
};

export default function PrivacyPolicyPage() {
  return <PolicyPageContent policy="privacy" />;
}
