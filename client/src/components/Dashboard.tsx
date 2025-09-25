import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import TopNav from './TopNav';
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

  // handlers from topnav buttons
  useEffect(() => {
    const openSidebarBtn = document.getElementById('topnav-open-sidebar');
    const openRightBtn = document.getElementById('topnav-open-rightpanel');
    const openSidebar = () => setSidebarOpen(prev => !prev);
    const openRight = () => setRightPanelOpen(prev => !prev);
    openSidebarBtn?.addEventListener('click', openSidebar);
    openRightBtn?.addEventListener('click', openRight);
    return () => {
      openSidebarBtn?.removeEventListener('click', openSidebar);
      openRightBtn?.removeEventListener('click', openRight);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TopNav />
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        onRightPanelClick={() => setRightPanelOpen(true)}
      />
      <div className="flex items-stretch">
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
          fixed top-16 bottom-0 left-0 z-50 w-64 overflow-y-auto
          transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl
        `}>
          <Sidebar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content + Right Panel */}
        <div className="flex flex-1 overflow-visible min-w-0">
          <MainContent />

          {/* Right Panel */}
          <div className={`
            ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full'}
            fixed top-16 bottom-0 right-0 z-50 w-80 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl
            transition-transform duration-300 ease-in-out
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