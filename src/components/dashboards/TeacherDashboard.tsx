import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Book, Upload, FileText, Eye, Users, UserPlus, Settings, Loader2 } from 'lucide-react';
import { Course, Material, User } from '../../types';
import { apiService } from '../../services/api';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.current_school_id) return;
      
      try {
        setLoading(true);
        const [coursesResponse, materialsResponse, usersResponse] = await Promise.all([
          apiService.getSchoolCourses(user.current_school_id),
          apiService.getMaterials(),
          apiService.getUsers({ school_id: user.current_school_id })
        ]);
        
        setCourses(coursesResponse || []);
        setMaterials(materialsResponse.data || []);
        setUsers(usersResponse.data || []);
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

  const myCourses = courses.filter(course => course.teacher_id === user?.id);
  const myMaterials = materials.filter(material => material.uploaded_by === user?.id);
  
  // Get total enrolled students across all courses
  const totalEnrolledStudents = myCourses.reduce((total, course) => {
    const enrolledCount = users.filter(u => 
      u.role === 'student' && 
      u.class_ids?.some(classId => course.class_ids?.includes(classId))
    ).length;
    return total + enrolledCount;
  }, 0);

  return (
    <div className="container-enhanced py-8 fade-in">
      <div className="mb-8">
        <h1 className="heading-primary">{user?.name}</h1>
        <p className="text-muted-enhanced mt-2">Teacher Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">My Courses</p>
              <p className="stats-card-value">{myCourses.length}</p>
            </div>
            <div className="stats-card-icon">
              <Book className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Total Students</p>
              <p className="stats-card-value">{totalEnrolledStudents}</p>
            </div>
            <div className="stats-card-icon bg-green-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Materials Uploaded</p>
              <p className="stats-card-value">{myMaterials.length}</p>
            </div>
            <div className="stats-card-icon bg-purple-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Total Views</p>
              <p className="stats-card-value">247</p>
            </div>
            <div className="stats-card-icon bg-orange-600">
              <Eye className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="dashboard-card slide-up">
          <div className="dashboard-card-header">
            <h3 className="heading-secondary">Course Management</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-3">
              <Link
                to="/materials/upload"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">Upload New Material</span>
              </Link>
              <Link
                to="/courses"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Book className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">View All Courses</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="dashboard-card-header">
            <h3 className="heading-secondary">Student Enrollment</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-3">
              {myCourses.slice(0, 2).map((course) => {
                const enrolledCount = users.filter(u => 
                  u.role === 'student' && 
                  u.class_ids?.some(classId => course.class_ids?.includes(classId))
                ).length;
                
                return (
                  <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-500">{enrolledCount} students</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/courses/${course.id}/enroll`}
                        className="text-primary hover:text-primary-700 text-sm"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/courses/${course.id}/settings`}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        <Settings className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
              
              {myCourses.length > 2 && (
                <Link
                  to="/courses"
                  className="block text-center text-primary hover:text-primary-700 text-sm font-medium"
                >
                  View all courses →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="dashboard-card slide-up">
        <div className="dashboard-card-header">
          <h2 className="heading-secondary">My Courses</h2>
        </div>
        <div className="dashboard-card-body">
          <div className="grid-responsive">
            {myCourses.map((course) => {
              const enrolledCount = users.filter(u => 
                u.role === 'student' && 
                u.class_ids?.some(classId => course.class_ids?.includes(classId))
              ).length;
              
              return (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-muted-enhanced mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">
                      {enrolledCount} students • {materials.filter(m => m.course_id === course.id).length} materials
                    </span>
                    <span className="text-xs text-gray-500">Created {course.created_at}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-primary-enhanced hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <div className="flex space-x-2">
                      <Link
                        to={`/courses/${course.id}/enroll`}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-primary bg-primary-100 hover:bg-primary-200"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Enroll
                      </Link>
                      <Link
                        to={`/courses/${course.id}/settings`}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {myCourses.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned</h3>
              <p className="text-muted-enhanced">
                You haven't been assigned any courses yet. Contact your school administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;