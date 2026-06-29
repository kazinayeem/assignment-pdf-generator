import { Metadata } from "next";
import { PolicyPageContent } from "@/components/static-page/policy-content";

export const metadata: Metadata = {
  title: "Security Policy",
  description: "Secure data handling at BornoFlow. Encryption and secure cloud infrastructure by BornoSoft.",
};

export default function SecurityPolicyPage() {
  return <PolicyPageContent policy="security" />;
}
