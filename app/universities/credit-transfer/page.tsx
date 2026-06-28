import type { Metadata } from "next";
import { UniversityCreditTransferClient } from "@/components/universities/university-credit-transfer-client";

export const metadata: Metadata = {
  title: "Credit Transfer Checker | University Hub",
  description: "Check credit transfer eligibility between Bangladesh universities.",
};

export default function CreditTransferPage() {
  return <UniversityCreditTransferClient />;
}
