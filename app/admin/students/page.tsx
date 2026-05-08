"use client";

import { useEffect, useState, useMemo } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { getAllStudents, promoteUserToAdmin, getAllDepartments } from "@/lib/firestore-service";
import type { UserDoc, DepartmentDoc } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Shield, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function StudentsPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [departments, setDepartments] = useState<DepartmentDoc[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sRes, dRes] = await Promise.all([getAllStudents(), getAllDepartments()]);
        // Sort by createdAt desc in memory
        const sortedStudents = [...sRes].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setStudents(sortedStudents);
        setDepartments(dRes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Filtered & Paginated Results
  const filtered = useMemo(() => {
    let r = students;
    
    if (filterDept) {
      r = r.filter(s => s.department === filterDept);
    }
    
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      r = r.filter(s_obj => 
        s_obj.name.toLowerCase().includes(s) || 
        s_obj.email.toLowerCase().includes(s) ||
        (s_obj as any).studentId?.toLowerCase().includes(s)
      );
    }
    
    return r;
  }, [students, filterDept, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterDept, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePromoteToAdmin = async (uid: string) => {
    if (!confirm("Promote this user to Super Admin? This cannot be easily undone.")) return;

    try {
      await promoteUserToAdmin(uid);
      setStudents(prev => prev.map(s => s.uid === uid ? { ...s, role: "super-admin" } : s));
      toast.success("User promoted to Super Admin");
    } catch {
      toast.error("Failed to promote user");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total {students.length} registered student{students.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-500 leading-none">Active Students</p>
              <p className="text-lg font-bold text-blue-700 leading-tight">{filtered.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="p-4 border-0 shadow-sm bg-white rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          {/* Dept Filter */}
          <select 
            value={filterDept} 
            onChange={(e) => setFilterDept(e.target.value)} 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-[11px]">Student Details</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-[11px] hidden sm:table-cell">Dept & Batch</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-[11px] hidden lg:table-cell">Joined</th>
                <th className="px-6 py-4 text-right font-bold text-gray-700 uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-gray-200" />
                      <p className="text-lg font-medium text-gray-400">No students found matching your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((student) => (
                  <tr key={student.uid} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[200px]">{student.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{student.email}</p>
                          {(student as any).studentId && (
                            <p className="text-[10px] font-mono text-blue-500 mt-0.5">ID: {(student as any).studentId}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                          {student.department || "N/A"}
                        </span>
                        {(student as any).batch && (
                          <p className="text-xs text-gray-500">Batch {(student as any).batch}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.role !== 'super-admin' && (
                        <button
                          onClick={() => handlePromoteToAdmin(student.uid)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Shield className="w-3 h-3" />
                          Make Admin
                        </button>
                      )}
                      {student.role === 'super-admin' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="hidden sm:inline">Show:</span>
            <select 
              value={pageSize} 
              onChange={e => setPageSize(Number(e.target.value))} 
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/10"
            >
              {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-gray-400 font-medium">
              {(page - 1) * pageSize + 1} – {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent transition-all group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;

                return (
                  <button 
                    key={p} 
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      p === page 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent transition-all group"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
