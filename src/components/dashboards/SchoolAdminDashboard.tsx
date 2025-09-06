import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Book, Users, FileText, Plus, GraduationCap, UserCheck, UserPlus, Loader2 } from 'lucide-react';
import { Course, User, Material, Class } from '../../types';
import { apiService } from '../../services/api';

const SchoolAdminDashboard: React.FC = () => {
  const { user, school } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.current_school_id) return;
      
      try {
        setLoading(true);
        const [coursesResponse, usersResponse, materialsResponse, classesResponse] = await Promise.all([
          apiService.getSchoolCourses(user.current_school_id),
          apiService.getUsers({ school_id: user.current_school_id }),
          apiService.getMaterials(),
          apiService.getSchoolClasses(user.current_school_id)
        ]);
        
        setCourses(coursesResponse || []);
        setUsers(usersResponse.data || []);
        setMaterials(materialsResponse.data || []);
        setClasses(classesResponse || []);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.current_school_id]);

  if (loading) {
    return (
      <div className="container-enhanced py-8 fade-in">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-enhanced" />
          <span className="ml-2 text-muted-enhanced">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-enhanced py-8 fade-in">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const schoolCourses = courses;
  const schoolUsers = users;
  const schoolClasses = classes;
  const schoolMaterials = materials.filter(material => 
    schoolCourses.some(course => course.id === material.course_id)
  );

  const teachers = schoolUsers.filter(u => u.role === 'teacher');
  const students = schoolUsers.filter(u => u.role === 'student');

  return (
    <div className="container-enhanced py-8 fade-in">
      <div className="mb-8">
        <h1 className="heading-primary">{school?.name}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Courses</p>
              <p className="stats-card-value">{schoolCourses.length}</p>
            </div>
            <div className="stats-card-icon">
              <Book className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Teachers</p>
              <p className="stats-card-value">{teachers.length}</p>
            </div>
            <div className="stats-card-icon bg-green-600">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Students</p>
              <p className="stats-card-value">{students.length}</p>
            </div>
            <div className="stats-card-icon bg-purple-600">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Classes</p>
              <p className="stats-card-value">{schoolClasses.length}</p>
            </div>
            <div className="stats-card-icon bg-indigo-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Materials</p>
              <p className="stats-card-value">{schoolMaterials.length}</p>
            </div>
            <div className="stats-card-icon bg-orange-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="dashboard-card slide-up">
          <div className="dashboard-card-header">
            <h3 className="heading-secondary">Student Management</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-3">
              <Link
                to="/admin/admit-student"
                className="flex items-center px-4 py-3 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors bg-primary-25"
              >
                <UserPlus className="h-5 w-5 text-primary mr-3" />
                <div>
                  <span className="text-primary font-medium">Admit New Student</span>
                  <p className="text-sm text-primary-600">Add individual students</p>
                </div>
              </Link>
              <Link
                to="/admin/bulk-admit"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-gray-700">Bulk Admit Students</span>
                  <p className="text-sm text-gray-500">Upload CSV/JSON file</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="dashboard-card-header">
            <h3 className="heading-secondary">Staff Management</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-3">
              <Link
                to="/admin/create-user"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-gray-700">Add New Staff</span>
                  <p className="text-sm text-gray-500">Add teachers and staff</p>
                </div>
              </Link>
              <Link
                to="/admin/manage-users"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-gray-700">Manage All Users</span>
                  <p className="text-sm text-gray-500">View and edit users</p>
                </div>
              </Link>
              <Link
                to="/courses"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Book className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-gray-700">Manage Courses</span>
                  <p className="text-sm text-gray-500">View course enrollments</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card slide-up mb-8">
        <div className="dashboard-card-header">
          <h3 className="heading-secondary">Recent Activity</h3>
        </div>
        <div className="dashboard-card-body">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">New student admitted: John Doe</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Teacher added: Mary Smith</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Course material uploaded</span>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="dashboard-card slide-up">
        <div className="dashboard-card-header">
          <h2 className="heading-secondary">Recent Courses</h2>
        </div>
        <div className="dashboard-card-body p-0">
          <div className="divide-y divide-gray-200">
            {schoolCourses.slice(0, 5).map((course) => {
              const enrolledStudents = users.filter(u => 
                u.role === 'student' && 
                u.class_ids?.some(classId => course.class_ids?.includes(classId))
              ).length;
              
              return (
                <div key={course.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                      <p className="text-muted-enhanced">{course.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Students: {enrolledStudents}</span>
                        <span>Materials: {materials.filter(m => m.course_id === course.id).length}</span>
                        <span>Classes: {course.class_ids?.length || 0}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-enhanced">Created</p>
                      <p className="text-sm font-medium text-gray-900">{course.created_at}</p>
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-primary-enhanced hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;