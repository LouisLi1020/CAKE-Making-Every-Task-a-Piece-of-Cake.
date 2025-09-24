import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/UI/card';
import { Badge } from '../../components/UI/badge';
import { Progress } from '../../components/UI/progress';
import { Button } from '../../components/UI/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/UI/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/UI/tabs';
import { 
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  MessageCircle,
  Phone,
  Video,
  HelpCircle,
  Search,
  Bell,
  User
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
}

interface Project {
  id: string;
  name: string;
  completed: number;
  total: number;
  progress: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
}

interface DashboardData {
  tasks: Task[];
  projects: Project[];
  teamMembers: TeamMember[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 模擬數據，實際應該從 API 獲取
      const mockData: DashboardData = {
        tasks: [
          {
            id: '1',
            title: 'Design new dashboard layout',
            status: 'completed',
            priority: 'high',
            dueDate: '2025-08-15',
            assignee: 'Sarah Johnson'
          },
          {
            id: '2',
            title: 'Implement user authentication',
            status: 'in-progress',
            priority: 'high',
            dueDate: '2025-08-16',
            assignee: 'Mike Chen'
          },
          {
            id: '3',
            title: 'Write API documentation',
            status: 'todo',
            priority: 'medium',
            dueDate: '2025-08-18',
            assignee: 'Emma Davis'
          },
          {
            id: '4',
            title: 'Setup CI/CD pipeline',
            status: 'todo',
            priority: 'low',
            dueDate: '2025-08-20',
            assignee: 'James Wilson'
          },
          {
            id: '5',
            title: 'Review code changes',
            status: 'in-progress',
            priority: 'medium',
            dueDate: '2025-08-17',
            assignee: 'Mike Chen'
          }
        ],
        projects: [
          {
            id: '1',
            name: 'Website Redesign',
            completed: 9,
            total: 12,
            progress: 75
          },
          {
            id: '2',
            name: 'Mobile App',
            completed: 4,
            total: 8,
            progress: 50
          },
          {
            id: '3',
            name: 'API Integration',
            completed: 4,
            total: 5,
            progress: 80
          }
        ],
        teamMembers: [
          {
            id: '1',
            name: 'Sarah Johnson',
            role: 'UI Designer',
            initials: 'SJ'
          },
          {
            id: '2',
            name: 'Mike Chen',
            role: 'Frontend Developer',
            initials: 'MC'
          },
          {
            id: '3',
            name: 'Emma Davis',
            role: 'Project Manager',
            initials: 'ED'
          },
          {
            id: '4',
            name: 'James Wilson',
            role: 'Backend Developer',
            initials: 'JW'
          }
        ]
      };
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredTasks = data?.tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

    return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning, {user?.name || 'Alex'}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks, projects, or team members"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <Avatar>
              <AvatarFallback>
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Manage your current tasks</CardDescription>
              </div>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="todo">Todo</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span className="text-sm text-gray-500 capitalize">{task.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{project.name}</span>
                    <span className="text-sm text-gray-500">
                      {project.completed}/{project.total}
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Start Team Call
              </Button>
            </CardContent>
          </Card>

          {/* Boost Productivity */}
          <Card>
            <CardHeader>
              <CardTitle>Boost Productivity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Try our AI-powered task prioritization feature
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
