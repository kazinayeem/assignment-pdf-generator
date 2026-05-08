"use client";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { addCourse } from "@/lib/firestore-service";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const SWE_COURSES = [
  { courseCode: "SE 111", courseTitle: "Computer Fundamentals", courseCredit: 3 },
  { courseCode: "SE 112", courseTitle: "Computer Fundamentals Lab", courseCredit: 1 },
  { courseCode: "SE 113", courseTitle: "Introduction to Software Engineering", courseCredit: 3 },
  { courseCode: "SE 121", courseTitle: "Structured Programming", courseCredit: 3 },
  { courseCode: "SE 122", courseTitle: "Structured Programming Lab", courseCredit: 1 },
  { courseCode: "SE 212", courseTitle: "Software Requirement Specifications & Analysis", courseCredit: 3 },
  { courseCode: "SE 213", courseTitle: "Digital Electronics & Logic Design", courseCredit: 3 },
  { courseCode: "SE 131", courseTitle: "Data Structure", courseCredit: 3 },
  { courseCode: "SE 132", courseTitle: "Data Structure Lab", courseCredit: 1 },
  { courseCode: "SE 133", courseTitle: "Software Development Capstone Project", courseCredit: 3 },
  { courseCode: "SE 223", courseTitle: "Database System", courseCredit: 3 },
  { courseCode: "SE 224", courseTitle: "Database System Lab", courseCredit: 1 },
  { courseCode: "SE 222", courseTitle: "Computer Architecture", courseCredit: 3 },
  { courseCode: "SE 214", courseTitle: "Algorithms Design & Analysis", courseCredit: 3 },
  { courseCode: "SE 215", courseTitle: "Algorithms Design & Analysis Lab", courseCredit: 1 },
  { courseCode: "SE 216", courseTitle: "Object Oriented Programming", courseCredit: 3 },
  { courseCode: "SE 217", courseTitle: "Object Oriented Programming Lab", courseCredit: 1 },
  { courseCode: "SE 411", courseTitle: "Software Project Management & Documentation", courseCredit: 3 },
  { courseCode: "SE 235", courseTitle: "Desktop and Web Programming", courseCredit: 3 },
  { courseCode: "SE 236", courseTitle: "Desktop and Web Programming Lab", courseCredit: 1 },
  { courseCode: "SE 231", courseTitle: "System Analysis & Design Capstone Project", courseCredit: 3 },
  { courseCode: "SE 232", courseTitle: "Operating System & System Programming", courseCredit: 3 },
  { courseCode: "SE 233", courseTitle: "Operating System & System Programming Lab", courseCredit: 1 },
  { courseCode: "SE 225", courseTitle: "Data Communication & Computer Networking", courseCredit: 3 },
  { courseCode: "SE 226", courseTitle: "Data Communication & Computer Networking Lab", courseCredit: 1 },
  { courseCode: "SE 234", courseTitle: "Theory of Computing", courseCredit: 3 },
  { courseCode: "SE 311", courseTitle: "Design Pattern", courseCredit: 3 },
  { courseCode: "SE 312", courseTitle: "Software Quality Assurance & Testing", courseCredit: 3 },
  { courseCode: "SE 313", courseTitle: "Software Quality Assurance & Testing Lab", courseCredit: 1 },
  { courseCode: "SE 441", courseTitle: "Software Engineering Professional Ethics", courseCredit: 3 },
  { courseCode: "SE 321", courseTitle: "Software Engineering Web Application", courseCredit: 3 },
  { courseCode: "SE 322", courseTitle: "Software Engineering Web Application Lab", courseCredit: 1 },
  { courseCode: "SE 323", courseTitle: "Software Architecture & Design", courseCredit: 3 },
  { courseCode: "SE 332", courseTitle: "Information System Security", courseCredit: 3 },
  { courseCode: "SE 532", courseTitle: "Introduction to Robotics (Guided Elective-I)", courseCredit: 3 },
  { courseCode: "SE 331", courseTitle: "Software Engineering Design Capstone Project", courseCredit: 3 },
  { courseCode: "SE 333", courseTitle: "Artificial Intelligence", courseCredit: 3 },
  { courseCode: "SE 334", courseTitle: "Artificial Intelligence Lab", courseCredit: 1 },
  { courseCode: "SE 544", courseTitle: "Introduction to Machine Learning (Guided Elective-II)", courseCredit: 3 },
  { courseCode: "SE 442", courseTitle: "Management Information System (Guided Elective-III)", courseCredit: 3 },
  { courseCode: "SE 431", courseTitle: "Final Year Project / Thesis / Internship", courseCredit: 6 },
  { courseCode: "SE 535", courseTitle: "Mobile Application Development (Open Elective-1)", courseCredit: 3 },
  { courseCode: "SE 599", courseTitle: "Research Methodology & Scientific Writing (Open Elective-3)", courseCredit: 3 },
  { courseCode: "SE 341", courseTitle: "Numerical Analysis (Guided Elective-V)", courseCredit: 3 },
  { courseCode: "SE 447", courseTitle: "Human Computer Interaction (Open Elective-2)", courseCredit: 3 },
];

export default function SeedCoursesPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const total = SWE_COURSES.length;

  const handleSeed = async () => {
    if (!confirm(`This will add ${total} SWE courses to Firestore. Continue?`)) return;
    setSeeding(true);
    setProgress(0);
    let count = 0;
    for (const c of SWE_COURSES) {
      try {
        await addCourse({ ...c, department: "SWE" });
        count++;
        setProgress(count);
      } catch {
        // skip on error
      }
    }
    setSeeding(false);
    setDone(true);
    toast.success(`Seeded ${count} of ${total} SWE courses!`);
  };

  if (loading) return null;

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-2">
        {done
          ? <CheckCircle className="w-8 h-8 text-green-500" />
          : <Loader2 className={`w-8 h-8 text-green-600 ${seeding ? "animate-spin" : ""}`} />}
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Seed SWE Courses</h1>
      <p className="text-gray-500 text-sm">
        Inserts all <strong>{total}</strong> SWE department courses into Firebase under department <code>SWE</code>.
      </p>

      {seeding && (
        <>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-200"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{progress} / {total} seeded…</p>
        </>
      )}

      {done && <p className="text-green-600 font-semibold">✅ Done! All {total} courses seeded.</p>}

      {!done && (
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-60 transition"
        >
          {seeding
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Seeding…</>
            : "🚀 Seed All SWE Courses"}
        </button>
      )}
    </div>
  );
}
