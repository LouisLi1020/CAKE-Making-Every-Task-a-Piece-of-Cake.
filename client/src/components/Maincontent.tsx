import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Clock, AlertCircle, Hash, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TaskChart } from './TaskChart';
import { tasksAPI, clientsAPI, usersAPI } from '../services/api';
import { Task, Client, User } from '../types';

export function MainContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, clientsData, usersData] = await Promise.all([
          tasksAPI.getAll(),
          clientsAPI.getAll(),
          usersAPI.getAll()
        ]);
        
        // Normalize data (handle both array and object with property)
        const normalizedTasks = Array.isArray(tasksData) ? tasksData : (tasksData.tasks || tasksData.data || []);
        const normalizedClients = Array.isArray(clientsData) ? clientsData : (clientsData.clients || clientsData.data || []);
        const normalizedUsers = Array.isArray(usersData) ? usersData : (usersData.users || usersData.data || []);
        
        setTasks(normalizedTasks);
        setClients(normalizedClients);
        setUsers(normalizedUsers);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await tasksAPI.update(taskId, { status: newStatus });
      
      // Update local state
      setTasks(tasks.map(t => 
        t._id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Calculate project statistics from real data
  const getProjectStats = () => {
    if (!Array.isArray(clients) || !Array.isArray(tasks)) {
      return [];
    }
    
    const clientStats = clients.map(client => {
      const clientTasks = tasks.filter(task => 
        typeof task.clientId === 'object' ? task.clientId._id === client._id : task.clientId === client._id
      );
      const completedTasks = clientTasks.filter(task => task.status === 'completed');
      const progress = clientTasks.length > 0 ? Math.round((completedTasks.length / clientTasks.length) * 100) : 0;
      
      return {
        name: client.name,
        progress,
        tasks: clientTasks.length,
        completed: completedTasks.length
      };
    });

    return clientStats;
  };

  const getAssigneeNames = (task: Task) => {
    if (!Array.isArray(task.assigneeIds) || task.assigneeIds.length === 0) {
      return 'Unassigned';
    }
    
    const assigneeNames = task.assigneeIds.map(assignee => {
      if (typeof assignee === 'object') {
        return assignee.name || assignee.email;
      }
      const user = users.find(u => u._id === assignee);
      return user ? (user.name || user.email) : 'Unknown';
    });
    
    return assigneeNames.join(', ');
  };

  const getCreatorName = (task: Task) => {
    if (typeof task.createdBy === 'object') {
      return task.createdBy.name || task.createdBy.email;
    }
    const user = users.find(u => u._id === task.createdBy);
    return user ? (user.name || user.email) : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'pending').length;
  const projects = getProjectStats();

  return (
    <main className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{inProgressTasks}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{todoTasks}</p>
                </div>
                <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Circle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Tasks</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleTask(task._id)}
                            className="hover:scale-110 transition-transform duration-200"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Hash className="w-3 h-3 text-slate-400" />
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {task.taskNumber}
                              </span>
                            </div>
                            <p className={`font-semibold text-slate-900 dark:text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <span>
                                {typeof task.clientId === 'object' ? task.clientId.name : 
                                 clients.find(c => c._id === task.clientId)?.name || 'Unknown Client'}
                              </span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{getAssigneeNames(task)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} shadow-sm`} />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  {['pending', 'in-progress', 'completed'].map(status => (
                    <TabsContent key={status} value={status} className="space-y-3">
                      {tasks.filter(task => task.status === status).map((task) => (
                        <div key={task._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleTask(task._id)}
                              className="hover:scale-110 transition-transform duration-200"
                            >
                              {getStatusIcon(task.status)}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Hash className="w-3 h-3 text-slate-400" />
                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                  {task.taskNumber}
                                </span>
                              </div>
                              <p className={`font-semibold text-slate-900 dark:text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>
                                  {typeof task.clientId === 'object' ? task.clientId.name : 
                                   clients.find(c => c._id === task.clientId)?.name || 'Unknown Client'}
                                </span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{getAssigneeNames(task)}</span>
                                </div>
                                <span>•</span>
                                <span>
                                  Created by {getCreatorName(task)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} shadow-sm`} />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Active Projects */}
          <div>
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Active Projects</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{project.name}</h4>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">
                        {project.completed}/{project.tasks}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={project.progress} 
                        className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                      />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{project.progress}% completed</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chart Section */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Task Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TaskChart />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}