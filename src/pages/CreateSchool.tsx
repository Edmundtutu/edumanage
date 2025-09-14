import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, AlertCircle } from 'lucide-react';

const CreateSchool: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    adminName: '',
    adminEmail: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.adminName || !formData.adminEmail) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate school creation
    alert(`School "${formData.name}" created successfully with admin "${formData.adminName}"!`);
    
    // Reset form
    setFormData({
      name: '',
      address: '',
      adminName: '',
      adminEmail: ''
    });
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only super administrators can create schools.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create School</h1>
        <p className="text-gray-600 mt-2">Add a new school to the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              School Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter school name"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter school address"
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">School Administrator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  id="adminName"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin name"
                  required
                />
              </div>

              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email *
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-company-primary-50 border border-company-primary-200 rounded-lg p-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-company-primary mr-2" />
              <div className="text-sm text-company-primary">
                <p className="font-medium">School Setup</p>
                <p>The school administrator will receive login credentials via email and can start managing their school immediately.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                address: '',
                adminName: '',
                adminEmail: ''
              })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-company-primary hover:bg-company-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-company-primary transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create School
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSchool;