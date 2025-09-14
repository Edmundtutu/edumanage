import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Eye, Calendar, Loader2 } from 'lucide-react';
import { Material, Course, User } from '../types';
import { apiService } from '../services/api';

const Materials: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [materialsResponse, coursesResponse, usersResponse] = await Promise.all([
          apiService.getMaterials(),
          user?.current_school_id ? apiService.getSchoolCourses(user.current_school_id) : Promise.resolve([]),
          apiService.getUsers()
        ]);
        
        setMaterials(materialsResponse.data || []);
        setCourses(coursesResponse || []);
        setUsers(usersResponse.data || []);
      } catch (err) {
        setError('Failed to load materials data');
        console.error('Materials data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.current_school_id]);

  const getFilteredMaterials = () => {
    if (user?.role === 'super_admin') {
      return materials;
    }
    if (user?.role === 'teacher') {
      return materials.filter(material => material.uploaded_by === user.id);
    }
    if (user?.role === 'student') {
      // Students only see materials from courses they're enrolled in
      const enrolledCourses = courses.filter(course => 
        course.school_id === user.current_school_id &&
        course.class_ids?.some(classId => user.class_ids?.includes(classId))
      );
      return materials.filter(material => 
        enrolledCourses.some(course => course.id === material.course_id)
      );
    }
    // School admin sees all materials from their school
    const schoolCourses = courses.filter(course => course.school_id === user?.current_school_id);
    return materials.filter(material => 
      schoolCourses.some(course => course.id === material.course_id)
    );
  };

  const filteredMaterials = getFilteredMaterials();

  if (loading) {
    return (
      <div className="container-enhanced py-8 fade-in">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-enhanced" />
          <span className="ml-2 text-muted-enhanced">Loading materials...</span>
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

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course?.name || 'Unknown Course';
  };

  const getUploaderName = (uploaderId: number) => {
    // Students don't need to see detailed uploader info
    if (user?.role === 'student') {
      return 'Teacher';
    }
    const uploader = users.find(u => u.id === uploaderId);
    return uploader?.name || 'Unknown';
  };

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

  const groupedMaterials = filteredMaterials.reduce((acc, material) => {
    const courseName = getCourseName(material.course_id);
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'teacher' ? 'Materials you\'ve uploaded' : 
           user?.role === 'student' ? 'Materials for your courses' :
           'Available study materials'}
        </p>
      </div>

      {Object.entries(groupedMaterials).map(([courseName, courseMaterials]) => (
        <div key={courseName} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{courseName}</h2>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="divide-y divide-gray-200">
              {courseMaterials.map((material) => (
                <div key={material.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getFileIcon(material.file_type)}</div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {material.title}
                        </h3>
                        <p className="text-sm text-gray-600">{material.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Uploaded by {getUploaderName(material.uploaded_by)}</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {material.created_at}
                          </span>
                          <span className="capitalize">{material.file_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alert(`Viewing ${material.title}`)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      
                      <button
                        onClick={() => alert(`Downloading ${material.title}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No materials available</h3>
          <p className="text-gray-600">
            {user?.role === 'teacher' 
              ? 'You haven\'t uploaded any materials yet.' 
              : user?.role === 'student'
              ? 'No study materials are available for your courses yet.'
              : 'No study materials are available yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Materials;