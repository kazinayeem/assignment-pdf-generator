"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Subject,
  Room,
  RoutineSlot,
  Day,
  TimeSlot,
  RoutineBuilderState,
} from "./routine-builder-types";
import { DEFAULT_ROOMS } from "./routine-builder-types";

const uid = () => Math.random().toString(36).slice(2, 9);

interface ConflictInfo {
  type: "room" | "teacher";
  message: string;
}

interface RoutineBuilderStore extends RoutineBuilderState {
  // Subjects
  addSubject: (s: Omit<Subject, "id">) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  // Rooms
  addRoom: (r: Omit<Room, "id">) => void;
  removeRoom: (id: string) => void;
  // Slots
  placeSlot: (day: Day, timeSlot: TimeSlot, subjectId: string, section: string) => { ok: boolean; conflict?: ConflictInfo };
  removeSlot: (id: string) => void;
  moveSlot: (slotId: string, newDay: Day, newTimeSlot: TimeSlot) => { ok: boolean; conflict?: ConflictInfo };
  clearSlot: (day: Day, timeSlot: TimeSlot, section: string) => void;
  // Meta
  setSemester: (s: string) => void;
  setDepartment: (d: string) => void;
  resetAll: () => void;
  // Helpers
  getSlot: (day: Day, timeSlot: TimeSlot, section: string) => RoutineSlot | undefined;
  detectConflict: (day: Day, timeSlot: TimeSlot, subjectId: string, section: string, excludeSlotId?: string) => ConflictInfo | null;
  autoAssignRoom: (day: Day, timeSlot: TimeSlot, subjectType: "theory" | "lab") => string;
}

const DEFAULT_STATE: RoutineBuilderState = {
  subjects: [],
  rooms: DEFAULT_ROOMS,
  slots: [],
  semester: "Spring 2026",
  department: "SWE",
};

export const useRoutineBuilderStore = create<RoutineBuilderStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      addSubject: (s) =>
        set((st) => ({ subjects: [...st.subjects, { ...s, id: uid() }] })),

      updateSubject: (id, data) =>
        set((st) => ({
          subjects: st.subjects.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),

      removeSubject: (id) =>
        set((st) => ({
          subjects: st.subjects.filter((s) => s.id !== id),
          slots: st.slots.filter((sl) => sl.subjectId !== id),
        })),

      addRoom: (r) =>
        set((st) => ({ rooms: [...st.rooms, { ...r, id: uid() }] })),

      removeRoom: (id) =>
        set((st) => ({ rooms: st.rooms.filter((r) => r.id !== id) })),

      detectConflict: (day, timeSlot, subjectId, section, excludeSlotId) => {
        const { slots, subjects } = get();
        const subject = subjects.find((s) => s.id === subjectId);
        if (!subject) return null;

        const existing = slots.filter(
          (sl) =>
            sl.day === day &&
            sl.timeSlot === timeSlot &&
            sl.id !== excludeSlotId
        );

        // Same section conflict
        const sectionConflict = existing.find((sl) => sl.section === section);
        if (sectionConflict) {
          return { type: "teacher", message: `Section ${section} already has a class at this time.` };
        }

        // Same teacher conflict
        const teacherConflict = existing.find((sl) => {
          const s = subjects.find((sub) => sub.id === sl.subjectId);
          return s?.teacher && s.teacher === subject.teacher;
        });
        if (teacherConflict) {
          return { type: "teacher", message: `${subject.teacher} is already teaching at this time.` };
        }

        return null;
      },

      autoAssignRoom: (day, timeSlot, subjectType) => {
        const { rooms, slots } = get();
        const occupiedRoomIds = slots
          .filter((sl) => sl.day === day && sl.timeSlot === timeSlot)
          .map((sl) => sl.roomId);

        const preferred = rooms.filter(
          (r) =>
            !occupiedRoomIds.includes(r.id) &&
            (subjectType === "lab" ? r.type === "lab" : r.type === "classroom")
        );

        if (preferred.length > 0) return preferred[0].id;

        // Fallback: any free room
        const anyFree = rooms.find((r) => !occupiedRoomIds.includes(r.id));
        return anyFree?.id || rooms[0]?.id || "";
      },

      placeSlot: (day, timeSlot, subjectId, section) => {
        const conflict = get().detectConflict(day, timeSlot, subjectId, section);
        if (conflict) return { ok: false, conflict };

        const subject = get().subjects.find((s) => s.id === subjectId);
        const roomId = get().autoAssignRoom(day, timeSlot, subject?.type || "theory");

        set((st) => ({
          slots: [
            ...st.slots,
            { id: uid(), day, timeSlot, subjectId, roomId, section },
          ],
        }));
        return { ok: true };
      },

      removeSlot: (id) =>
        set((st) => ({ slots: st.slots.filter((sl) => sl.id !== id) })),

      moveSlot: (slotId, newDay, newTimeSlot) => {
        const slot = get().slots.find((sl) => sl.id === slotId);
        if (!slot) return { ok: false };

        const conflict = get().detectConflict(
          newDay,
          newTimeSlot,
          slot.subjectId,
          slot.section,
          slotId
        );
        if (conflict) return { ok: false, conflict };

        const subject = get().subjects.find((s) => s.id === slot.subjectId);
        const roomId = get().autoAssignRoom(newDay, newTimeSlot, subject?.type || "theory");

        set((st) => ({
          slots: st.slots.map((sl) =>
            sl.id === slotId
              ? { ...sl, day: newDay, timeSlot: newTimeSlot, roomId }
              : sl
          ),
        }));
        return { ok: true };
      },

      clearSlot: (day, timeSlot, section) =>
        set((st) => ({
          slots: st.slots.filter(
            (sl) => !(sl.day === day && sl.timeSlot === timeSlot && sl.section === section)
          ),
        })),

      getSlot: (day, timeSlot, section) =>
        get().slots.find(
          (sl) => sl.day === day && sl.timeSlot === timeSlot && sl.section === section
        ),

      setSemester: (s) => set({ semester: s }),
      setDepartment: (d) => set({ department: d }),
      resetAll: () => set({ ...DEFAULT_STATE, rooms: DEFAULT_ROOMS }),
    }),
    { name: "covergen-routine-builder" }
  )
);
