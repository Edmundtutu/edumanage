import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses, users, classes, enrollStudentInCourse, unenrollStudentFromCourse } from '../data/mockData';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  UserPlus,
  UserMinus
} from 'lucide-react';

const EnrollStudents: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isTeacher } = useAuth();
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [enrollmentFilter, setEnrollmentFilter] = useState<'all' | 'enrolled' | 'not_enrolled'>('not_enrolled');
  const [isProcessing, setIsProcessing] = useState(false);
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
            <span className="text-error-700">You can only enroll students in courses you teach.</span>
          </div>
        </div>
      </div>
    );
  }

  // Get students from course classes
  const courseClasses = classes.filter(c => course.class_ids?.includes(c.id));
  const eligibleStudents = users.filter(u => 
    u.role === 'student' && 
    u.school_ids?.includes(course.school_id) &&
    u.class_ids?.some(classId => course.class_ids?.includes(classId))
  );

  // Filter students
  const filteredStudents = eligibleStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || 
      student.class_ids?.includes(parseInt(classFilter));
    
    const isEnrolled = student.enrolled_courses?.includes(course.id) || false;
    const matchesEnrollment = enrollmentFilter === 'all' ||
      (enrollmentFilter === 'enrolled' && isEnrolled) ||
      (enrollmentFilter === 'not_enrolled' && !isEnrolled);
    
    return matchesSearch && matchesClass && matchesEnrollment;
  });

  const handleStudentToggle = (studentId: number) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkEnroll = async () => {
    if (selectedStudents.size === 0) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const studentId of selectedStudents) {
        const student = users.find(u => u.id === studentId);
        const isEnrolled = student?.enrolled_courses?.includes(course.id);
        
        if (isEnrolled) {
          // Unenroll
          if (unenrollStudentFromCourse(studentId, course.id)) {
            successCount++;
          } else {
            errorCount++;
          }
        } else {
          // Enroll
          if (enrollStudentInCourse(studentId, course.id, user?.id || 0)) {
            successCount++;
          } else {
            errorCount++;
          }
        }
      }

      if (errorCount === 0) {
        setMessage({
          type: 'success',
          text: `Successfully updated enrollment for ${successCount} student(s)`
        });
      } else {
        setMessage({
          type: 'error',
          text: `Updated ${successCount} student(s), but ${errorCount} failed`
        });
      }

      setSelectedStudents(new Set());
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update enrollments'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getClassNames = (classIds?: number[]) => {
    if (!classIds) return 'No classes';
    const classNames = classIds.map(id => {
      const cls = classes.find(c => c.id === id);
      return cls?.name || 'Unknown';
    });
    return classNames.join(', ');
  };

  const enrolledCount = course.enrolled_students?.length || 0;
  const maxStudents = course.max_students || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900">Enroll Students</h1>
          <p className="text-gray-600 mt-2">{course.name}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>Enrolled: {enrolledCount}/{maxStudents}</span>
            <span>Available: {filteredStudents.filter(s => !s.enrolled_courses?.includes(course.id)).length}</span>
          </div>
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

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {courseClasses.map((cls) => (
                <option key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={enrollmentFilter}
              onChange={(e) => setEnrollmentFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="enrolled">Enrolled</option>
              <option value="not_enrolled">Not Enrolled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {selectedStudents.size} selected
            </span>
            <button
              onClick={handleBulkEnroll}
              disabled={selectedStudents.size === 0 || isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Update Enrollment
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Students ({filteredStudents.length})
          </h3>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
                        } else {
                          setSelectedStudents(new Set());
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const isEnrolled = student.enrolled_courses?.includes(course.id) || false;
                  const enrolledDate = student.enrolled_at?.[course.id];
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getClassNames(student.class_ids)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isEnrolled 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrolledDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            if (isEnrolled) {
                              unenrollStudentFromCourse(student.id, course.id);
                            } else {
                              enrollStudentInCourse(student.id, course.id, user?.id || 0);
                            }
                            setMessage({
                              type: 'success',
                              text: `${student.name} ${isEnrolled ? 'unenrolled from' : 'enrolled in'} the course`
                            });
                          }}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md transition-colors ${
                            isEnrolled
                              ? 'text-error-700 bg-error-100 hover:bg-error-200'
                              : 'text-primary-700 bg-primary-100 hover:bg-primary-200'
                          }`}
                        >
                          {isEnrolled ? (
                            <>
                              <UserMinus className="h-3 w-3 mr-1" />
                              Unenroll
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Enroll
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollStudents;