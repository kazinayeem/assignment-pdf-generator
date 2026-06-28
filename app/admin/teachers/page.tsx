"use client";

import { useEffect, useState, useMemo } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import {
  getAllTeachers, approveTeacher, deleteTeacher,
  addTeacher, getAllDepartments, updateTeacher,
} from "@/lib/firestore-service";
import type { TeacherDoc, DepartmentDoc } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, Trash2, Search, Plus, Edit, XCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const sel = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

export default function TeachersPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [teachers, setTeachers] = useState<TeacherDoc[]>([]);
  const [departments, setDepartments] = useState<DepartmentDoc[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [formName, setFormName] = useState("");
  const [formInitial, setFormInitial] = useState("");
  const [formDesignation, setFormDesignation] = useState("Lecturer");
  const [formDepartment, setFormDepartment] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRoom, setFormRoom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, dRes] = await Promise.all([getAllTeachers(), getAllDepartments()]);
        setTeachers(tRes);
        setDepartments(dRes);
        if (dRes.length > 0) setFormDepartment(dRes[0].code);
      } catch { toast.error("Failed to load data"); }
      finally { setLoadingData(false); }
    })();
  }, []);

  // Filtered + paginated
  const filtered = useMemo(() => {
    let r = teachers;
    if (filterStatus === "pending") r = r.filter(t => !t.approved);
    else if (filterStatus === "approved") r = r.filter(t => t.approved);
    if (filterDept) r = r.filter(t => t.department === filterDept);
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(t => t.name.toLowerCase().includes(s) || (t.email || "").toLowerCase().includes(s) || (t.designation || "").toLowerCase().includes(s));
    }
    return r;
  }, [teachers, filterStatus, filterDept, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterDept, filterStatus, pageSize]);

  const openAdd = (t?: TeacherDoc) => {
    if (t) {
      setEditingId(t.id); setFormName(t.name); setFormInitial(t.initial || "");
      setFormDesignation(t.designation || "Lecturer"); setFormDepartment(t.department);
      setFormEmail(t.email || ""); setFormPhone(t.phone || ""); setFormRoom(t.room || "");
    } else {
      setEditingId(undefined); setFormName(""); setFormInitial("");
      setFormDesignation("Lecturer"); setFormDepartment(departments[0]?.code || "");
      setFormEmail(""); setFormPhone(""); setFormRoom("");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) { toast.error("Name is required"); return; }
    try {
      setSubmitting(true);
      const payload = {
        name: formName, designation: formDesignation, initial: formInitial,
        department: formDepartment, email: formEmail || undefined,
        phone: formPhone || undefined, room: formRoom || undefined, approved: true,
      };
      if (editingId) {
        await updateTeacher(editingId, payload);
        setTeachers(ts => ts.map(t => t.id === editingId ? { ...t, ...payload } : t));
        toast.success("Teacher updated");
      } else {
        const newId = await addTeacher(payload as any);
        setTeachers(ts => [{ id: newId, ...payload }, ...ts]);
        toast.success("Teacher added");
      }
      setShowModal(false);
    } catch { toast.error("Failed to save teacher"); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveTeacher(id);
      setTeachers(ts => ts.map(t => t.id === id ? { ...t, approved: true } : t));
      toast.success("Teacher approved");
    } catch { toast.error("Failed to approve"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this teacher?")) return;
    try {
      await deleteTeacher(id);
      setTeachers(ts => ts.filter(t => t.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading || loadingData) return (
    <div className="flex items-center justify-center min-h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} teacher{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <Button onClick={() => openAdd()} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Teacher
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, designation…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Dept */}
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className={sel}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
          </select>
          {/* Status */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className={sel}>
            <option value="all">All ({teachers.length})</option>
            <option value="approved">Approved ({teachers.filter(t => t.approved).length})</option>
            <option value="pending">Pending ({teachers.filter(t => !t.approved).length})</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      {paginated.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No teachers match your filters.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Designation</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Dept</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((t, i) => (
                  <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * pageSize + i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 truncate max-w-[160px]">{t.name}</p>
                      <p className="text-xs text-gray-400 md:hidden">{t.designation}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[150px] truncate">{t.designation}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">{t.department}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell truncate max-w-[180px]">{t.email || "—"}</td>
                    <td className="px-4 py-3">
                      {t.approved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
                          <XCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {!t.approved && (
                          <button onClick={() => handleApprove(t.id!)} className="px-2 py-1 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition">✓</button>
                        )}
                        <button onClick={() => openAdd(t)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition text-gray-600">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(t.id!)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition text-gray-600">
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
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Teacher" : "Add Teacher"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Full Name *", val: formName, set: setFormName, placeholder: "Dr. John Doe" },
                { label: "Initial", val: formInitial, set: setFormInitial, placeholder: "e.g. JD" },
                { label: "Email", val: formEmail, set: setFormEmail, placeholder: "john@university.edu" },
                { label: "Phone", val: formPhone, set: setFormPhone, placeholder: "01XXXXXXXXX" },
                { label: "Room", val: formRoom, set: setFormRoom, placeholder: "e.g. 605" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                  <Input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Designation</label>
                <select value={formDesignation} onChange={e => setFormDesignation(e.target.value)} className={sel}>
                  {["Lecturer","Junior Lecturer","Senior Lecturer","Lecturer (Senior Scale)","Assistant Professor","Associate Professor","Professor","Professor & Head","Adjunct Faculty","Teaching Assistant"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Department</label>
                <select value={formDepartment} onChange={e => setFormDepartment(e.target.value)} className={sel}>
                  {departments.map(d => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
                  {departments.length === 0 && <option value="">No departments</option>}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update" : "Add Teacher"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
