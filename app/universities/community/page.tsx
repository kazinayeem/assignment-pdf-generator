import type { Metadata } from "next";
import { UniversityCommunityClient } from "@/components/universities/university-community-client";

export const metadata: Metadata = {
  title: "Student Community | University Hub",
  description: "Ask questions, share experiences, and connect with students about Bangladesh universities.",
};

export default function CommunityPage() {
  return <UniversityCommunityClient />;
}
