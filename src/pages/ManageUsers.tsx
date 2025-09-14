import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users, classes } from '../data/mockData';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  GraduationCap,
  BookOpen
} from 'lucide-react';

const ManageUsers: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');

  const schoolUsers = users.filter(u => u.school_ids?.includes(user?.current_school_id || 0));
  const schoolClasses = classes.filter(c => c.school_id === user?.current_school_id);

  const filteredUsers = schoolUsers.filter(u => {
    const matchesRole = u.role === activeTab.slice(0, -1); // Remove 's' from 'teachers'/'students'
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || u.class_ids?.includes(parseInt(classFilter));
    
    return matchesRole && matchesSearch && matchesClass;
  });

  const getClassNames = (classIds?: number[]) => {
    if (!classIds || classIds.length === 0) return 'No classes assigned';
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

  if (user?.role !== 'school_admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only school administrators can manage users.</span>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-2">Manage teachers and students in your school</p>
          </div>
          <Link
            to="/admin/create-user"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-success-600">
                {schoolUsers.filter(u => u.role === 'teacher').length}
              </p>
            </div>
            <BookOpen className="h-12 w-12 text-success-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-company-primary">
                {schoolUsers.filter(u => u.role === 'student').length}
              </p>
            </div>
            <GraduationCap className="h-12 w-12 text-company-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-company-secondary">{schoolClasses.length}</p>
            </div>
            <Users className="h-12 w-12 text-company-secondary" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'teachers', label: 'Teachers', icon: BookOpen },
            { id: 'students', label: 'Students', icon: GraduationCap }
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

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Classes</option>
            {schoolClasses.map((cls) => (
              <option key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} {activeTab}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'teachers' ? 'Teacher' : 'Student'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
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
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {getClassNames(user.class_ids)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Jan 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-company-primary hover:text-company-primary-900 p-1"
                      title="Edit user"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className="text-warning-600 hover:text-warning-900 p-1"
                      title="Toggle status"
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-error-600 hover:text-error-900 p-1"
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || classFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : `No ${activeTab} have been added yet.`}
            </p>
            <Link
              to="/admin/create-user"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-company-primary hover:bg-company-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;