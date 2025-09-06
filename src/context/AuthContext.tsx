import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, School, AuthContextType } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    // Check if we have a token and validate it
    const token = apiService.getToken();
    if (token) {
      apiService.getCurrentUser()
        .then(({ user, school }) => {
          setUser(user);
          setSchool(school);
        })
        .catch(() => {
          // Token is invalid, clear it
          apiService.removeToken();
          localStorage.removeItem('user');
          localStorage.removeItem('school');
        });
    }
  }, []);

  const login = (userData: User, schoolData?: School) => {
    setUser(userData);
    setSchool(schoolData || null);
    
    localStorage.setItem('user', JSON.stringify(userData));
    if (schoolData) {
      localStorage.setItem('school', JSON.stringify(schoolData));
    } else {
      localStorage.removeItem('school');
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setSchool(null);
    localStorage.removeItem('user');
    localStorage.removeItem('school');
  };

  // Helper functions for role checks
  const isTeacher = () => user?.role === 'teacher';
  const isSchoolAdmin = () => user?.role === 'school_admin';
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isStudent = () => user?.role === 'student';

  const canEnrollStudents = () => {
    return isTeacher() || isSchoolAdmin();
  };

  const canAdmitStudents = () => {
    return isSchoolAdmin() || isSuperAdmin();
  };

  const value: AuthContextType = {
    user,
    school,
    login,
    logout,
    isAuthenticated: !!user,
    isTeacher,
    isSchoolAdmin,
    isSuperAdmin,
    isStudent,
    canEnrollStudents,
    canAdmitStudents,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};