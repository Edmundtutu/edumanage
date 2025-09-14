import { BulkStudentData, BulkUploadResult, User, School, Course, Material, Class, Enrollment } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; school: School | null; token: string }> {
    const response = await this.request<{ user: User; school: School | null; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async loginWithUsername(username: string, password: string): Promise<{ user: User; school: School | null; token: string }> {
    const response = await this.request<{ user: User; school: School | null; token: string }>('/auth/login-username', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.removeToken();
  }

  async getCurrentUser(): Promise<{ user: User; school: School | null }> {
    return this.request('/auth/user');
  }

  // Schools
  async getSchools(): Promise<{ data: School[] }> {
    return this.request('/schools');
  }

  async getSchool(id: number): Promise<School> {
    return this.request(`/schools/${id}`);
  }

  // Classes
  async getSchoolClasses(schoolId: number): Promise<Class[]> {
    return this.request(`/schools/${schoolId}/classes`);
  }

  // Courses
  async getSchoolCourses(schoolId: number): Promise<Course[]> {
    return this.request(`/schools/${schoolId}/courses`);
  }

  async getCourse(id: number): Promise<Course> {
    return this.request(`/courses/${id}`);
  }

  async toggleCourseSelfEnrollment(courseId: number, enabled: boolean): Promise<Course> {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify({ self_enrollment: enabled }),
    });
  }

  // Users
  async getUsers(params?: { role?: string; school_id?: number; status?: string }): Promise<{ data: User[] }> {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append('role', params.role);
    if (params?.school_id) searchParams.append('school_id', params.school_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  // Student Admission
  async admitStudent(schoolId: number, studentData: {
    name: string;
    email: string;
    username: string;
    class_name: string;
    password?: string;
  }): Promise<{ message: string; student: User; password: string }> {
    return this.request(`/schools/${schoolId}/admit`, {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async bulkAdmitStudents(schoolId: number, students: BulkStudentData[]): Promise<BulkUploadResult> {
    return this.request(`/schools/${schoolId}/admit/bulk`, {
      method: 'POST',
      body: JSON.stringify({ students }),
    });
  }

  async bulkAdmitFromFile(schoolId: number, file: File): Promise<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/admit/bulk-file`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Enrollments
  async enrollStudentInCourse(studentId: number, courseId: number): Promise<{ message: string; enrollment: Enrollment }> {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, course_id: courseId }),
    });
  }

  async unenrollStudentFromCourse(enrollmentId: number): Promise<{ message: string }> {
    return this.request(`/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });
  }

  async studentSelfEnroll(courseId: number): Promise<{ message: string; enrollment: Enrollment }> {
    return this.request('/enrollments/self-enroll', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  }

  async getEnrollments(params?: { course_id?: number; student_id?: number; status?: string }): Promise<{ data: Enrollment[] }> {
    const searchParams = new URLSearchParams();
    if (params?.course_id) searchParams.append('course_id', params.course_id.toString());
    if (params?.student_id) searchParams.append('student_id', params.student_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/enrollments${query ? `?${query}` : ''}`);
  }

  // Materials
  async getCourseMaterials(courseId: number): Promise<Material[]> {
    return this.request(`/courses/${courseId}/materials`);
  }

  async getMaterials(): Promise<{ data: Material[] }> {
    return this.request('/materials');
  }

  async uploadMaterial(courseId: number, formData: FormData): Promise<{ message: string; material: Material }> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async downloadMaterial(materialId: number): Promise<Blob> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/materials/${materialId}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: HTTP ${response.status}`);
    }

    return response.blob();
  }

  async deleteMaterial(materialId: number): Promise<{ message: string }> {
    return this.request(`/materials/${materialId}`, {
      method: 'DELETE',
    });
  }

  // Additional utility methods
  async updateUser(userId: number, userData: Partial<User>): Promise<{ message: string; user: User }> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async createCourse(courseData: Partial<Course>): Promise<{ message: string; course: Course }> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId: number, courseData: Partial<Course>): Promise<{ message: string; course: Course }> {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId: number): Promise<{ message: string }> {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  async createClass(classData: Partial<Class>): Promise<{ message: string; class: Class }> {
    return this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateClass(classId: number, classData: Partial<Class>): Promise<{ message: string; class: Class }> {
    return this.request(`/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(classId: number): Promise<{ message: string }> {
    return this.request(`/classes/${classId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;