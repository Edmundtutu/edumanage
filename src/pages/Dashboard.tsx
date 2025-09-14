import React from 'react';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard';
import SchoolAdminDashboard from '../components/dashboards/SchoolAdminDashboard';
import TeacherDashboard from '../components/dashboards/TeacherDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'school_admin':
        return <SchoolAdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;