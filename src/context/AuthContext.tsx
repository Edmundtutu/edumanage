import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, School, AuthContextType } from '../types';
import { apiService } from '../services/api';

const AUTH_USER_KEY = 'edumanage_user';
const AUTH_SCHOOL_KEY = 'edumanage_school';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if we have a token and validate it
    const bootstrap = async () => {
      const token = apiService.getToken();
      if (!token) {
        // Try to restore user/school from localStorage (fallback)
        const rawUser = localStorage.getItem(AUTH_USER_KEY);
        const rawSchool = localStorage.getItem(AUTH_SCHOOL_KEY);
        if (rawUser) {
          try {
            setUser(JSON.parse(rawUser));
          } catch {
            localStorage.removeItem(AUTH_USER_KEY);
          }
        }
        if (rawSchool) {
          try {
            setSchool(JSON.parse(rawSchool));
          } catch {
            localStorage.removeItem(AUTH_SCHOOL_KEY);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const res = await apiService.getCurrentUser();
        setUser(res.user);
        setSchool(res.school);
      } catch (e) {
        // Token invalid/expired - clear everything
        apiService.removeToken();
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_SCHOOL_KEY);
        setUser(null);
        setSchool(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = (userData: User, schoolData?: School) => {
    setUser(userData);
    setSchool(schoolData || null);
    // Persist user & school locally so we have a fallback before bootstrap completes
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      if (schoolData) {
        localStorage.setItem(AUTH_SCHOOL_KEY, JSON.stringify(schoolData));
      } else {
        localStorage.removeItem(AUTH_SCHOOL_KEY);
      }
    } catch (e) {
      // ignore storage errors
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
    apiService.removeToken();
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_SCHOOL_KEY);
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
    loading,
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