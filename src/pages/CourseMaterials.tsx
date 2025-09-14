import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses, materials, users } from '../data/mockData';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  ArrowLeft, 
  Book,
  User
} from 'lucide-react';

const CourseMaterials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  
  const course = courses.find(c => c.id === parseInt(courseId || '0'));
  const courseMaterials = materials.filter(m => m.course_id === parseInt(courseId || '0'));
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        <Link to="/courses" className="text-company-primary hover:text-company-primary-700">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Check if student is enrolled in this course
  const isStudentEnrolled = user?.role === 'student' && 
    user.class_ids?.some(classId => course.class_ids?.includes(classId));

  // Students can only access materials if they're enrolled
  if (user?.role === 'student' && !isStudentEnrolled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-6">
          <div className="flex items-center">
            <Book className="h-5 w-5 text-warning-500 mr-2" />
            <span className="text-warning-700">You are not enrolled in this course.</span>
          </div>
          <div className="mt-4">
            <Link
              to="/courses"
              className="text-warning-600 hover:text-warning-700 font-medium"
            >
              Browse available courses →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teacher = users.find(u => u.id === course.teacher_id);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎥';
      case 'document':
        return '📝';
      default:
        return '📎';
    }
  };

  const getUploaderName = (uploaderId: number) => {
    // Students don't need to see who uploaded materials
    if (user?.role === 'student') {
      return 'Teacher';
    }
    const uploader = users.find(u => u.id === uploaderId);
    return uploader?.name || 'Unknown';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/courses"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Teacher: {teacher?.name || 'Not assigned'}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{courseMaterials.length} materials available</span>
                </div>
              </div>
            </div>
            <Book className="h-16 w-16 text-company-primary" />
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Course Materials</h2>
          <p className="text-sm text-gray-600 mt-1">
            {user?.role === 'student' 
              ? 'Download and view materials for your studies'
              : 'Materials available for this course'}
          </p>
        </div>
        
        {courseMaterials.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {courseMaterials.map((material) => (
              <div key={material.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getFileIcon(material.file_type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {material.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{material.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Uploaded by {getUploaderName(material.uploaded_by)}</span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {material.created_at}
                        </span>
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                          {material.file_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => alert(`Viewing ${material.title}`)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    
                    <button
                      onClick={() => alert(`Downloading ${material.title}`)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials available</h3>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'Your teacher hasn\'t uploaded any materials yet. Check back later!'
                : 'Materials will appear here when the teacher uploads them.'}
            </p>
          </div>
        )}
      </div>

      {/* Student-specific help section */}
      {user?.role === 'student' && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Study Tips</h3>
          <div className="text-blue-700 space-y-2">
            <p>• Download materials to study offline</p>
            <p>• Review materials regularly for better understanding</p>
            <p>• Contact your teacher if you need clarification on any material</p>
            <p>• Keep your downloaded files organized by subject and date</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-600">
              <strong>Need help?</strong> Contact {teacher?.name} at {teacher?.email}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions for non-students */}
      {user?.role !== 'student' && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Management</h3>
          <div className="flex items-center space-x-4">
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View Course Details
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
            >
              Browse Other Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterials;