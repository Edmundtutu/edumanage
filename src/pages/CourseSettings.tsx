import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses, toggleCourseSelfEnrollment } from '../data/mockData';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const CourseSettings: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isTeacher } = useAuth();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const course = courses.find(c => c.id === parseInt(courseId || '0'));
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        <Link to="/courses" className="text-primary hover:text-primary-700">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Check permissions
  if (!isTeacher() || course.teacher_id !== user?.id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">You can only manage settings for courses you teach.</span>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleSelfEnrollment = () => {
    const newValue = !course.self_enrollment;
    const success = toggleCourseSelfEnrollment(course.id, newValue);
    
    if (success) {
      course.self_enrollment = newValue; // Update local state
      setMessage({
        type: 'success',
        text: `Self-enrollment ${newValue ? 'enabled' : 'disabled'} successfully`
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Failed to update self-enrollment setting'
      });
    }
  };

  const enrolledCount = course.enrolled_students?.length || 0;
  const maxStudents = course.max_students || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Course
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Settings</h1>
          <p className="text-gray-600 mt-2">{course.name}</p>
        </div>
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

      {/* Course Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{enrolledCount}</p>
            <p className="text-sm text-gray-600">Enrolled Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary">{maxStudents}</p>
            <p className="text-sm text-gray-600">Maximum Capacity</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">
              {maxStudents > 0 ? Math.round((enrolledCount / maxStudents) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Capacity Used</p>
          </div>
        </div>
      </div>

      {/* Enrollment Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Enrollment Settings</h2>
        
        <div className="space-y-6">
          {/* Self Enrollment Toggle */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Student Self-Enrollment</h3>
              <p className="text-sm text-gray-600 mt-1">
                Allow students to enroll themselves in this course without teacher approval
              </p>
            </div>
            <button
              onClick={handleToggleSelfEnrollment}
              className={`flex items-center p-1 rounded-full transition-colors ${
                course.self_enrollment 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {course.self_enrollment ? (
                <ToggleRight className="h-8 w-8" />
              ) : (
                <ToggleLeft className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Self Enrollment Status */}
          <div className={`p-4 rounded-lg border ${
            course.self_enrollment 
              ? 'bg-success-50 border-success-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center">
              {course.self_enrollment ? (
                <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
              )}
              <span className={`text-sm font-medium ${
                course.self_enrollment ? 'text-success-800' : 'text-gray-700'
              }`}>
                {course.self_enrollment 
                  ? 'Students can enroll themselves in this course'
                  : 'Only teachers can enroll students in this course'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={`/courses/${course.id}/enroll`}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            Manage Student Enrollment
          </Link>
          
          <Link
            to="/materials/upload"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 mr-2" />
            Upload Course Materials
          </Link>
        </div>
      </div>

      {/* Course Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Course Information</h3>
        <div className="space-y-2 text-blue-800">
          <p><strong>Course ID:</strong> {course.id}</p>
          <p><strong>Created:</strong> {course.created_at}</p>
          <p><strong>Status:</strong> {course.status || 'Active'}</p>
          <p><strong>Credits:</strong> {course.credits || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseSettings;