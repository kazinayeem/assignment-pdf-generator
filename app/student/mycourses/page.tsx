"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useProtectedRoute } from "@/lib/use-protected-route";
import {
  getAllTeachers,
  addStudentMyCourse,
  getAllCourses,
  getStudentMyCourses,
  updateStudentMyCourse,
  deleteStudentMyCourse,
} from "@/lib/firestore-service";
import type { CourseDoc, TeacherDoc } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  BookOpen,
  User2,
  X,
  Trash2,
  FileText,
  Edit2,
  Zap,
  ChevronRight,
  Search,
  Filter,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type EnhancedCourse = CourseDoc & {
  teacher?: TeacherDoc;
  isPersonal?: boolean;
  personalId?: string;
};

export default function MyCoursesPage() {
  const { loading } = useProtectedRoute("student");
  const { user: authUser } = useAuthStore();

  const [myCourses, setMyCourses] = useState<EnhancedCourse[]>([]);
  const [allDeptCourses, setAllDeptCourses] = useState<CourseDoc[]>([]);
  const [allTeachers, setAllTeachers] = useState<TeacherDoc[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [manualTeacherName, setManualTeacherName] = useState("");
  const [manualTeacherDesig, setManualTeacherDesig] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authUser?.uid) return;
    loadData();
  }, [authUser?.uid, authUser?.department]);

  const loadData = async () => {
    if (!authUser?.uid || !authUser?.department) return;
    setLoadingData(true);
    try {
      const [teachers, dbCourses, saved] = await Promise.all([
        getAllTeachers(),
        getAllCourses(),
        getStudentMyCourses(authUser.uid),
      ]);

      const deptTeachers = teachers.filter(
        (t) => t.approved && t.department === authUser.department
      );
      setAllTeachers(deptTeachers);

      const deptCourses = dbCourses.filter(
        (c) => c.department === authUser.department
      );
      setAllDeptCourses(deptCourses);

      const enhanced: EnhancedCourse[] = saved.map((c) => {
        const teacher = c.teacherId
          ? teachers.find((t) => t.id === c.teacherId)
          : undefined;
        return { ...c, teacher, isPersonal: true, personalId: c.id };
      });
      enhanced.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
      setMyCourses(enhanced);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoadingData(false);
    }
  };

  const filteredCourses = myCourses.filter(c => 
    c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetModal = () => {
    setEditingId(undefined);
    setSelectedCourseId("");
    setSelectedTeacherId("");
    setManualTeacherName("");
    setManualTeacherDesig("");
  };

  const openAddModal = () => {
    resetModal();
    setShowModal(true);
  };

  const openEditModal = (course: EnhancedCourse) => {
    resetModal();
    setEditingId(course.personalId || course.id);
    const match = allDeptCourses.find(c => c.courseCode === course.courseCode);
    setSelectedCourseId(match?.id || "__manual__");
    setSelectedTeacherId(course.teacherId || "");
    setManualTeacherName(course.teacherName || "");
    setManualTeacherDesig(course.teacherDesignation || "");
    setShowModal(true);
  };

  const selectedCourse = selectedCourseId && selectedCourseId !== "__manual__"
    ? allDeptCourses.find(c => c.id === selectedCourseId)
    : undefined;

  const selectedTeacher = selectedTeacherId
    ? allTeachers.find(t => t.id === selectedTeacherId)
    : undefined;

  const handleSave = async () => {
    if (!authUser?.uid || !authUser?.department) return;
    const courseData = selectedCourse;
    if (!courseData && selectedCourseId !== "__manual__") {
      toast.error("Please select a course");
      return;
    }
    const payload: Omit<CourseDoc, "id"> = {
      courseCode: courseData?.courseCode || "",
      courseTitle: courseData?.courseTitle || "",
      department: authUser.department,
      courseCredit: courseData?.courseCredit,
      teacherId: selectedTeacher?.id,
      teacherName: selectedTeacher?.name || manualTeacherName || undefined,
      teacherDesignation: selectedTeacher?.designation || manualTeacherDesig || undefined,
    };
    try {
      setSubmitting(true);
      if (editingId) {
        await updateStudentMyCourse(authUser.uid, editingId, payload);
        toast.success("Course updated");
      } else {
        await addStudentMyCourse(authUser.uid, payload);
        toast.success("Course added");
      }
      await loadData();
      setShowModal(false);
      resetModal();
    } catch {
      toast.error("Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!authUser?.uid) return;
    if (!confirm("Remove this course from your list?")) return;
    try {
      await deleteStudentMyCourse(authUser.uid, id);
      setMyCourses(prev => prev.filter(c => c.personalId !== id && c.id !== id));
      toast.success("Course removed");
    } catch {
      toast.error("Failed to remove course");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-400 font-medium text-sm animate-pulse">Loading your academic space...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 overflow-hidden shadow-xl">
         <div className="relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-1">Academic Dashboard</h1>
                <p className="text-blue-200/70 text-sm leading-relaxed">
                   Manage courses for <span className="text-white font-bold">{authUser?.department}</span>.
                </p>
              </div>
              <Button onClick={openAddModal} className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 group">
                 <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                 <span>Enroll New Course</span>
              </Button>
           </div>
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            />
         </div>
         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredCourses.length} Courses Enrolled</p>
      </div>

      {/* Grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
           <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-gray-300" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
           <p className="text-gray-400 text-center max-w-xs mb-8">
             {searchQuery ? "Try adjusting your search query." : "Start by adding your first course to this semester."}
           </p>
           {!searchQuery && (
             <Button onClick={openAddModal} className="bg-blue-600 text-white rounded-xl px-8 font-bold">Add First Course</Button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {filteredCourses.map((course) => (
             <Card key={course.personalId} className="group relative bg-white rounded-2xl border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col p-4">
                {/* Header: Code & Actions */}
                <div className="flex items-center justify-between mb-3">
                   <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">
                      {course.courseCode}
                   </span>
                   <div className="flex items-center gap-0.5">
                      <button onClick={() => openEditModal(course)} className="p-1 text-gray-300 hover:text-blue-600 transition-colors">
                         <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(course.personalId!)} className="p-1 text-gray-300 hover:text-red-600 transition-colors">
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>

                <h3 className="text-[14px] font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors" title={course.courseTitle}>
                   {course.courseTitle}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                   <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-gray-400">
                      <User2 className="w-3.5 h-3.5" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-700 truncate">{course.teacher?.name || course.teacherName || "No Instructor"}</p>
                   </div>
                </div>

                {/* Actions Grid - Very Compact */}
                <div className="mt-auto grid grid-cols-3 gap-1 pt-3 border-t border-gray-50">
                   <Link href={`/student/assignment?courseCode=${encodeURIComponent(course.courseCode)}&courseTitle=${encodeURIComponent(course.courseTitle)}&teacherName=${encodeURIComponent(course.teacher?.name || course.teacherName || "")}&teacherDesignation=${encodeURIComponent(course.teacher?.designation || course.teacherDesignation || "")}`} className="flex flex-col items-center justify-center py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group/btn" title="Assignment">
                      <FileText className="w-3.5 h-3.5 mb-1 opacity-50 group-hover/btn:opacity-100" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Asgn</span>
                   </Link>
                   <Link href={`/student/lab-report?courseCode=${encodeURIComponent(course.courseCode)}&courseTitle=${encodeURIComponent(course.courseTitle)}&teacherName=${encodeURIComponent(course.teacher?.name || course.teacherName || "")}&teacherDesignation=${encodeURIComponent(course.teacher?.designation || course.teacherDesignation || "")}`} className="flex flex-col items-center justify-center py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all group/btn" title="Lab Report">
                      <BookOpen className="w-3.5 h-3.5 mb-1 opacity-50 group-hover/btn:opacity-100" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Lab</span>
                   </Link>
                   <Link href={`/student/lab-performance?courseCode=${encodeURIComponent(course.courseCode)}&courseTitle=${encodeURIComponent(course.courseTitle)}&teacherName=${encodeURIComponent(course.teacher?.name || course.teacherName || "")}&teacherDesignation=${encodeURIComponent(course.teacher?.designation || course.teacherDesignation || "")}`} className="flex flex-col items-center justify-center py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all group/btn" title="Performance">
                      <Zap className="w-3.5 h-3.5 mb-1 opacity-50 group-hover/btn:opacity-100" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Perf</span>
                   </Link>
                </div>
             </Card>
           ))}
        </div>
      )}

      {/* Modal Overhaul */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{editingId ? "Update Course" : "New Enrollment"}</h2>
                <p className="text-sm text-gray-400 font-medium">Define your academic course details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Select Course</label>
                 <select 
                   value={selectedCourseId}
                   onChange={(e) => setSelectedCourseId(e.target.value)}
                   className="w-full h-12 px-4 bg-gray-50 border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                 >
                   <option value="">-- Choose from {authUser?.department} --</option>
                   {allDeptCourses.map(c => <option key={c.id} value={c.id}>{c.courseCode} : {c.courseTitle}</option>)}
                 </select>
               </div>

               {selectedCourseId && (
                 <>
                   <div className="h-px bg-gray-100" />
                   <div>
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Teacher Selection</label>
                     <select 
                       value={selectedTeacherId}
                       onChange={(e) => setSelectedTeacherId(e.target.value)}
                       className="w-full h-12 px-4 bg-gray-50 border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                     >
                       <option value="">-- Choose Instructor --</option>
                       {allTeachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>)}
                       <option value="__manual__">-- Add Manually --</option>
                     </select>
                   </div>

                   {(selectedTeacherId === "__manual__" || (!selectedTeacherId && !editingId)) && (
                     <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Manual Teacher Entry</div>
                        <Input placeholder="Full Name" value={manualTeacherName} onChange={(e) => setManualTeacherName(e.target.value)} className="h-11 rounded-xl bg-white" />
                        <Input placeholder="Designation" value={manualTeacherDesig} onChange={(e) => setManualTeacherDesig(e.target.value)} className="h-11 rounded-xl bg-white" />
                     </div>
                   )}
                 </>
               )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 mt-4 border-t border-gray-50">
              <Button variant="ghost" className="h-12 px-8 rounded-xl font-bold" onClick={() => setShowModal(false)}>Discard</Button>
              <Button disabled={submitting || !selectedCourseId} className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100" onClick={handleSave}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Data" : "Enroll Course"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
