import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/mockData';
import { Upload, File, AlertCircle } from 'lucide-react';

const UploadMaterial: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    fileType: 'pdf' as 'pdf' | 'video' | 'document',
    file: null as File | null
  });

  const myCourses = courses.filter(course => course.teacher_id === user?.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || !formData.file) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate upload
    alert(`Material "${formData.title}" uploaded successfully!`);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      courseId: '',
      fileType: 'pdf',
      file: null
    });
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">Only teachers can upload materials.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Material</h1>
        <p className="text-gray-600 mt-2">Share study materials with your students</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Material Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter material title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter material description"
            />
          </div>

          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a course</option>
              {myCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
              File Type *
            </label>
            <select
              id="fileType"
              name="fileType"
              value={formData.fileType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="pdf">PDF Document</option>
              <option value="video">Video File</option>
              <option value="document">Document</option>
            </select>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.mp4,.mov,.avi"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, MP4 up to 10MB</p>
                {formData.file && (
                  <div className="flex items-center justify-center mt-2">
                    <File className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-700">{formData.file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                title: '',
                description: '',
                courseId: '',
                fileType: 'pdf',
                file: null
              })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-company-primary hover:bg-company-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-company-primary transition-colors"
            >
              Upload Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterial;