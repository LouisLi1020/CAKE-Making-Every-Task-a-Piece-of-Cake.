import React, { useState, useEffect } from 'react';
import { Search, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
  onRightPanelClick?: () => void;
}

export function Header({ onMenuClick, onRightPanelClick }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-2 sticky top-16 z-40 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Button>

        {/* Greeting */}
        <h1 className="flex-1 min-w-0 text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
          Good morning, {user?.name || 'User'}! — {formatDate(currentTime)} {formatTime(currentTime)}
        </h1>

        {/* Search Bar (compact) */}
        <div className="relative w-56 lg:w-72 hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tasks, projects, members..."
            className="pl-10 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}