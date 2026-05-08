import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve service account JSON path: prefer env var, else check a few common repo locations.
const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const candidatePaths = [
  envPath,
  path.join(__dirname, "../firebase-service-account.json"),
  path.join(__dirname, "../firebase-adminsdk.json"),
  path.join(__dirname, "../serviceAccountKey.json"),
].filter(Boolean) as string[];

let serviceAccountPath: string | undefined;
for (const p of candidatePaths) {
  try {
    if (p && fs.existsSync(p)) {
      serviceAccountPath = p;
      break;
    }
  } catch (e) {
    // ignore
  }
}

if (!serviceAccountPath) {
  console.error(
    "Error: Firebase service account JSON not found. Set FIREBASE_SERVICE_ACCOUNT_KEY or place the file at one of: ./firebase-service-account.json, ./firebase-adminsdk.json, ./serviceAccountKey.json"
  );
  process.exit(1);
}

console.log(`Using Firebase service account file: ${serviceAccountPath}`);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

interface TeacherData {
  initial?: string;
  name: string;
  designation?: string;
  emp_id?: string | null;
  email?: string | null;
  phone?: string | null;
  room?: string | null;
  dep?: string;
}

interface CurriculumCourse {
  code: string;
  title: string;
  category: string;
  prerequisite: string[] | null;
  theory_credit: number | null;
  lab_credit: number | null;
}

interface CurriculumSemester {
  semester: string;
  year_session: string;
  semester_credit: number;
  courses: CurriculumCourse[];
}

interface Curriculum {
  program: string;
  curriculum_type: string;
  department: string;
  semesters: CurriculumSemester[];
}

function normalize(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

async function seedTeachers() {
  try {
    console.log("🌱 Starting teacher seeding...");

    const teacherFilePath = path.join(__dirname, "../app/data/teacher.json");
    const teacherData: TeacherData[] = JSON.parse(fs.readFileSync(teacherFilePath, "utf-8"));

    const existingTeachers = await db.collection("teachers").get();
    const existingTeacherKeys = new Set(
      existingTeachers.docs.map((doc) => {
        const data = doc.data() as TeacherData;
        return `${normalize(data.name)}|${normalize(data.email)}`;
      })
    );

    const batch = db.batch();
    let addedCount = 0;
    let skippedCount = 0;

    for (const teacher of teacherData) {
      try {
        if (!teacher.name) {
          console.warn("⚠️ Skipping teacher with missing name");
          skippedCount++;
          continue;
        }

        const teacherKey = `${normalize(teacher.name)}|${normalize(teacher.email)}`;
        if (existingTeacherKeys.has(teacherKey)) {
          console.log(`⏭️  Teacher already exists: ${teacher.name}`);
          skippedCount++;
          continue;
        }

        const teacherRef = db.collection("teachers").doc();
        batch.set(teacherRef, {
          name: teacher.name,
          designation: teacher.designation || "Faculty",
          initial: teacher.initial || "",
          emp_id: teacher.emp_id || null,
          email: teacher.email || null,
          phone: teacher.phone || null,
          room: teacher.room || null,
          department: teacher.dep || "SWE",
          approved: true,
          courses: [],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        existingTeacherKeys.add(teacherKey);
        addedCount++;
        console.log(`✅ Added teacher: ${teacher.name}`);
      } catch (error) {
        console.error(`❌ Error processing teacher ${teacher.name}:`, error);
      }
    }

    await batch.commit();
    console.log(`\n✨ Teacher seeding completed: ${addedCount} added, ${skippedCount} skipped`);
  } catch (error) {
    console.error("❌ Error seeding teachers:", error);
    throw error;
  }
}

async function seedCourses() {
  try {
    console.log("\n🌱 Starting course seeding...");

    const curriculumPath = path.join(__dirname, "../app/data/curriculum.json");

    if (!fs.existsSync(curriculumPath)) {
      console.log("⚠️  curriculum.json not found, skipping course seeding");
      return;
    }

    const curriculum: Curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf-8"));
    const teachersSnapshot = await db.collection("teachers").get();

    if (teachersSnapshot.empty) {
      console.log("⚠️  No teachers found, skipping course seeding");
      return;
    }

    const teachers = teachersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as TeacherData),
    }));

    const existingCourses = await db.collection("courses").get();
    const existingCourseCodes = new Set(
      existingCourses.docs.map((doc) => {
        const data = doc.data() as { courseCode?: string };
        return normalize(data.courseCode);
      })
    );

    const allCourses: Array<CurriculumCourse & { semester: string }> = [];
    for (const semester of curriculum.semesters) {
      for (const course of semester.courses) {
        allCourses.push({
          ...course,
          semester: semester.semester,
        });
      }
    }

    const batch = db.batch();
    let addedCount = 0;
    let skippedCount = 0;
    let teacherIndex = 0;

    for (const course of allCourses) {
      try {
        if (!course.code || !course.title) {
          console.warn("⚠️ Skipping course with missing code or title");
          skippedCount++;
          continue;
        }

        if (existingCourseCodes.has(normalize(course.code))) {
          console.log(`⏭️  Course already exists: ${course.code}`);
          skippedCount++;
          continue;
        }

        const assignedTeacher = teachers[teacherIndex % teachers.length];
        teacherIndex++;

        const courseRef = db.collection("courses").doc();
        batch.set(courseRef, {
          courseCode: course.code,
          courseTitle: course.title,
          category: course.category,
          department: "SWE",
          teacherId: assignedTeacher.id,
          teacherName: assignedTeacher.name,
          semester: course.semester,
          prerequisite: course.prerequisite,
          theory_credit: course.theory_credit,
          lab_credit: course.lab_credit,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        existingCourseCodes.add(normalize(course.code));
        addedCount++;
        console.log(`✅ Added course: ${course.code} (${course.title}) → ${assignedTeacher.name}`);
      } catch (error) {
        console.error(`❌ Error processing course ${course.code}:`, error);
      }
    }

    await batch.commit();
    console.log(`\n✨ Course seeding completed: ${addedCount} added, ${skippedCount} skipped`);
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    throw error;
  }
}

async function seedAll() {
  try {
    console.log("🚀 Starting Firebase seeding...\n");
    await seedTeachers();
    await seedCourses();
    console.log("\n✨ All seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAll();
