import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase-config";
import type { UserDoc, TeacherDoc, CourseDoc, DepartmentDoc } from "./types";

// Lazy db accessor — only initializes Firebase when first called in browser
const db = () => getFirebaseDb();

// ============ USERS ============

export const getUserByEmail = async (email: string): Promise<UserDoc | null> => {
  try {
    const q = query(collection(db(), "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : (snapshot.docs[0].data() as UserDoc);
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const updateUserDepartment = async (
  uid: string,
  department: string
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "users", uid), { department });
  } catch (error) {
    console.error("Error updating user department:", error);
    throw error;
  }
};

export const promoteUserToAdmin = async (uid: string): Promise<void> => {
  try {
    await updateDoc(doc(db(), "users", uid), { role: "super-admin" });
  } catch (error) {
    console.error("Error promoting user:", error);
    throw error;
  }
};

export const getAllStudents = async (): Promise<UserDoc[]> => {
  try {
    const q = query(
      collection(db(), "users"),
      where("role", "==", "student")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap) => ({
      uid: snap.id,
      ...snap.data()
    } as UserDoc));
  } catch (error) {
    console.error("Error getting students:", error);
    return [];
  }
};

// ============ TEACHERS ============

export const getAllTeachers = async (): Promise<TeacherDoc[]> => {
  try {
    const q = query(
      collection(db(), "teachers"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap) => ({
      id: snap.id,
      ...snap.data(),
    } as TeacherDoc));
  } catch (error) {
    console.error("Error getting teachers:", error);
    return [];
  }
};

export const getApprovedTeachers = async (
  department?: string
): Promise<TeacherDoc[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where("approved", "==", true),
      ...(department ? [where("department", "==", department)] : []),
    ];

    const q = query(collection(db(), "teachers"), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap) => ({
      id: snap.id,
      ...snap.data(),
    } as TeacherDoc));
  } catch (error) {
    console.error("Error getting approved teachers:", error);
    return [];
  }
};

export const searchTeachers = async (
  searchTerm: string,
  department?: string
): Promise<TeacherDoc[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where("approved", "==", true),
      ...(department ? [where("department", "==", department)] : []),
    ];

    const q = query(collection(db(), "teachers"), ...constraints);
    const snapshot = await getDocs(q);

    const searchLower = searchTerm.toLowerCase();
    return snapshot.docs
      .map((snap) => ({
        id: snap.id,
        ...snap.data(),
      } as TeacherDoc))
      .filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchLower) ||
          teacher.initial?.toLowerCase().includes(searchLower)
      );
  } catch (error) {
    console.error("Error searching teachers:", error);
    return [];
  }
};

