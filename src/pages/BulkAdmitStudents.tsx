import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { BulkStudentData, BulkUploadResult } from '../types';
import { Upload, Download, AlertCircle, CheckCircle, FileText, Users } from 'lucide-react';

const BulkAdmitStudents: React.FC = () => {
  const { user, canAdmitStudents } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setUploadResult(null);

    try {
      const text = await file.text();
      let studentsData: BulkStudentData[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Validate headers
        const requiredHeaders = ['name', 'email', 'username', 'class_name'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        studentsData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const student: BulkStudentData = {
            name: values[headers.indexOf('name')] || '',
            email: values[headers.indexOf('email')] || '',
            username: values[headers.indexOf('username')] || '',
            class_name: values[headers.indexOf('class_name')] || '',
            grade_level: values[headers.indexOf('grade_level')] || ''
          };
          return student;
        });
      } else if (file.name.endsWith('.json')) {
        // Parse JSON
        const jsonData = JSON.parse(text);
        if (!Array.isArray(jsonData)) {
          throw new Error('JSON file must contain an array of student objects');
        }
        studentsData = jsonData;
      } else {
        throw new Error('Please upload a CSV or JSON file');
      }

      if (studentsData.length === 0) {
        throw new Error('No student data found in file');
      }

      // Process bulk admission
      if (!user?.current_school_id) {
        throw new Error('No school selected');
      }
      
      const result = await apiService.bulkAdmitStudents(user.current_school_id, studentsData);
      setUploadResult(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,username,class_name,grade_level\n' +
      'John Doe,john.doe@school.edu,john.doe,Grade 1A,Grade 1\n' +
      'Jane Smith,jane.smith@school.edu,jane.smith,Grade 2A,Grade 2';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadErrors = () => {
    if (!uploadResult?.errors.length) return;

    const csvContent = 'row,name,email,username,class_name,error\n' +
      uploadResult.errors.map(error => 
        `${error.row},"${error.data.name}","${error.data.email}","${error.data.username}","${error.data.class_name}","${error.error}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admission_errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Admit Students</h1>
        <p className="text-gray-600 mt-2">Upload a CSV or JSON file to admit multiple students at once</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-700">{error}</span>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Upload Student Data</p>
              <p className="text-gray-600">Choose a CSV or JSON file containing student information</p>
            </div>
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </button>
        </div>
      </div>

      {/* File Format Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">File Format Requirements</h3>
        <div className="space-y-2 text-blue-800">
          <p><strong>Required columns:</strong> name, email, username, class_name</p>
          <p><strong>Optional columns:</strong> grade_level</p>
          <p><strong>Supported formats:</strong> CSV, JSON</p>
          <p><strong>Note:</strong> Class names must match existing classes in your school</p>
        </div>
      </div>

      {/* Results Section */}
      {uploadResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-success-500 mr-3" />
                  <div>
                    <p className="text-lg font-semibold text-success-800">{uploadResult.success.length}</p>
                    <p className="text-success-600">Students Admitted</p>
                  </div>
                </div>
              </div>
              
              {uploadResult.errors.length > 0 && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-error-500 mr-3" />
                    <div>
                      <p className="text-lg font-semibold text-error-800">{uploadResult.errors.length}</p>
                      <p className="text-error-600">Failed Admissions</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Successful Admissions */}
          {uploadResult.success.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Successfully Admitted Students</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.success.map((student, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Failed Admissions */}
          {uploadResult.errors.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Failed Admissions</h4>
                <button
                  onClick={downloadErrors}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Errors
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.errors.map((error, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.row}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.data.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.data.email}</td>
                        <td className="px-6 py-4 text-sm text-error-600">{error.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkAdmitStudents;