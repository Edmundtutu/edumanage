import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, Calendar, Plus, Eye, Loader2 } from 'lucide-react';
import { School, User } from '../types';
import { apiService } from '../services/api';

const Schools: React.FC = () => {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [schoolsResponse, usersResponse] = await Promise.all([
          apiService.getSchools(),
          apiService.getUsers()
        ]);
        
        setSchools(schoolsResponse.data || []);
        setUsers(usersResponse.data || []);
      } catch (err) {
        setError('Failed to load schools data');
        console.error('Schools data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSchoolStats = (schoolId: number) => {
    const schoolUsers = users.filter(u => u.school_ids?.includes(schoolId));
    const teachers = schoolUsers.filter(u => u.role === 'teacher').length;
    const students = schoolUsers.filter(u => u.role === 'student').length;
    
    return { teachers, students };
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only super administrators can view all schools.</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-enhanced py-8 fade-in">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-enhanced" />
          <span className="ml-2 text-muted-enhanced">Loading schools...</span>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
            <p className="text-gray-600 mt-2">Manage all schools in the system</p>
          </div>
          <Link
            to="/admin/create-school"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => {
          const stats = getSchoolStats(school.id);
          
          return (
            <div key={school.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="h-8 w-8 text-company-primary" />
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {school.created_at}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {school.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {school.address}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.teachers}</p>
                    <p className="text-sm text-gray-500">Teachers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.students}</p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={`/schools/${school.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                  
                  <Link
                    to={`/schools/${school.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {schools.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first school.</p>
          <Link
            to="/admin/create-school"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create School
          </Link>
        </div>
      )}
    </div>
  );
};

export default Schools;