import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300`} style={{
      background: 'linear-gradient(135deg, var(--background-color) 0%, var(--surface-color) 100%)',
      color: 'var(--text-primary)'
    }}>
      {/* Sidebar Overlay */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main Content Area - Full width */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <Header 
          onThemeToggle={toggleTheme} 
          isDarkMode={isDarkMode}
          onSidebarToggle={toggleSidebar}
        />
        
        {/* Main Content */}
        <main className={`flex-1 w-full transition-colors duration-300`} style={{
          background: 'linear-gradient(135deg, var(--background-color) 0%, var(--surface-color) 100%)'
        }}>
          <div className="w-full max-w-7xl mx-auto px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
