import { Metadata } from "next";
import { PolicyPageContent } from "@/components/static-page/policy-content";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "CampusFlow is free for students. Read our refund policy for details on our zero-cost academic tools.",
};

export default function RefundPolicyPage() {
  return <PolicyPageContent policy="refund" />;
}
