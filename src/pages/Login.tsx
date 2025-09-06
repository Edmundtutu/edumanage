import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users, schools } from '../data/mockData';
import { GraduationCap, User, Lock, Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [availableSchools, setAvailableSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [error, setError] = useState('');
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

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    // Find user by username and password
    const user = users.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      setError('Invalid username or password');
      return;
    }

    setAuthenticatedUser(user);

    // Super admin doesn't need school selection
    if (user.role === 'super_admin') {
      login(user);
      navigate('/dashboard');
      return;
    }

    // Get available schools for this user
    const userSchools = schools.filter(school => 
      user.school_ids?.includes(school.id)
    );

    if (userSchools.length === 0) {
      setError('No schools assigned to this user. Contact administrator.');
      return;
    }

    if (userSchools.length === 1) {
      // Auto-select if only one school
      const selectedSchoolData = userSchools[0];
      const userWithSchool = { ...user, current_school_id: selectedSchoolData.id };
      login(userWithSchool, selectedSchoolData);
      navigate('/dashboard');
      return;
    }

    // Multiple schools - show selection
    setAvailableSchools(userSchools);
    setStep('school-selection');
  };

  const handleSchoolSelection = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSchool) {
      setError('Please select a school');
      return;
    }

    const selectedSchoolData = schools.find(s => s.id === parseInt(selectedSchool));
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
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleCredentialsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
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
                className="w-full bg-company-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-company-primary-700 focus:outline-none focus:ring-2 focus:ring-company-primary focus:ring-offset-2 transition-colors"
              >
                Sign In
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
        </div>
      </div>
    </div>
  );
};

export default Login;