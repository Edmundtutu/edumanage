export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student';
  school_ids?: number[];
  current_school_id?: number;
  class_ids?: number[];
  status?: 'active' | 'inactive';
  created_at?: string;
  enrolled_courses?: number[];
  enrolled_at?: Record<number, string>; // courseId -> enrollment date
}

export interface School {
  id: number;
  name: string;
  address: string;
  created_at: string;
  status?: 'active' | 'inactive';
  admin_id?: number;
}

export interface Class {
  id: number;
  name: string;
  school_id: number;
  grade_level: string;
  created_at: string;
  teacher_id?: number;
  capacity?: number;
  description?: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  school_id: number;
  teacher_id?: number;
  class_ids?: number[];
  created_at: string;
  status?: 'active' | 'inactive';
  credits?: number;
  self_enrollment?: boolean;
  enrolled_students?: number[];
  max_students?: number;
}

export interface Material {
  id: number;
  title: string;
  description: string;
  file_type: 'pdf' | 'video' | 'document';
  file_url: string;
  course_id: number;
  uploaded_by: number;
  created_at: string;
  file_size?: string;
  downloads?: number;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_by: number; // teacher or student who enrolled
  enrolled_at: string;
  status: 'active' | 'dropped' | 'completed';
}

export interface AuthContextType {
  user: User | null;
  school: School | null;
  login: (user: User, school?: School) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isTeacher: () => boolean;
  isSchoolAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isStudent: () => boolean;
  canEnrollStudents: () => boolean;
  canAdmitStudents: () => boolean;
}

export interface BulkStudentData {
  name: string;
  email: string;
  username: string;
  class_name: string;
  grade_level?: string;
}

export interface BulkUploadResult {
  success: BulkStudentData[];
  errors: Array<{
    row: number;
    data: BulkStudentData;
    error: string;
  }>;
}