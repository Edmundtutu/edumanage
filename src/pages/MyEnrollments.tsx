import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses, materials, users, studentSelfEnroll, unenrollStudentFromCourse } from '../data/mockData';
import { 
  Book, 
  FileText, 
  Calendar, 
  User, 
  UserPlus, 
  UserMinus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const MyEnrollments: React.FC = () => {
  const { user, isStudent } = useAuth();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isStudent()) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">This page is only available to students.</span>
          </div>
        </div>
      </div>
    );
  }

  // Get enrolled courses
  const enrolledCourses = courses.filter(course => 
    user?.enrolled_courses?.includes(course.id)
  );

  // Get available courses for self-enrollment
  const availableCourses = courses.filter(course => 
    course.school_id === user?.current_school_id &&
    course.self_enrollment === true &&
    !user?.enrolled_courses?.includes(course.id) &&
    course.class_ids?.some(classId => user?.class_ids?.includes(classId))
  );

  // Filter courses based on search
  const filterCourses = (courseList: typeof courses) => {
    return courseList.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredEnrolledCourses = filterCourses(enrolledCourses);
  const filteredAvailableCourses = filterCourses(availableCourses);

  const handleSelfEnroll = (courseId: number) => {
    if (!user) return;

    const success = studentSelfEnroll(user.id, courseId);
    if (success) {
      setMessage({
        type: 'success',
        text: 'Successfully enrolled in the course!'
      });
      // Update user's enrolled courses in the UI
      if (user.enrolled_courses) {
        user.enrolled_courses.push(courseId);
      } else {
        user.enrolled_courses = [courseId];
      }
    } else {
      setMessage({
        type: 'error',
        text: 'Failed to enroll in the course. It may be full or self-enrollment may be disabled.'
      });
    }
  };

  const handleUnenroll = (courseId: number) => {
    if (!user) return;

    if (confirm('Are you sure you want to unenroll from this course?')) {
      const success = unenrollStudentFromCourse(user.id, courseId);
      if (success) {
        setMessage({
          type: 'success',
          text: 'Successfully unenrolled from the course.'
        });
        // Update user's enrolled courses in the UI
        if (user.enrolled_courses) {
          user.enrolled_courses = user.enrolled_courses.filter(id => id !== courseId);
        }
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to unenroll from the course.'
        });
      }
    }
  };

  const getTeacherName = (teacherId?: number) => {
    if (!teacherId) return 'Not assigned';
    const teacher = users.find(u => u.id === teacherId);
    return teacher?.name || 'Unknown';
  };

  const getMaterialCount = (courseId: number) => {
    return materials.filter(m => m.course_id === courseId).length;
  };

  const getEnrollmentDate = (courseId: number) => {
    return user?.enrolled_at?.[courseId] || 'Unknown';
  };

  const CourseCard = ({ course, isEnrolled = false }: { course: any; isEnrolled?: boolean }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Book className="h-8 w-8 text-primary" />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {getMaterialCount(course.id)} materials
            </span>
            {isEnrolled && (
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
          {isEnrolled && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Enrolled: {getEnrollmentDate(course.id)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
          
          <div className="flex items-center space-x-2">
            {isEnrolled ? (
              <>
                <Link
                  to={`/courses/${course.id}/materials`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Materials
                </Link>
                <button
                  onClick={() => handleUnenroll(course.id)}
                  className="inline-flex items-center px-3 py-2 border border-error-300 text-sm font-medium rounded-md text-error-700 bg-error-50 hover:bg-error-100 transition-colors"
                >
                  <UserMinus className="h-4 w-4 mr-1" />
                  Unenroll
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSelfEnroll(course.id)}
                className="inline-flex items-center px-3 py-2 border border-success-300 text-sm font-medium rounded-md text-success-700 bg-success-50 hover:bg-success-100 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Enroll
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Course Enrollments</h1>
        <p className="text-gray-600 mt-2">Manage your course enrollments and discover new courses</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-success-50 border-success-200 text-success-700' 
            : 'bg-error-50 border-error-200 text-error-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-3xl font-bold text-primary">{enrolledCourses.length}</p>
            </div>
            <Book className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Courses</p>
              <p className="text-3xl font-bold text-success-600">{availableCourses.length}</p>
            </div>
            <UserPlus className="h-12 w-12 text-success-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Materials</p>
              <p className="text-3xl font-bold text-secondary">
                {enrolledCourses.reduce((total, course) => total + getMaterialCount(course.id), 0)}
              </p>
            </div>
            <FileText className="h-12 w-12 text-secondary" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'enrolled', label: 'My Courses', count: enrolledCourses.length },
            { id: 'available', label: 'Available Courses', count: availableCourses.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Course Grid */}
      {activeTab === 'enrolled' && (
        <div>
          {filteredEnrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrolledCourses.map((course) => (
                <CourseCard key={course.id} course={course} isEnrolled={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No courses found' : 'No enrolled courses'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'You are not enrolled in any courses yet. Check out available courses to get started.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700"
                >
                  Browse Available Courses
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'available' && (
        <div>
          {filteredAvailableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableCourses.map((course) => (
                <CourseCard key={course.id} course={course} isEnrolled={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No courses found' : 'No available courses'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'There are no courses available for self-enrollment at this time.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;