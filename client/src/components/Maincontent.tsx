import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TaskChart } from './TaskChart';

export function MainContent() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design new dashboard layout', status: 'completed', priority: 'high', dueDate: '2025-08-15' },
    { id: 2, title: 'Implement user authentication', status: 'in-progress', priority: 'high', dueDate: '2025-08-16' },
    { id: 3, title: 'Write API documentation', status: 'todo', priority: 'medium', dueDate: '2025-08-18' },
    { id: 4, title: 'Setup CI/CD pipeline', status: 'todo', priority: 'low', dueDate: '2025-08-20' },
    { id: 5, title: 'Review code changes', status: 'in-progress', priority: 'medium', dueDate: '2025-08-17' },
  ]);

  const projects = [
    { name: 'Website Redesign', progress: 75, tasks: 12, completed: 9 },
    { name: 'Mobile App', progress: 45, tasks: 8, completed: 4 },
    { name: 'API Integration', progress: 90, tasks: 5, completed: 4 },
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' }
        : task
    ));
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
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;

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
                    <TabsTrigger value="todo">Todo</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className="hover:scale-110 transition-transform duration-200"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          <div>
                            <p className={`font-semibold text-slate-900 dark:text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Due: {task.dueDate}</p>
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
                  
                  {['todo', 'in-progress', 'completed'].map(status => (
                    <TabsContent key={status} value={status} className="space-y-3">
                      {tasks.filter(task => task.status === status).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className="hover:scale-110 transition-transform duration-200"
                            >
                              {getStatusIcon(task.status)}
                            </button>
                            <div>
                              <p className={`font-semibold text-slate-900 dark:text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Due: {task.dueDate}</p>
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