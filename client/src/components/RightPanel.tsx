import React from 'react';
import { MessageCircle, Phone, Video, MoreHorizontal, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface RightPanelProps {
  onClose?: () => void;
}

export function RightPanel({ onClose }: RightPanelProps) {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'UI Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face',
      status: 'online',
      initials: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Frontend Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      status: 'online',
      initials: 'MC'
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Project Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      status: 'away',
      initials: 'ED'
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Backend Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      status: 'offline',
      initials: 'JW'
    },
  ];

  const recentMessages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Hey, I finished the new mockups. Can you review them?',
      time: '2 min ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=32&h=32&fit=crop&crop=face',
      initials: 'SJ'
    },
    {
      id: 2,
      sender: 'Mike Chen',
      message: 'The API integration is ready for testing',
      time: '15 min ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      initials: 'MC'
    },
    {
      id: 3,
      sender: 'Emma Davis',
      message: 'Team meeting at 3 PM today. Don\'t forget!',
      time: '1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      initials: 'ED'
    },
    {
      id: 4,
      sender: 'James Wilson',
      message: 'Database optimization is complete',
      time: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      initials: 'JW'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 overflow-y-auto shadow-lg h-full">
      {/* Close Button - Only visible on mobile */}
      {onClose && (
        <div className="flex justify-end mb-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>
      )}
      <div className="space-y-6">
        {/* Team Members */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-700 shadow-md">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-700 shadow-sm ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30">
                    <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4 h-12 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-slate-700 dark:text-slate-300">
              <Video className="w-5 h-5 mr-2" />
              Start Team Call
            </Button>
          </CardContent>
        </Card>

        {/* Ad Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Boost Productivity</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Try our AI-powered task prioritization feature
              </p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Messages</CardTitle>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
              <MoreHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 cursor-pointer">
                <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-md">
                  <AvatarImage src={message.avatar} alt={message.sender} />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">{message.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{message.sender}</p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{message.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{message.message}</p>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4 h-12 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-slate-700 dark:text-slate-300">
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}