export const addTeacher = async (teacher: Omit<TeacherDoc, "id">): Promise<string> => {
  try {
    const docRef = doc(collection(db(), "teachers"));
    await setDoc(docRef, {
      ...teacher,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (
  id: string,
  updates: Partial<TeacherDoc>
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "teachers", id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

export const approveTeacher = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db(), "teachers", id), {
      approved: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error approving teacher:", error);
    throw error;
  }
};

export const deleteTeacher = async (id: string): Promise<void> => {
  try {
    // Delete teacher
    await deleteDoc(doc(db(), "teachers", id));

    // Delete associated courses
    const coursesQ = query(collection(db(), "courses"), where("teacherId", "==", id));
    const coursesSnapshot = await getDocs(coursesQ);
    
    const batch = writeBatch(db());
    coursesSnapshot.docs.forEach((snap) => {
      batch.delete(snap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};

// ============ COURSES ============

export const getCoursesByTeacher = async (teacherId: string): Promise<CourseDoc[]> => {
  try {
    const q = query(
      collection(db(), "courses"),
      where("teacherId", "==", teacherId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap) => ({
      id: snap.id,
      ...snap.data(),
    } as CourseDoc));
  } catch (error) {
    console.error("Error getting courses:", error);
    return [];
  }
};

export const addCourse = async (course: Omit<CourseDoc, "id">): Promise<string> => {
  try {
    const docRef = doc(collection(db(), "courses"));
    await setDoc(docRef, {
      ...course,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};


export const updateCourse = async (
  id: string,
  updates: Partial<CourseDoc>
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "courses", id), updates);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db(), "courses", id));
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

export const getAllCourses = async (): Promise<CourseDoc[]> => {
  try {
    const snapshot = await getDocs(collection(db(), "courses"));
    return snapshot.docs.map((snap) => ({
      id: snap.id,
      ...snap.data(),
    } as CourseDoc));
  } catch (error) {
    console.error("Error getting courses:", error);
    return [];
  }
};

export const addStudentMyCourse = async (
  uid: string,
  course: Omit<CourseDoc, "id">
): Promise<string> => {
  try {
    const docRef = doc(collection(db(), "users", uid, "myCourses"));
    await setDoc(docRef, {
      ...course,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding student my course:", error);
    throw error;
  }
};

export const updateStudentMyCourse = async (
  uid: string,
  courseId: string,
  updates: Partial<CourseDoc>
): Promise<void> => {
  try {
    const docRef = doc(db(), "users", uid, "myCourses", courseId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating student my course:", error);
    throw error;
  }
};

export const deleteStudentMyCourse = async (
  uid: string,
  courseId: string
): Promise<void> => {
  try {
    const docRef = doc(db(), "users", uid, "myCourses", courseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting student my course:", error);
    throw error;
  }
};

export const getStudentMyCourses = async (uid: string): Promise<CourseDoc[]> => {
  try {
    const snapshot = await getDocs(collection(db(), "users", uid, "myCourses"));
    return snapshot.docs.map((courseDoc) => ({
      id: courseDoc.id,
      ...courseDoc.data(),
    } as CourseDoc));
  } catch (error) {
    console.error("Error getting student my courses:", error);
    return [];
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<{ 
    name: string; 
    email: string; 
    studentId?: string;
    department?: string;
    section?: string;
    subSection?: string;
    batch?: string;
    semester?: string;
  }>
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "users", uid), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// ============ BATCH OPERATIONS ============

export const batchImportTeachers = async (
  teachers: Omit<TeacherDoc, "id">[]
): Promise<{ success: number; failed: number; errors: string[] }> => {
  try {
    const batch = writeBatch(db());
    const errors: string[] = [];
    let success = 0;

    for (const teacher of teachers) {
      try {
        // Check for duplicates
        const q = query(
          collection(db(), "teachers"),
          where("email", "==", teacher.email),
          where("name", "==", teacher.name)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          const docRef = doc(collection(db(), "teachers"));
          batch.set(docRef, {
            ...teacher,
            approved: teacher.approved ?? false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          success++;
        }
      } catch (error: any) {
        errors.push(`Error processing teacher ${teacher.name}: ${error.message}`);
      }
    }

    await batch.commit();
    return { success, failed: teachers.length - success, errors };
  } catch (error: any) {
    console.error("Error batch importing teachers:", error);
    throw error;
  }
};

export const batchImportCourses = async (
  courses: Omit<CourseDoc, "id">[]
): Promise<{ success: number; failed: number; errors: string[] }> => {
  try {
    const batch = writeBatch(db());
    const errors: string[] = [];
    let success = 0;

    for (const course of courses) {
      try {
        // Check for duplicates
        const q = query(
          collection(db(), "courses"),
          where("courseCode", "==", course.courseCode),
          where("teacherId", "==", course.teacherId)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          const docRef = doc(collection(db(), "courses"));
          batch.set(docRef, {
            ...course,
            createdAt: new Date().toISOString(),
          });
          success++;
        }
      } catch (error: any) {
        errors.push(`Error processing course ${course.courseCode}: ${error.message}`);
      }
    }

    await batch.commit();
    return { success, failed: courses.length - success, errors };
  } catch (error: any) {
    console.error("Error batch importing courses:", error);
    throw error;
  }
};

// ============ ADMIN UTILITIES ============

// Delete all documents in `teachers` collection in batched commits (chunks of 500)
export const deleteAllTeachers = async (): Promise<number> => {
  try {
    const snapshot = await getDocs(collection(db(), "teachers"));
    const docs = snapshot.docs;
    let deleted = 0;
    const chunkSize = 500;

    for (let i = 0; i < docs.length; i += chunkSize) {
      const batch = writeBatch(db());
      const chunk = docs.slice(i, i + chunkSize);
      chunk.forEach((docSnap) => batch.delete(doc(db(), "teachers", docSnap.id)));
      await batch.commit();
      deleted += chunk.length;
    }

    return deleted;
  } catch (error) {
    console.error("Error deleting all teachers:", error);
    throw error;
  }
};

export const deleteAllDepartments = async (): Promise<number> => {
  try {
    const snapshot = await getDocs(collection(db(), "departments"));
    const docs = snapshot.docs;
    let deleted = 0;
    const chunkSize = 500;

    for (let i = 0; i < docs.length; i += chunkSize) {
      const batch = writeBatch(db());
      const chunk = docs.slice(i, i + chunkSize);
      chunk.forEach((docSnap) => batch.delete(doc(db(), "departments", docSnap.id)));
      await batch.commit();
      deleted += chunk.length;
    }

    return deleted;
  } catch (error) {
    console.error("Error deleting all departments:", error);
    throw error;
  }
};

export const batchImportDepartments = async (
  departments: Omit<DepartmentDoc, "id">[]
): Promise<{ success: number; failed: number; errors: string[] }> => {
  try {
    const batch = writeBatch(db());
    const errors: string[] = [];
    let success = 0;

    for (const dept of departments) {
      try {
        // naive duplicate check by name
        const q = query(collection(db(), "departments"), where("name", "==", dept.name));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          const docRef = doc(collection(db(), "departments"));
          batch.set(docRef, {
            ...dept,
            createdAt: new Date().toISOString(),
          });
          success++;
        }
      } catch (error: any) {
        errors.push(`Error processing department ${dept.name}: ${error.message}`);
      }
    }

    await batch.commit();
    return { success, failed: departments.length - success, errors };
  } catch (error: any) {
    console.error("Error batch importing departments:", error);
    throw error;
  }
};

// ============ STATISTICS ============

export const getStats = async (): Promise<{
  totalTeachers: number;
  approvedTeachers: number;
  totalStudents: number;
  totalCourses: number;
}> => {
  try {
    const [teachersSnap, studentsSnap, coursesSnap] = await Promise.all([
      getDocs(collection(db(), "teachers")),
      getDocs(query(collection(db(), "users"), where("role", "==", "student"))),
      getDocs(collection(db(), "courses")),
    ]);

    const approvedTeachersSnap = await getDocs(
      query(collection(db(), "teachers"), where("approved", "==", true))
    );

    return {
      totalTeachers: teachersSnap.size,
      approvedTeachers: approvedTeachersSnap.size,
      totalStudents: studentsSnap.size,
      totalCourses: coursesSnap.size,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      totalTeachers: 0,
      approvedTeachers: 0,
      totalStudents: 0,
      totalCourses: 0,
    };
  }
};
// ============ DEPARTMENTS ============

export const addDepartment = async (dept: Omit<DepartmentDoc, "id">): Promise<string> => {
  try {
    const docRef = doc(collection(db(), "departments"));
    await setDoc(docRef, { ...dept, createdAt: new Date().toISOString() });
    return docRef.id;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const updateDepartment = async (id: string, updates: Partial<DepartmentDoc>): Promise<void> => {
  try {
    await updateDoc(doc(db(), "departments", id), updates);
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db(), "departments", id));
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

export const getAllDepartments = async (): Promise<DepartmentDoc[]> => {
  try {
    const snapshot = await getDocs(collection(db(), "departments"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DepartmentDoc));
  } catch (error) {
    console.error("Error getting departments:", error);
    return [];
  }
};
