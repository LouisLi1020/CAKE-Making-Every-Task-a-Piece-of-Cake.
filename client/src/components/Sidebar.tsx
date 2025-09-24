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
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card } from './ui/card';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onClose?: () => void;
}

export function Sidebar({ darkMode, setDarkMode, onClose }: SidebarProps) {
  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: CheckSquare, label: 'Tasks', active: false },
    { icon: Users, label: 'Clients', active: false },
    { icon: User, label: 'Users', active: false },
    { icon: MessageSquare, label: 'Feedback', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">C.A.K.E</span>
          </div>
          {/* Close Button - Only visible on mobile */}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Button>
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