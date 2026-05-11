import { Metadata } from "next";
import RoutineBuilderClient from "./routine-builder-client";

export const metadata: Metadata = {
  title: "Routine Builder | CoverGen",
  description: "Drag-and-drop class routine builder for university timetable management.",
};

export default function RoutineBuilderPage() {
  return <RoutineBuilderClient />;
}
