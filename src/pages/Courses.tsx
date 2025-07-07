import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses, materials, users } from '../data/mockData';
import { Book, FileText, User, UserPlus, Settings, Users as UsersIcon } from 'lucide-react';

const Courses: React.FC = () => {
  const { user } = useAuth();

  const getFilteredCourses = () => {
    if (user?.role === 'super_admin') {
      return courses;
    }
    if (user?.role === 'teacher') {
      return courses.filter(course => course.teacher_id === user.id);
    }
    if (user?.role === 'student') {
      // Students only see courses from their classes
      return courses.filter(course => 
        course.school_id === user.current_school_id &&
        course.class_ids?.some(classId => user.class_ids?.includes(classId))
      );
    }
    // School admin sees all courses in their school
    return courses.filter(course => course.school_id === user?.current_school_id);
  };

  const filteredCourses = getFilteredCourses();

  const getTeacherName = (teacherId?: number) => {
    if (!teacherId) return 'Not assigned';
    const teacher = users.find(u => u.id === teacherId);
    return teacher?.name || 'Unknown';
  };

  const getMaterialCount = (courseId: number) => {
    return materials.filter(m => m.course_id === courseId).length;
  };

  const getEnrolledStudentCount = (course: any) => {
    // Students don't need to see enrollment numbers
    if (user?.role === 'student') return null;
    
    return users.filter(u => 
      u.role === 'student' && 
      u.class_ids?.some(classId => course.class_ids?.includes(classId))
    ).length;
  };

  const isStudentEnrolled = (courseId: number) => {
    return user?.enrolled_courses?.includes(courseId) || false;
  };

  const canManageCourse = (course: any) => {
    return user?.role === 'teacher' && course.teacher_id === user.id;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'teacher' ? 'Your courses' : 
           user?.role === 'student' ? 'Your enrolled courses' : 
           'Available courses'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const studentCount = getEnrolledStudentCount(course);
          const isEnrolled = isStudentEnrolled(course.id);
          const canManage = canManageCourse(course);
          
          return (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Book className="h-8 w-8 text-company-primary" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {getMaterialCount(course.id)} materials
                    </span>
                    {user?.role === 'student' && isEnrolled && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{getTeacherName(course.teacher_id)}</span>
                  </div>
                  {studentCount !== null && (
                    <span>{studentCount} students</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
                  >
                    View Details
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    {user?.role === 'student' && (
                      <Link
                        to={`/courses/${course.id}/materials`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Materials
                      </Link>
                    )}
                    
                    {canManage && (
                      <>
                        <Link
                          to={`/courses/${course.id}/enroll`}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-primary bg-primary-100 hover:bg-primary-200 transition-colors"
                          title="Manage Enrollments"
                        >
                          <UserPlus className="h-3 w-3" />
                        </Link>
                        <Link
                          to={`/courses/${course.id}/settings`}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                          title="Course Settings"
                        >
                          <Settings className="h-3 w-3" />
                        </Link>
                      </>
                    )}
                    
                    {(user?.role === 'school_admin' || user?.role === 'super_admin') && (
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="View Enrollments"
                      >
                        <UsersIcon className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === 'teacher' 
              ? 'You haven\'t been assigned any courses yet.' 
              : user?.role === 'student'
              ? 'You are not enrolled in any courses yet.'
              : 'No courses are available for your school.'}
          </p>
          {user?.role === 'student' && (
            <Link
              to="/student/enrollments"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Browse Available Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;