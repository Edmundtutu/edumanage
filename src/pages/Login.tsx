import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { GraduationCap, User, Lock, Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [availableSchools, setAvailableSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'school-selection'>('credentials');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      // Use the API service instead of mock data
      const response = await apiService.login(credentials.email, credentials.password);
      const user = response.user;
      
      setAuthenticatedUser(user);

      // Super admin doesn't need school selection
      if (user.role === 'super_admin') {
        login(user, response.school);
        navigate('/dashboard');
        return;
      }

      // If user has schools associated, handle school selection
      if (response.schools && response.schools.length > 1) {
        // Multiple schools - show selection
        setAvailableSchools(response.schools);
        setStep('school-selection');
      } else if (response.schools && response.schools.length === 1) {
        // Auto-select if only one school
        const selectedSchoolData = response.schools[0];
        const userWithSchool = { ...user, current_school_id: selectedSchoolData.id };
        login(userWithSchool, selectedSchoolData);
        navigate('/dashboard');
      } else {
        // Use the school from response if available
        login(user, response.school);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelection = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSchool) {
      setError('Please select a school');
      return;
    }

    const selectedSchoolData = availableSchools.find(s => s.id === parseInt(selectedSchool));
    if (!selectedSchoolData) {
      setError('Invalid school selection');
      return;
    }

    const userWithSchool = { 
      ...authenticatedUser, 
      current_school_id: selectedSchoolData.id 
    };
    
    login(userWithSchool, selectedSchoolData);
    navigate('/dashboard');
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setSelectedSchool('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-16 w-16 text-company-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Educate</h1>
            <p className="text-gray-600">School Learning Management System</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
                <span className="text-error-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleCredentialsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleCredentialsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-company-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-company-primary-700 focus:outline-none focus:ring-2 focus:ring-company-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {step === 'school-selection' && (
            <form onSubmit={handleSchoolSelection} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Select School</h2>
                <p className="text-gray-600 mt-1">Choose which school to access</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="h-4 w-4 inline mr-2" />
                  Available Schools
                </label>  
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Choose a school</option>
                  {availableSchools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-company-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-company-primary-700 focus:outline-none focus:ring-2 focus:ring-company-primary focus:ring-offset-2 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* Test credentials section for development */}
          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="font-medium mb-2">Test credentials:</p>
              <p>Super Admin: edmond@system.com / admin123</p>
              <p>School Admin: sarah@kampala.primary.ug / password123</p>
              <p>Teacher: mary@kampala.primary.ug / teacher123</p>
              <p>Student: john@kampala.primary.ug / student123</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;