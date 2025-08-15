import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onThemeToggle, isDarkMode, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 z-10" style={{ 
      background: 'linear-gradient(135deg, var(--header-bg) 0%, var(--surface-color) 100%)',
      borderColor: 'var(--border-color)'
    }}>
      <div className="flex items-center justify-between h-14 px-6">
        {/* Left side - Hamburger menu and page title */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name}!
          </h1>
        </div>

        {/* Right side - Profile and Theme controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)'
              }}>
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{user?.role}</p>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50 border" style={{
                background: 'linear-gradient(135deg, var(--surface-color) 0%, var(--card-bg) 100%)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 10px 25px var(--shadow-color)'
              }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    // TODO: Navigate to profile page
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm hover:bg-opacity-10 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile Settings</span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    // TODO: Navigate to account settings
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm hover:bg-opacity-10 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Account Settings</span>
                  </div>
                </button>
                
                <div className="border-t mt-2" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
