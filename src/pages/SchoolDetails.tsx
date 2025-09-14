import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { schools, users, courses, classes } from '../data/mockData';
import { 
  Building2, 
  Users, 
  Book, 
  GraduationCap, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  ArrowLeft,
  UserCheck,
  UserX
} from 'lucide-react';

const SchoolDetails: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'classes'>('overview');
  const [userFilter, setUserFilter] = useState<'all' | 'teachers' | 'students' | 'admins'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const school = schools.find(s => s.id === parseInt(schoolId || '0'));
  
  if (!school) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">School not found</h3>
        <Link to="/schools" className="text-company-primary hover:text-company-primary-700">
          Back to Schools
        </Link>
      </div>
    );
  }

  const schoolUsers = users.filter(u => u.school_ids?.includes(school.id));
  const schoolCourses = courses.filter(c => c.school_id === school.id);
  const schoolClasses = classes.filter(c => c.school_id === school.id);

  const filteredUsers = schoolUsers.filter(u => {
    const matchesFilter = userFilter === 'all' || 
      (userFilter === 'teachers' && u.role === 'teacher') ||
      (userFilter === 'students' && u.role === 'student') ||
      (userFilter === 'admins' && u.role === 'school_admin');
    
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getClassNames = (classIds?: number[]) => {
    if (!classIds) return 'No classes assigned';
    const classNames = classIds.map(id => {
      const cls = classes.find(c => c.id === id);
      return cls?.name || 'Unknown';
    });
    return classNames.join(', ');
  };

  const handleEditUser = (userId: number) => {
    alert(`Edit user functionality for user ID: ${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      alert(`Delete user functionality for user ID: ${userId}`);
    }
  };

  const handleToggleUserStatus = (userId: number) => {
    alert(`Toggle user status for user ID: ${userId}`);
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only super administrators can view school details.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/schools"
              className="text-company-primary hover:text-company-primary-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Schools
            </Link>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit School
          </button>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
          <p className="text-gray-600 mt-2">{school.address}</p>
          <p className="text-sm text-gray-500 mt-1">Created: {school.created_at}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'courses', label: 'Courses', icon: Book },
            { id: 'classes', label: 'Classes', icon: GraduationCap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-company-primary-500 text-company-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-company-primary">{schoolUsers.length}</p>
              </div>
              <Users className="h-12 w-12 text-company-primary" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-3xl font-bold text-success-600">
                  {schoolUsers.filter(u => u.role === 'teacher').length}
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-success-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-company-secondary">
                  {schoolUsers.filter(u => u.role === 'student').length}
                </p>
              </div>
              <GraduationCap className="h-12 w-12 text-company-secondary" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-3xl font-bold text-orange-600">{schoolCourses.length}</p>
              </div>
              <Book className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {/* User Management Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-primary focus:border-transparent"
                />
              </div>
              
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-primary focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="teachers">Teachers</option>
                <option value="students">Students</option>
                <option value="admins">Admins</option>
              </select>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'teacher' ? 'bg-success-100 text-success-800' :
                        user.role === 'student' ? 'bg-company-primary-100 text-company-primary-800' :
                        'bg-company-secondary-100 text-company-secondary-800'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getClassNames(user.class_ids)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="text-company-primary hover:text-company-primary-900 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="text-warning-600 hover:text-warning-900 p-1"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-error-600 hover:text-error-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created: {course.created_at}</span>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-company-primary hover:text-company-primary-700 text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{cls.name}</h3>
              <p className="text-gray-600 mb-2">{cls.grade_level}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {users.filter(u => u.class_ids?.includes(cls.id) && u.role === 'student').length} students
                </span>
                <span className="text-sm text-gray-500">Created: {cls.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolDetails;