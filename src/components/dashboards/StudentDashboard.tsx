import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Book, FileText, Clock, GraduationCap, UserPlus, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Course, Material, Class } from '../../types';
import { apiService } from '../../services/api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.current_school_id) return;
      
      try {
        setLoading(true);
        const [coursesResponse, materialsResponse, classesResponse] = await Promise.all([
          apiService.getSchoolCourses(user.current_school_id),
          apiService.getMaterials(),
          apiService.getSchoolClasses(user.current_school_id)
        ]);
        
        setCourses(coursesResponse || []);
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

  // Students only see courses they're enrolled in (through their classes)
  const enrolledCourses = courses.filter(course => 
    course.school_id === user?.current_school_id &&
    course.class_ids?.some(classId => user?.class_ids?.includes(classId))
  );
  
  // Get available courses for self-enrollment
  const availableCourses = courses.filter(course => 
    course.school_id === user?.current_school_id &&
    course.self_enrollment === true &&
    !user?.enrolled_courses?.includes(course.id) &&
    course.class_ids?.some(classId => user?.class_ids?.includes(classId))
  );
  
  const availableMaterials = materials.filter(material => 
    enrolledCourses.some(course => course.id === material.course_id)
  );

  // Get student's classes
  const studentClasses = classes.filter(cls => 
    user?.class_ids?.includes(cls.id)
  );

  return (
    <div className="container-enhanced py-8 fade-in">
      <div className="mb-8">
        <h1 className="heading-primary">{user?.name}</h1>
        {studentClasses.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Classes: {studentClasses.map(cls => cls.name).join(', ')}
          </p>
        )}
      </div>

      {/* Enrollment Alert */}
      {availableCourses.length > 0 && (
        <div className="mb-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-primary-800">New Courses Available!</h3>
                <p className="text-primary-700">
                  {availableCourses.length} course{availableCourses.length > 1 ? 's' : ''} available for enrollment
                </p>
              </div>
            </div>
            <Link
              to="/student/enrollments"
              className="btn-primary-enhanced"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Enroll Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid-stats mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">My Courses</p>
              <p className="stats-card-value">{enrolledCourses.length}</p>
            </div>
            <div className="stats-card-icon">
              <Book className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Available Courses</p>
              <p className="stats-card-value">{availableCourses.length}</p>
            </div>
            <div className="stats-card-icon bg-green-600">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Study Materials</p>
              <p className="stats-card-value">{availableMaterials.length}</p>
            </div>
            <div className="stats-card-icon bg-purple-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-card-label">Study Hours</p>
              <p className="stats-card-value">42</p>
            </div>
            <div className="stats-card-icon bg-orange-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="dashboard-card slide-up">
          <div className="dashboard-card-header">
            <h3 className="heading-secondary">Course Enrollment</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-3">
              <Link
                to="/student/enrollments"
                className="flex items-center px-4 py-3 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors bg-primary-25"
              >
                <UserPlus className="h-5 w-5 text-primary mr-3" />
                <div>
                  <span className="text-primary font-medium">Manage Enrollments</span>
                  {availableCourses.length > 0 && (
                    <p className="text-sm text-primary-600">{availableCourses.length} new courses available</p>
                  )}
                </div>
              </Link>
              <Link
                to="/courses"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Book className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">My Courses</span>
              </Link>
              <Link
                to="/materials"
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">Study Materials</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="dashboard-card-header">
            <h3 className="heading-secondary">Recent Activity</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Enrolled in Mathematics</span>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Downloaded study material</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Completed assignment</span>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="dashboard-card slide-up">
        <div className="dashboard-card-header">
          <div className="flex items-center justify-between">
            <h2 className="heading-secondary">My Courses</h2>
            <Link
              to="/student/enrollments"
              className="text-primary hover:text-primary-700 text-sm font-medium"
            >
              Manage Enrollments →
            </Link>
          </div>
        </div>
        <div className="dashboard-card-body">
          <div className="grid-responsive">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{course.name}</h3>
                <p className="text-muted-enhanced mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {materials.filter(m => m.course_id === course.id).length} materials
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-primary-enhanced hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </Link>
                    <Link
                      to={`/courses/${course.id}/materials`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Materials
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {enrolledCourses.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
              <p className="text-muted-enhanced mb-4">
                You are not enrolled in any courses yet. Browse available courses to get started.
              </p>
              <Link
                to="/student/enrollments"
                className="btn-primary-enhanced"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;