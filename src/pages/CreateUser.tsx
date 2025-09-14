import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserPlus, AlertCircle } from 'lucide-react';

const CreateUser: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher' as 'teacher'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate user creation
    alert(`${formData.role} "${formData.name}" created successfully!`);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'teacher'
    });
  };

  if (user?.role !== 'school_admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only school administrators can create staff members.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Staff</h1>
        <p className="text-gray-600 mt-2">Add new teachers and staff members to your school</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> To add students, please use the{' '}
            <a href="/admin/admit-student" className="text-blue-600 hover:text-blue-700 underline">
              Admit Student
            </a>{' '}
            page instead.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="teacher">Teacher</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Currently only teachers can be added through this form. Use "Admit Student" for adding students.
            </p>
          </div>

          <div className="bg-company-primary-50 border border-company-primary-200 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-company-primary mr-2" />
              <div className="text-sm text-company-primary">
                <p className="font-medium">Account Information</p>
                <p>A temporary password will be generated and sent to the staff member's email address.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                email: '',
                role: 'teacher'
              })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-company-primary hover:bg-company-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-company-primary transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;