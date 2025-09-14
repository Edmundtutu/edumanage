import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses, materials, users, classes } from '../data/mockData';
import { 
  Book, 
  User, 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  ArrowLeft,
  GraduationCap,
  Upload,
  Edit
} from 'lucide-react';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  
  const course = courses.find(c => c.id === parseInt(courseId || '0'));
  
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

  const teacher = users.find(u => u.id === course.teacher_id);
  const courseMaterials = materials.filter(m => m.course_id === course.id);
  
  // Role-based data filtering
  const courseClasses = classes.filter(c => course.class_ids?.includes(c.id));
  
  // Students should only see their own class information
  const visibleClasses = user?.role === 'student' 
    ? courseClasses.filter(c => user.class_ids?.includes(c.id))
    : courseClasses;
  
  const enrolledStudents = users.filter(u => 
    u.role === 'student' && 
    u.class_ids?.some(classId => course.class_ids?.includes(classId))
  );

  // Students shouldn't see other students' information
  const visibleStudents = user?.role === 'student' ? [] : enrolledStudents;

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

  const canManageCourse = user?.role === 'teacher' && course.teacher_id === user.id;
  const canViewMaterials = user?.role === 'student' || user?.role === 'teacher' || user?.role === 'school_admin';
  const canViewStudentList = user?.role === 'teacher' || user?.role === 'school_admin' || user?.role === 'super_admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/courses"
              className="inline-flex items-center text-company-primary hover:text-company-primary-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
          </div>
          {canManageCourse && (
            <div className="flex items-center space-x-3">
              <Link
                to="/materials/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-success-600 hover:bg-success-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Material
              </Link>
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
          <p className="text-gray-600 mt-2 text-lg">{course.description}</p>
        </div>
      </div>

      {/* Course Info Cards - Role-based visibility */}
      <div className={`grid grid-cols-1 gap-6 mb-8 ${
        user?.role === 'student' ? 'md:grid-cols-2' : 'md:grid-cols-4'
      }`}>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Teacher</p>
              <p className="text-lg font-semibold text-company-primary">{teacher?.name || 'Not assigned'}</p>
            </div>
            <User className="h-8 w-8 text-company-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Materials</p>
              <p className="text-lg font-semibold text-company-secondary">{courseMaterials.length}</p>
            </div>
            <FileText className="h-8 w-8 text-company-secondary" />
          </div>
        </div>

        {/* Only show student count and creation date to non-students */}
        {user?.role !== 'student' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-lg font-semibold text-success-600">{enrolledStudents.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-success-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-lg font-semibold text-orange-600">{course.created_at}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Materials */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Course Materials</h2>
                {canManageCourse && (
                  <Link
                    to="/materials/upload"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Material
                  </Link>
                )}
              </div>
            </div>
            
            {courseMaterials.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {courseMaterials.map((material) => (
                  <div key={material.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getFileIcon(material.file_type)}</div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {material.title}
                          </h3>
                          <p className="text-sm text-gray-600">{material.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {material.created_at}
                            </span>
                            <span className="capitalize">{material.file_type}</span>
                          </div>
                        </div>
                      </div>
                      
                      {canViewMaterials && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => alert(`Viewing ${material.title}`)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          
                          <button
                            onClick={() => alert(`Downloading ${material.title}`)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
                <p className="text-gray-600 mb-4">
                  {canManageCourse 
                    ? 'Upload your first material to get started.'
                    : 'Materials will appear here when the teacher uploads them.'}
                </p>
                {canManageCourse && (
                  <Link
                    to="/materials/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Material
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Classes - Students only see their own classes */}
          {visibleClasses.length > 0 && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.role === 'student' ? 'Your Class' : 'Classes'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {visibleClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.grade_level}</p>
                      </div>
                      {user?.role !== 'student' && (
                        <span className="text-sm text-gray-500">
                          {users.filter(u => u.class_ids?.includes(cls.id) && u.role === 'student').length} students
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Students List - Only visible to teachers and admins */}
          {canViewStudentList && visibleStudents.length > 0 && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {visibleStudents.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                  {visibleStudents.length > 5 && (
                    <p className="text-sm text-gray-500 text-center mt-3">
                      +{visibleStudents.length - 5} more students
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Student-specific help section */}
          {user?.role === 'student' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 mb-4">
                If you need help with course materials or have questions, contact your teacher.
              </p>
              <div className="text-sm text-blue-600">
                <p><strong>Teacher:</strong> {teacher?.name}</p>
                <p><strong>Email:</strong> {teacher?.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;