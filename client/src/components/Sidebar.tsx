import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  User, 
  MessageSquare, 
  Settings, 
  Sun, 
  Moon,
  X,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onClose?: () => void;
}

export function Sidebar({ darkMode, setDarkMode, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', to: '/tasks' },
    { icon: Users, label: 'Clients', to: '/clients' },
    { icon: User, label: 'Users', to: '/users' },
    { icon: MessageSquare, label: 'Feedback', to: '/feedback' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-lg min-h-[calc(100vh-4.5rem)]">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Navigation</span>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </Button>
        )}
      </div>

      {/* User */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@cake.dev'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink key={item.label} to={item.to} end>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>

        {/* Ad Section */}
        <Card className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-lg">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Upgrade to Pro</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Get unlimited tasks and advanced analytics
          </p>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            Upgrade Now
          </Button>
        </Card>
      </div>
    </div>
  );
}