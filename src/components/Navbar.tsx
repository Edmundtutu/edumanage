import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut, 
  GraduationCap,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, school, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const notifications = [
    { id: 1, title: 'New material uploaded', time: '5 min ago', unread: true },
    { id: 2, title: 'Course assignment due', time: '1 hour ago', unread: true },
    { id: 3, title: 'Grade posted', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="navbar-enhanced">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="navbar-mobile-toggle lg:hidden"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="navbar-logo">
            <GraduationCap className="h-8 w-8 text-company-primary" />
            <span className="navbar-logo-text">Educate</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search courses, materials, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Messages */}
          <button className="navbar-action-btn">
            <MessageSquare className="h-5 w-5" />
            <span className="navbar-badge">0</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="navbar-action-btn"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="navbar-badge">{unreadCount}</span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3 className="notifications-title">Notifications</h3>
                  <button className="notifications-mark-read">Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <div className="notification-content">
                        <p className="notification-title">{notification.title}</p>
                        <p className="notification-time">{notification.time}</p>
                      </div>
                      {notification.unread && <div className="notification-dot"></div>}
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <button className="notifications-view-all">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="navbar-action-btn">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="navbar-user-btn"
            >
              <div className="user-avatar">
                <User className="h-5 w-5" />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role.replace('_', ' ')}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="user-dropdown-name">{user?.name}</p>
                    <p className="user-dropdown-email">{user?.email}</p>
                    {school && (
                      <p className="user-dropdown-school">{school.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="user-dropdown-divider"></div>
                
                <div className="user-dropdown-menu">
                  <button className="user-dropdown-item">
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="user-dropdown-item">
                    <Settings className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>
                </div>
                
                <div className="user-dropdown-divider"></div>
                
                <button
                  onClick={handleLogout}
                  className="user-dropdown-logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay lg:hidden">
          <div className="mobile-search">
            <form onSubmit={handleSearch}>
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>
          
          <div className="mobile-actions">
            <button className="mobile-action-item">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
              <span className="navbar-badge">3</span>
            </button>
            <button className="mobile-action-item">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}
            </button>
            <button className="mobile-action-item">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;