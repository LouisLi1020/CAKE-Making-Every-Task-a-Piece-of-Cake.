import React from 'react';
import { Header } from './Header';
import { MainContent } from './MainContent';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <MainContent />
    </div>
  );
}