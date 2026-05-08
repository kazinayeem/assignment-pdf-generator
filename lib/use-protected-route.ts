import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";

export function useProtectedRoute(requiredRole?: UserRole) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "super-admin") {
          router.push("/admin");
        } else {
          router.push("/student/mycourses");
        }
        return;
      }

      // Enforce profile completion for students
      if (user?.role === "student" && !(user as any).studentId && pathname !== "/student/profile") {
        router.push("/student/profile");
        return;
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, router, pathname]);

  return { user, loading };
}
