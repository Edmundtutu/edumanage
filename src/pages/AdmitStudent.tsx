import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Class } from '../types';
import { UserPlus, AlertCircle, CheckCircle, User } from 'lucide-react';

const AdmitStudent: React.FC = () => {
  const { user, canAdmitStudents } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    class_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [schoolClasses, setSchoolClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.current_school_id) return;
      
      try {
        const classes = await apiService.getSchoolClasses(user.current_school_id);
        setSchoolClasses(classes);
      } catch (err) {
        setError('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user?.current_school_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const generatePassword = () => {
    const password = `student${Math.random().toString(36).slice(-6)}`;
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.class_name) {
        throw new Error('Please fill in all required fields');
      }

      if (!user?.current_school_id) {
        throw new Error('No school selected');
      }

      const response = await apiService.admitStudent(user.current_school_id, {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        class_name: formData.class_name,
        password: formData.password,
      });

      setSuccess(`Student "${response.student.name}" has been successfully admitted to ${formData.class_name}! Password: ${response.password}`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        class_name: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to admit student');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canAdmitStudents()) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only school administrators can admit students.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admit New Student</h1>
        <p className="text-gray-600 mt-2">Add a new student to your school</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
            <span className="text-success-700">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">{error}</span>
          </div>
        </div>
      )}

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter student's full name"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="class_name" className="block text-sm font-medium text-gray-700 mb-2">
              Class *
            </label>
            <select
              id="class_name"
              name="class_name"
              value={formData.class_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Select a class</option>
              {schoolClasses.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name} - {cls.grade_level}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-primary mr-2" />
              <div className="text-sm text-primary-800">
                <p className="font-medium">Student Account</p>
                <p>The student will be able to log in immediately with the provided credentials.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                email: '',
                username: '',
                password: '',
                class_name: ''
              })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Admitting...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Admit Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmitStudent;