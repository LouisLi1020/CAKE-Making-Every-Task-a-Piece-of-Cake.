import React, { useState, useEffect } from 'react';
import TopNav from './TopNav';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
      {children}
      
      {/* Sidebar Drawer */}
      <div className={`fixed top-16 bottom-0 left-0 z-50 w-64 overflow-y-auto transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Right Panel Drawer */}
      <div className={`fixed top-16 bottom-0 right-0 z-50 w-80 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl transition-transform duration-300 ease-in-out ${
        rightPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <RightPanel onClose={() => setRightPanelOpen(false)} />
      </div>
    </div>
  );
}
