import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Book, 
  Upload, 
  Users, 
  GraduationCap, 
  Settings, 
  Menu,
  X,
  LogOut,
  UserCog,
  Building2,
  UserPlus,
  FileText,
  BookOpen,
  UserCheck,
  MessageCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getRoleNavItems = () => {
    if (!user) return [];

    const items = [
      { to: '/dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user.role) {
      case 'super_admin':
        items.push(
          { to: '/chat', label: 'Messages', icon: MessageCircle },
          { to: '/schools', label: 'Schools', icon: Building2 },
          { to: '/admin/create-school', label: 'Create School', icon: Settings }
        );
        break;
      case 'school_admin':
        items.push(
          { to: '/chat', label: 'Messages', icon: MessageCircle },
          { to: '/courses', label: 'Courses', icon: Book },
          { to: '/admin/manage-users', label: 'Manage Users', icon: UserCog },
          { to: '/admin/create-user', label: 'Add Staff', icon: UserCheck },
          { to: '/admin/admit-student', label: 'Admit Student', icon: UserPlus },
          { to: '/admin/bulk-admit', label: 'Bulk Admit', icon: GraduationCap }
        );
        break;
      case 'teacher':
        items.push(
          { to: '/chat', label: 'Messages', icon: MessageCircle },
          { to: '/courses', label: 'My Courses', icon: Book },
          { to: '/materials/upload', label: 'Upload Material', icon: Upload }
        );
        break;
      case 'student':
        items.push(
          { to: '/chat', label: 'Messages', icon: MessageCircle },
          { to: '/student/enrollments', label: 'My Enrollments', icon: UserPlus },
          { to: '/courses', label: 'Courses', icon: Book },
          { to: '/materials', label: 'Materials', icon: FileText }
        );
        break;
    }

    return items;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed top-16 inset-x-0 bottom-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] dashboard-sidebar z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:fixed lg:z-auto
        w-64 border-r border-gray-200 overflow-hidden
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 pt-4 overflow-y-auto custom-scrollbar">
            {getRoleNavItems().map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`
                  nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(item.to) 
                    ? 'nav-link-active' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;