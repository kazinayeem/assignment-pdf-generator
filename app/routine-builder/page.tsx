import { Metadata } from "next";
import RoutineBuilderClient from "./routine-builder-client";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Routine Builder | ${BRAND.platform}`,
  description: "Drag-and-drop class routine builder for university timetable management.",
};

export default function RoutineBuilderPage() {
  return <RoutineBuilderClient />;
}
