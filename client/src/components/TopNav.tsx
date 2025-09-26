import React from 'react';
import { LayoutDashboard, CheckSquare, Users, MessageSquare, Bell, Menu, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function TopNav() {
  const linkBase = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors';
  const inactive = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  const active = 'text-blue-700 bg-blue-100';

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white/90 backdrop-blur border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button id="topnav-open-sidebar" className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center">
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900">C.A.K.E</span>
      </div>
      <div className="flex items-center gap-2">
        <NavLink to="/dashboard" end className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
          <span className="inline-flex items-center gap-1"><CheckSquare className="w-4 h-4"/>Tasks</span>
        </NavLink>
        <NavLink to="/clients" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
          <span className="inline-flex items-center gap-1"><Users className="w-4 h-4"/>Clients</span>
        </NavLink>
        <NavLink to="/users" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
          Users
        </NavLink>
        <NavLink to="/feedback" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
          <span className="inline-flex items-center gap-1"><MessageSquare className="w-4 h-4"/>Feedback</span>
        </NavLink>
        <div className="mx-3 text-slate-500 text-sm hidden md:block">
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <button className="relative w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">3</span>
        </button>
        <button id="topnav-open-rightpanel" className="ml-1 w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </nav>
  );
}


