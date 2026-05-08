import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";

export function useProtectedRoute(requiredRole?: UserRole) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("🔍 [USE-PROTECTED-ROUTE]", pathname, "- State:", { loading, isAuthenticated, userRole: user?.role });
    
    if (!loading) {
      if (!isAuthenticated) {
        console.log("❌ [USE-PROTECTED-ROUTE] Not authenticated, redirecting to /login");
        router.push("/login");
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        console.log("⚠️ [USE-PROTECTED-ROUTE] Role mismatch. Required:", requiredRole, "Actual:", user?.role);
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
        console.log("⚠️ [USE-PROTECTED-ROUTE] Student profile incomplete, redirecting to /student/profile");
        router.push("/student/profile");
        return;
      }
      
      console.log("✅ [USE-PROTECTED-ROUTE] Access granted");
    }
  }, [loading, isAuthenticated, user, requiredRole, router, pathname]);

  return { user, loading };
}
