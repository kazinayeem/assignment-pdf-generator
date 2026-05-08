"use client";

import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { getStats } from "@/lib/firestore-service";
import { Card } from "@/components/ui/card";
import { Loader2, Users, BookOpen, User, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Stats {
  totalTeachers: number;
  approvedTeachers: number;
  totalStudents: number;
  totalCourses: number;
}

export default function AdminDashboard() {
  const { loading } = useProtectedRoute("super-admin");
  const [stats, setStats] = useState<Stats>({
    totalTeachers: 0,
    approvedTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await getStats();
        setStats(result);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  if (loading || loadingStats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: User,
      color: "blue",
      link: "/admin/teachers",
    },
    {
      title: "Approved Teachers",
      value: stats.approvedTeachers,
      icon: GraduationCap,
      color: "green",
      link: "/admin/teachers",
    },
    {
      title: "Students",
      value: stats.totalStudents,
      icon: Users,
      color: "purple",
      link: "/admin/students",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "orange",
      link: "/admin/courses",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-red-100">
          Manage teachers, courses, and students. Approve new teachers and maintain database.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item) => {
          const Icon = item.icon;
          const bgColor = colorClasses[item.color as keyof typeof colorClasses];

          return (
            <Link key={item.title} href={item.link}>
              <Card className={`p-6 cursor-pointer hover:shadow-lg transition ${bgColor} border`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {item.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                  <Icon className="w-8 h-8 opacity-20" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/teachers">
            <Button className="w-full" variant="outline">
              Manage Teachers
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button className="w-full" variant="outline">
              Manage Courses
            </Button>
          </Link>
          <Link href="/admin/students">
            <Button className="w-full" variant="outline">
              View Students
            </Button>
          </Link>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">Getting Started</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Import teachers from JSON using the seed command</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Review and approve new teacher submissions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Manage courses and departments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>Monitor student registrations and activities</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
