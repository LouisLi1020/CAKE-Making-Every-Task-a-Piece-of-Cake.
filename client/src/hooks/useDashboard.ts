import { useState, useEffect } from 'react';
import { DashboardData, Task, Project, User } from '../types';
import api from '../services/api';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockData: DashboardData = {
        stats: {
          totalTasks: 24,
          completedTasks: 12,
          inProgressTasks: 8,
          pendingTasks: 4,
          totalProjects: 6,
          activeProjects: 4,
          totalClients: 8,
          totalUsers: 12,
        },
        recentTasks: [
          {
            _id: '1',
            title: 'Design new dashboard layout',
            description: 'Create a modern and responsive dashboard design',
            status: 'completed',
            priority: 'high',
            dueDate: '2025-08-15',
            createdAt: '2025-08-10T10:00:00Z',
            updatedAt: '2025-08-15T15:30:00Z',
          },
          {
            _id: '2',
            title: 'Implement user authentication',
            description: 'Set up JWT authentication with role-based access',
            status: 'in-progress',
            priority: 'high',
            dueDate: '2025-08-16',
            createdAt: '2025-08-11T09:00:00Z',
            updatedAt: '2025-08-14T16:45:00Z',
          },
          {
            _id: '3',
            title: 'Write API documentation',
            description: 'Document all API endpoints with examples',
            status: 'todo',
            priority: 'medium',
            dueDate: '2025-08-18',
            createdAt: '2025-08-12T14:00:00Z',
            updatedAt: '2025-08-12T14:00:00Z',
          },
          {
            _id: '4',
            title: 'Setup CI/CD pipeline',
            description: 'Configure automated testing and deployment',
            status: 'todo',
            priority: 'low',
            dueDate: '2025-08-20',
            createdAt: '2025-08-13T11:00:00Z',
            updatedAt: '2025-08-13T11:00:00Z',
          },
          {
            _id: '5',
            title: 'Review code changes',
            description: 'Perform code review for recent pull requests',
            status: 'in-progress',
            priority: 'medium',
            dueDate: '2025-08-17',
            createdAt: '2025-08-14T13:00:00Z',
            updatedAt: '2025-08-15T10:20:00Z',
          },
        ],
        activeProjects: [
          {
            _id: '1',
            name: 'Website Redesign',
            description: 'Complete overhaul of the company website with modern design and improved UX',
            status: 'active',
            progress: 75,
            startDate: '2025-07-01',
            endDate: '2025-09-30',
            team: [],
            tasks: [],
            createdAt: '2025-07-01T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
          {
            _id: '2',
            name: 'Mobile App Development',
            description: 'Native mobile application for iOS and Android platforms',
            status: 'active',
            progress: 45,
            startDate: '2025-08-01',
            endDate: '2025-12-31',
            team: [],
            tasks: [],
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
          {
            _id: '3',
            name: 'API Integration',
            description: 'Integration with third-party APIs for enhanced functionality',
            status: 'active',
            progress: 90,
            startDate: '2025-07-15',
            endDate: '2025-08-31',
            team: [],
            tasks: [],
            createdAt: '2025-07-15T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
        ],
        teamMembers: [
          {
            _id: '1',
            username: 'alex.smith',
            email: 'alex@example.com',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            firstName: 'Alex',
            lastName: 'Smith',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
          {
            _id: '2',
            username: 'sarah.johnson',
            email: 'sarah@example.com',
            role: 'manager',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            firstName: 'Sarah',
            lastName: 'Johnson',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
          {
            _id: '3',
            username: 'mike.chen',
            email: 'mike@example.com',
            role: 'user',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            firstName: 'Mike',
            lastName: 'Chen',
            createdAt: '2025-02-01T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
          {
            _id: '4',
            username: 'emma.wilson',
            email: 'emma@example.com',
            role: 'user',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            firstName: 'Emma',
            lastName: 'Wilson',
            createdAt: '2025-02-15T00:00:00Z',
            updatedAt: '2025-08-15T00:00:00Z',
          },
        ],
        upcomingDeadlines: [],
        recentActivity: [],
      };

      setData(mockData);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      // Mock API call - replace with actual implementation
      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          recentTasks: prevData.recentTasks.map(task =>
            task._id === taskId ? { ...task, status } : task
          ),
          stats: {
            ...prevData.stats,
            completedTasks: status === 'completed' 
              ? prevData.stats.completedTasks + 1 
              : prevData.stats.completedTasks - 1,
            inProgressTasks: status === 'in-progress' 
              ? prevData.stats.inProgressTasks + 1 
              : prevData.stats.inProgressTasks - 1,
            pendingTasks: status === 'todo' 
              ? prevData.stats.pendingTasks + 1 
              : prevData.stats.pendingTasks - 1,
          }
        };
      });
    } catch (err) {
      console.error('Task status update error:', err);
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    try {
      const newTask: Task = {
        _id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          recentTasks: [newTask, ...prevData.recentTasks],
          stats: {
            ...prevData.stats,
            totalTasks: prevData.stats.totalTasks + 1,
            pendingTasks: prevData.stats.pendingTasks + 1,
          }
        };
      });
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
    updateTaskStatus,
    addTask,
  };
};
