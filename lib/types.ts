// User roles
export type UserRole = "student" | "super-admin";

// User document structure
export interface UserDoc {
  uid: string;
  name: string;
  email: string;
  studentId?: string;
  role: UserRole;
  department?: string;
  section?: string;
  subSection?: string;
  batch?: string;
  semester?: string;
  createdAt: string;
  photoURL?: string;
}

// Teacher document structure
export interface TeacherDoc {
  id?: string;
  name: string;
  initial?: string;
  designation: string;
  department: string;
  email?: string;
  phone?: string;
  room?: string;
  dep?: string;
  approved: boolean;
  courses?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Course document structure
export interface CourseDoc {
  id?: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  teacherId?: string;
  teacherName?: string;
  teacherDesignation?: string;
  courseCredit?: number;
  semester?: string;
  category?: string;
  createdAt?: string;
}

// Auth context type
export interface AuthContextType {
  user: UserDoc | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isStudent: boolean;
}

// Department document structure
export interface DepartmentDoc {
  id?: string;
  code: string;
  name: string;
  createdAt?: string;
}
