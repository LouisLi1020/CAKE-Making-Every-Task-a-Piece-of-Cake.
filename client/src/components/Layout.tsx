import React from 'react';
import TopNav from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      {children}
    </div>
  );
}
