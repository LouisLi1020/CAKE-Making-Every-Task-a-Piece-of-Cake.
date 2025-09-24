import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, MessageSquare } from 'lucide-react';
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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Button>

        {/* Date and Time */}
        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
            Good morning, {user?.name || 'User'}!
          </h1>
          <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium truncate">{formatDate(currentTime)}</span>
            <span className="font-medium">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Search Bar and Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="relative w-60 lg:w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search tasks, projects, or team members..."
              className="pl-12 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Button>

          {/* Messages Button - Hidden on desktop */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onRightPanelClick}
          >
            <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full shadow-lg">
              3
            </Badge>
          </Button>

          {/* User Avatar */}
          <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-slate-200 dark:border-slate-700 shadow-md">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User Avatar" />
            <AvatarFallback className="bg-blue-500 text-white font-semibold text-xs lg:text-sm">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}