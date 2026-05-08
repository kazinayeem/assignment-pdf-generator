"use client";

import { useEffect, useState, useMemo } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { addCourse, deleteCourse, getAllCourses, getAllDepartments, updateCourse } from "@/lib/firestore-service";
import type { CourseDoc, DepartmentDoc } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus, Trash2, X, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const sel = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

export default function CoursesPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [departments, setDepartments] = useState<DepartmentDoc[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCredit, setCourseCredit] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [cRes, dRes] = await Promise.all([getAllCourses(), getAllDepartments()]);
        setCourses(cRes);
        setDepartments(dRes);
        if (dRes.length > 0) setDepartment(dRes[0].code);
      } catch { toast.error("Failed to load data"); }
      finally { setLoadingCourses(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    let r = courses;
    if (filterDept) r = r.filter(c => c.department === filterDept);
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(c => c.courseCode.toLowerCase().includes(s) || c.courseTitle.toLowerCase().includes(s));
    }
    return r;
  }, [courses, filterDept, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [search, filterDept, pageSize]);

  const openModal = (course?: CourseDoc) => {
    if (course) {
      setEditingId(course.id); setDepartment(course.department);
      setCourseCode(course.courseCode); setCourseTitle(course.courseTitle);
      setCourseCredit(course.courseCredit ? String(course.courseCredit) : "");
    } else {
      setEditingId(undefined);
      setDepartment(departments[0]?.code || "");
      setCourseCode(""); setCourseTitle(""); setCourseCredit("");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!courseCode.trim() || !courseTitle.trim() || !department) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      setSubmitting(true);
      const payload = {
        courseCode: courseCode.trim(), courseTitle: courseTitle.trim(),
        department, courseCredit: courseCredit ? Number(courseCredit) : undefined,
      };
      if (editingId) {
        await updateCourse(editingId, payload);
        setCourses(cs => cs.map(c => c.id === editingId ? { ...c, ...payload } : c));
        toast.success("Course updated");
      } else {
        const newId = await addCourse(payload);
        setCourses(cs => [{ id: newId, ...payload }, ...cs]);
        toast.success("Course added");
      }
      setShowModal(false);
    } catch { toast.error("Failed to save course"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses(cs => cs.filter(c => c.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading || loadingCourses) return (
    <div className="flex items-center justify-center min-h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search code or title…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className={sel}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      {paginated.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No courses match your filters.</p>
          <Button className="mt-4" onClick={() => openModal()}>Add First Course</Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Dept</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Credit</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((course, i) => (
                  <tr key={course.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * pageSize + i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700">{course.courseCode}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate">{course.courseTitle}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-600">{course.department}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{course.courseCredit ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openModal(course)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition text-gray-600">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(course.id!)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition text-gray-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows:</span>
              <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
                {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-gray-400">· {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs hover:bg-gray-100 disabled:opacity-40 transition">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${p === page ? "bg-blue-600 text-white" : "border border-gray-200 hover:bg-gray-100 text-gray-700"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs hover:bg-gray-100 disabled:opacity-40 transition">»</button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Course" : "Add Course"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Department *</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className={sel}>
                  {departments.map(d => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
                  {departments.length === 0 && <option value="">No departments</option>}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Course Code *</label>
                <Input value={courseCode} onChange={e => setCourseCode(e.target.value)} placeholder="e.g. SE 232" className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Course Title *</label>
                <Input value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="e.g. Operating System" className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Credits</label>
                <Input type="number" value={courseCredit} onChange={e => setCourseCredit(e.target.value)} placeholder="e.g. 3" className="text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update" : "Add Course"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
