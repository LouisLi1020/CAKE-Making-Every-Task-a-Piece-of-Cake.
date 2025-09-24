import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { RightPanel } from './RightPanel';

export function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        inset-y-0 left-0 z-50
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onRightPanelClick={() => setRightPanelOpen(true)}
        />
        <div className="flex flex-1 overflow-hidden">
          <MainContent />
          
          {/* Right Panel */}
          <div className={`
            ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:translate-x-0 lg:block
            fixed lg:static
            inset-y-0 right-0 z-50
            transition-transform duration-300 ease-in-out
            ${rightPanelOpen ? 'block' : 'hidden lg:block'}
            h-full
          `}>
            <RightPanel onClose={() => setRightPanelOpen(false)} />
          </div>

          {/* Mobile Right Panel Overlay */}
          {rightPanelOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setRightPanelOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}