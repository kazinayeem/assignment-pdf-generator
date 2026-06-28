import { Metadata } from "next";
import { PolicyPageContent } from "@/components/static-page/policy-content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Transparent cookie usage at CampusFlow. Essential cookies for a secure academic experience.",
};

export default function CookiePolicyPage() {
  return <PolicyPageContent policy="cookie" />;
}
