import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "swe-routine-spring-2026-c2a0150ffc.xlsx");
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Routine file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    const times = [
      "08:30-10:00",
      "10:00-11:30",
      "11:30-01:00",
      "01:00-02:30",
      "02:30-04:00",
      "04:00-05:30"
    ];

    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let currentDay = "";
    const routine: any[] = [];

    // Start from row 5 (index 5)
    for (let i = 5; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const firstCell = String(row[0] || "").trim();

      if (days.includes(firstCell)) {
        currentDay = firstCell;
        continue;
      }

      if (firstCell === "Class" || firstCell === "Room" || !firstCell) continue;

      const room = firstCell;

      for (let t = 0; t < times.length; t++) {
        const courseIndex = 1 + (t * 2);
        const teacherIndex = 2 + (t * 2);

        const courseStr = String(row[courseIndex] || "").trim();
        const teacher = String(row[teacherIndex] || "").trim();

        if (courseStr && courseStr !== "null" && courseStr !== "MSC" && courseStr !== "undefined") {
          const parts = courseStr.split("-");
          const courseCode = parts[0];
          const batch = parts[1] || "";
          const section = parts[2] || "";

          routine.push({
            day: currentDay,
            room,
            time: times[t],
            courseCode,
            batch,
            section,
            teacher,
            fullCourse: courseStr
          });
        }
      }
    }

    return NextResponse.json(routine);
  } catch (error: any) {
    console.error("API Routine Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
