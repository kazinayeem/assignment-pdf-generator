"use client";

import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { addDepartment, deleteDepartment, getAllDepartments, updateDepartment } from "@/lib/firestore-service";
import type { DepartmentDoc } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Edit, X, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DepartmentsPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [departments, setDepartments] = useState<DepartmentDoc[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await getAllDepartments();
      setDepartments(result);
    } catch {
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleOpenModal = (dept?: DepartmentDoc) => {
    if (dept) {
      setEditingId(dept.id);
      setCode(dept.code);
      setName(dept.name);
    } else {
      setEditingId(undefined);
      setCode("");
      setName("");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Code and Name are required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateDepartment(editingId, { code: code.trim(), name: name.trim() });
        toast.success("Department updated");
      } else {
        await addDepartment({ code: code.trim(), name: name.trim() });
        toast.success("Department added");
      }
      setShowModal(false);
      loadDepartments();
    } catch {
      toast.error("Failed to save department");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      toast.success("Department deleted");
      loadDepartments();
    } catch {
      toast.error("Failed to delete department");
    }
  };

  if (loading || loadingDepts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage university departments</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50/50 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No departments found</p>
          <Button variant="outline" className="mt-4" onClick={() => handleOpenModal()}>Add your first department</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-5 flex justify-between items-center group hover:shadow-md transition">
              <div>
                <p className="text-xl font-bold text-gray-900">{dept.code}</p>
                <p className="text-sm text-gray-500 mt-1">{dept.name}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <Button size="icon" variant="ghost" onClick={() => handleOpenModal(dept)}>
                  <Edit className="w-4 h-4 text-gray-600" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(dept.id!)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">{editingId ? "Edit Department" : "Add Department"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Department Code</label>
                <Input placeholder="e.g. SWE" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input placeholder="e.g. Software Engineering" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl border-t">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
