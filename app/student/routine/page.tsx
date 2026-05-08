"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search, 
  BookOpen,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { useProtectedRoute } from "@/lib/use-protected-route";

interface RoutineEntry {
  day: string;
  room: string;
  time: string;
  courseCode: string;
  batch: string;
  section: string;
  teacher: string;
  fullCourse: string;
}

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentRoutinePage() {
  useProtectedRoute();
  const { user } = useAuthStore();
  
  const [routineData, setRoutineData] = useState<RoutineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sectionFilter, setSectionFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  // Fetch routine from API on load
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/routine");
        if (!res.ok) throw new Error("Failed to fetch routine data");
        const data = await res.json();
        setRoutineData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, []);

  // Sync with user profile once loaded
  useEffect(() => {
    if (user) {
      setSectionFilter(user.section || "B");
      setBatchFilter(user.batch || "");
    }
  }, [user]);

  const filteredRoutine = useMemo(() => {
    return routineData.filter(entry => {
      const studentSec = sectionFilter?.toUpperCase() || "";
      const entrySec = entry.section?.toUpperCase() || "";
      
      const matchSection = !studentSec || 
        entrySec === studentSec || 
        (studentSec.length > 1 && entrySec === studentSec.charAt(0));

      const matchBatch = !batchFilter || entry.batch?.includes(batchFilter);
      return matchSection && matchBatch;
    });
  }, [routineData, sectionFilter, batchFilter]);

  const groupedRoutine = useMemo(() => {
    const grouped: Record<string, RoutineEntry[]> = {};
    filteredRoutine.forEach(entry => {
      if (!grouped[entry.day]) grouped[entry.day] = [];
      grouped[entry.day].push(entry);
    });
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.time.localeCompare(b.time));
    });
    return grouped;
  }, [filteredRoutine]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading Live Routine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
           <Calendar className="w-10 h-10 text-red-500" />
        </div>
        <div className="text-center space-y-2">
           <h3 className="text-xl font-black text-gray-900">Unable to load routine</h3>
           <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="relative p-10 rounded-[3rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  Spring 2026 Live Routine
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Class Schedule</h1>
               <p className="text-gray-500 font-medium max-w-xl">
                  Automatically synced with the latest SWE routine. Filtered for your profile.
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Batch</label>
                  <Input 
                    placeholder="e.g. 43" 
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="w-32 h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Section</label>
                  <Input 
                    placeholder="e.g. B" 
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="w-32 h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                  />
               </div>
            </div>
         </div>
      </div>

      {/* Routine Grid */}
      <div className="grid grid-cols-1 gap-12">
        {DAYS.map(day => {
          const dayClasses = groupedRoutine[day] || [];
          if (dayClasses.length === 0 && (sectionFilter || batchFilter)) return null;

          return (
            <section key={day} className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight">{day}</h2>
                 <div className="flex-1 h-px bg-gray-100"></div>
                 <span className="text-xs font-black text-gray-300 uppercase tracking-widest">
                    {dayClasses.length} Classes
                 </span>
              </div>

              {dayClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayClasses.map((entry, idx) => (
                    <Card key={idx} className="group p-6 rounded-[2.5rem] border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 bg-white">
                       <div className="flex items-start justify-between mb-6">
                          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                             <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                             Batch {entry.batch} • Sec {entry.section}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                             {entry.courseCode}
                          </h3>
                          
                          <div className="space-y-3">
                             <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{entry.time}</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>Room {entry.room}</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm font-bold text-blue-600/80">
                                <User className="w-4 h-4" />
                                <span>{entry.teacher || "TBA"}</span>
                             </div>
                          </div>
                       </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                   <p className="text-gray-400 font-bold italic">No classes scheduled for this day.</p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {filteredRoutine.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-200" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">No results found</h3>
              <p className="text-gray-400 text-sm font-medium">Try adjusting your section or batch filter.</p>
           </div>
        </div>
      )}
    </div>
  );
}
