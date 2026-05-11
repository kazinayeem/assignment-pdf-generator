"use client";

import Image from "next/image";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  BookOpen, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  FileText,
  FlaskConical,
  Zap,
  Info,
  ShieldCheck,
  Calendar,
  Moon,
  Sun,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "My Courses", href: "/student/mycourses", icon: BookOpen },
    { name: "Assignment Gen", href: "/student/assignment", icon: FileText },
    { name: "Lab Report Gen", href: "/student/lab-report", icon: FlaskConical },
    { name: "Lab Performance", href: "/student/lab-performance", icon: Zap },
    { name: "My Profile", href: "/student/profile", icon: UserCircle },
    { name: "Class Routine", href: "/student/routine", icon: Calendar },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
           <Image src="/logo_navbar.png" alt="CampusFlow" width={200} height={40} style={{ height: 30, width: "auto" }} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10 px-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo_navbar.png"
                alt="CampusFlow"
                width={140}
                height={36}
                style={{ height: 36, width: "auto" }}
              />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto pr-2">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 px-3">Main Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-[13px] transition-all group
                  ${isActive(item.href) 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 px-2">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black border border-white shadow-md shadow-blue-100 shrink-0">
                 {user?.name?.[0] || "S"}
               </div>
               <div className="min-w-0">
                 <p className="text-[13px] font-black text-gray-900 dark:text-white truncate leading-tight">{user?.name || "Student"}</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.department || "DIU Student"}</p>
               </div>
            </div>

          {/* Secondary Nav */}
          <div className="pt-2">
            <div className="flex gap-2">
               <Link href="/about" className="flex-1 flex items-center justify-center p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-all group" title="About">
                 <Info className="w-4 h-4" />
               </Link>
               <Link href="/privacy-policy" className="flex-1 flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-all group" title="Privacy">
                 <ShieldCheck className="w-5 h-5" />
               </Link>
               <button
                 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                 className="flex-1 flex items-center justify-center p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-all"
                 title="Toggle theme"
               >
                 <Sun className="w-4 h-4 hidden dark:block" />
                 <Moon className="w-4 h-4 block dark:hidden" />
               </button>
            </div>
          </div>

          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-500 font-bold text-[13px] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto pt-20 lg:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
