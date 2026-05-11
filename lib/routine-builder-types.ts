// ── Routine Builder Types ─────────────────────────────────────────────────────

export const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const;
export const TIME_SLOTS = [
  "08:30–10:00",
  "10:00–11:30",
  "11:30–01:00",
  "01:00–02:30",
  "02:30–04:00",
  "04:00–05:30",
] as const;

export type Day = typeof DAYS[number];
export type TimeSlot = typeof TIME_SLOTS[number];

export const SUBJECT_COLORS = [
  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", dot: "#3B82F6" },
  { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#22C55E" },
  { bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C", dot: "#F97316" },
  { bg: "#FDF4FF", border: "#E9D5FF", text: "#7E22CE", dot: "#A855F7" },
  { bg: "#FFF1F2", border: "#FECDD3", text: "#BE123C", dot: "#F43F5E" },
  { bg: "#F0FDFA", border: "#99F6E4", text: "#0F766E", dot: "#14B8A6" },
  { bg: "#FEFCE8", border: "#FEF08A", text: "#A16207", dot: "#EAB308" },
  { bg: "#F8FAFC", border: "#CBD5E1", text: "#334155", dot: "#64748B" },
] as const;

export interface Subject {
  id: string;
  code: string;
  title: string;
  teacher: string;
  colorIndex: number;
  credits: number;
  type: "theory" | "lab";
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: "classroom" | "lab" | "seminar";
}

export interface RoutineSlot {
  id: string;
  day: Day;
  timeSlot: TimeSlot;
  subjectId: string;
  roomId: string;
  section: string;
}

export interface RoutineBuilderState {
  subjects: Subject[];
  rooms: Room[];
  slots: RoutineSlot[];
  semester: string;
  department: string;
}

export const DEFAULT_ROOMS: Room[] = [
  { id: "r1", name: "Room 301", capacity: 40, type: "classroom" },
  { id: "r2", name: "Room 302", capacity: 40, type: "classroom" },
  { id: "r3", name: "Room 401", capacity: 60, type: "classroom" },
  { id: "r4", name: "Lab 201", capacity: 30, type: "lab" },
  { id: "r5", name: "Lab 202", capacity: 30, type: "lab" },
  { id: "r6", name: "Seminar Hall", capacity: 100, type: "seminar" },
];
