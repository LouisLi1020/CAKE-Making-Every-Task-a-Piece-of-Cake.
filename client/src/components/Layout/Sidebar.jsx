import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      name: 'Clients',
      path: '/clients',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      name: 'Feedback',
      path: '/feedback',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  // Add Users navigation for managers
  if (user?.role === 'manager') {
    navigationItems.push({
      name: 'Users',
      path: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen shadow-xl transition-transform duration-300 ease-in-out z-50 overflow-hidden ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`} style={{ 
        width: '280px',
        background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, var(--surface-color) 100%)',
        borderRight: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-6 border-b border-gray-200 flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)'
            }}>
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>C.A.K.E.</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Task Management</span>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-6 px-4 pb-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onToggle} // Close sidebar when clicking a link
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'border'
                      : 'hover:bg-opacity-10'
                  }`}
                  style={{ 
                    color: isActive(item.path) ? 'var(--primary-color)' : 'var(--text-secondary)',
                    backgroundColor: isActive(item.path) ? 'var(--accent-color)' : 'transparent',
                    borderColor: isActive(item.path) ? 'var(--primary-color)' : 'transparent'
                  }}
                >
                  <div className={`flex-shrink-0 ${isActive(item.path) ? 'text-primary-color' : 'text-gray-400 group-hover:text-gray-500'}`} style={{
                    color: isActive(item.path) ? 'var(--primary-color)' : 'var(--text-secondary)'
                  }}>
                    {item.icon}
                  </div>
                  <span className="ml-3 flex-1">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* User Info Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200" style={{ 
          borderColor: 'var(--border-color)',
          background: 'linear-gradient(135deg, var(--background-color) 0%, var(--surface-color) 100%)'
        }}>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)'
              }}>
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
