"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { LogOut, User, BookOpen, LogIn, Menu, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
      setMobileMenuOpen(false);
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
            <Image src="/logo_navbar.png" alt="CoverGen V2" width={100} height={24} style={{ height: 24, width: "auto" }} />
            <span className="hidden sm:inline text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CoverGen V2</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && user?.role === "student" && (
              <>
                <Link
                  href="/student/mycourses"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Courses</span>
                </Link>
                <Link
                  href="/student/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === "super-admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
              >
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900" title={user?.name}>
                      {user?.name && user.name.length > 7 ? user.name.substring(0, 7) + "..." : user?.name}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/tools" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Learning Tools
                </Link>
                <Link href="/login">
                  <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-sm">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {isAuthenticated && user?.role === "student" && (
              <>
                <Link
                  href="/student/mycourses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  My Courses
                </Link>
                <Link
                  href="/student/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Profile
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === "super-admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Admin Panel
              </Link>
            )}

            {isAuthenticated ? (
              <div className="space-y-3 px-3 py-2 border-t">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900" title={user?.name}>
                      {user?.name && user.name.length > 7 ? user.name.substring(0, 7) + "..." : user?.name}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Link href="/student/mycourses" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2 px-3 py-2 border-t">
                <Link href="/tools" onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">
                  Learning Tools
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
