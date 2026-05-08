const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

function parseRoutine() {
  const filePath = path.join(__dirname, '../public/swe-routine-spring-2026-c2a0150ffc.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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
  const routine = [];

  // Start from row 5 (index 5) where days and data start
  for (let i = 5; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || "").trim();

    // Check if it's a day row
    if (days.includes(firstCell)) {
      currentDay = firstCell;
      continue;
    }

    // Skip empty or header-like rows
    if (firstCell === "Class" || firstCell === "Room" || !firstCell) continue;

    const room = firstCell;

    // Time slots start from column index 1
    // Each time slot takes 2 columns (Course, Teacher)
    for (let t = 0; t < times.length; t++) {
      const courseIndex = 1 + (t * 2);
      const teacherIndex = 2 + (t * 2);

      const courseStr = String(row[courseIndex] || "").trim();
      const teacher = String(row[teacherIndex] || "").trim();

      if (courseStr && courseStr !== "null" && courseStr !== "MSC") {
        // Parse course string: e.g., SE216-43-E
        const parts = courseStr.split('-');
        const courseCode = parts[0];
        const batch = parts[1];
        const section = parts[2];

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

  return routine;
}

const routineData = parseRoutine();
fs.writeFileSync(
  path.join(__dirname, '../lib/routine-data.json'), 
  JSON.stringify(routineData, null, 2)
);

console.log(`Successfully parsed ${routineData.length} routine entries.`);
