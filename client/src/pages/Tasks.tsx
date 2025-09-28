import React, { useEffect, useState } from 'react';
import { tasksAPI, clientsAPI, usersAPI } from '../services/api';
import { Task, Client, User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Edit, Trash2, Plus, Calendar, User as UserIcon, DollarSign, Clock, Users, Hash, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    clientId: '',
    assigneeIds: [] as string[],
    priority: 'medium',
    status: 'pending',
    estimateHours: 0,
    revenue: 0
  });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter && priorityFilter !== 'all') params.priority = priorityFilter;
      
      const data = await tasksAPI.getAll(params);
      const list = Array.isArray(data) ? data : (data?.tasks || data?.data || []);
      setTasks(list as unknown as Task[]);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(Array.isArray(data) ? data : (data?.clients || data?.data || []));
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(Array.isArray(data) ? data : (data?.users || data?.data || []));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => { 
    loadTasks();
    loadClients();
    loadUsers();
  }, [searchTerm, statusFilter, priorityFilter]);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      clientId: '',
      assigneeIds: [],
      priority: 'medium',
      status: 'pending',
      estimateHours: 0,
      revenue: 0
    });
  };

  const handleCreate = async () => {
    try {
      await tasksAPI.create(form);
      setIsCreateOpen(false);
      resetForm();
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      clientId: typeof task.clientId === 'string' ? task.clientId : task.clientId._id,
      assigneeIds: Array.isArray(task.assigneeIds) ? task.assigneeIds.map(id => typeof id === 'string' ? id : id._id) : [],
      priority: task.priority,
      status: task.status,
      estimateHours: task.estimateHours,
      revenue: task.revenue
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTask) return;
    try {
      await tasksAPI.update(editingTask._id, form);
      setIsEditOpen(false);
      setEditingTask(null);
      resetForm();
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const canAssignTasks = () => {
    return user?.role === 'manager' || user?.role === 'leader';
  };

  const handleAssigneeChange = (userId: string, checked: boolean) => {
    if (checked) {
      setForm({ ...form, assigneeIds: [...form.assigneeIds, userId] });
    } else {
      setForm({ ...form, assigneeIds: form.assigneeIds.filter(id => id !== userId) });
    }
  };

  const addAssignee = (userId: string) => {
    if (!form.assigneeIds.includes(userId)) {
      setForm({ ...form, assigneeIds: [...form.assigneeIds, userId] });
    }
    setAssigneeSearch('');
  };

  const removeAssignee = (userId: string) => {
    setForm({ ...form, assigneeIds: form.assigneeIds.filter(id => id !== userId) });
  };

  const getFilteredUsers = () => {
    return users.filter(user => 
      user.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(assigneeSearch.toLowerCase())
    );
  };

  const getSelectedUsers = () => {
    return users.filter(user => form.assigneeIds.includes(user._id));
  };

  const getAssigneeNames = (task: Task) => {
    if (!Array.isArray(task.assigneeIds) || task.assigneeIds.length === 0) {
      return 'Unassigned';
    }
    
    const names = task.assigneeIds.map(assignee => {
      if (typeof assignee === 'string') {
        const user = users.find(u => u._id === assignee);
        return user ? user.name : 'Unknown';
      } else {
        return assignee.name || 'Unknown';
      }
    });
    
    return names.join(', ');
  };

  const getCreatorName = (task: Task) => {
    if (typeof task.createdBy === 'object') {
      return task.createdBy.name || task.createdBy.email;
    }
    const user = users.find(u => u._id === task.createdBy);
    return user ? (user.name || user.email) : 'Unknown';
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredTasks = () => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case 'taskNumber':
            aValue = a.taskNumber;
            bValue = b.taskNumber;
            break;
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'priority':
            aValue = a.priority;
            bValue = b.priority;
            break;
          case 'estimateHours':
            aValue = a.estimateHours;
            bValue = b.estimateHours;
            break;
          case 'revenue':
            aValue = a.revenue;
            bValue = b.revenue;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tasks</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and track your tasks</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Create Button */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a new task and assign it to team members.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
                  <Input 
                    placeholder="Task title" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label>
                  <Textarea 
                    placeholder="Task description" 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Client *</label>
                    <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                    <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Hours</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={form.estimateHours} 
                      onChange={(e) => setForm({ ...form, estimateHours: Number(e.target.value) })} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={form.revenue} 
                      onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })} 
                    />
                  </div>
                </div>
                
                {canAssignTasks() && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Assign to</label>
                    
                    {/* Selected Assignees */}
                    {getSelectedUsers().length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getSelectedUsers().map((user) => (
                          <div key={user._id} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-sm">
                            <span>{user.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAssignee(user._id)}
                              className="hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Search and Add Assignee */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder="Search users to assign..."
                          value={assigneeSearch}
                          onChange={(e) => setAssigneeSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      {assigneeSearch && (
                        <div className="max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                          {getFilteredUsers()
                            .filter(user => !form.assigneeIds.includes(user._id))
                            .map((user) => (
                            <button
                              key={user._id}
                              type="button"
                              onClick={() => addAssignee(user._id)}
                              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2"
                            >
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-slate-500 dark:text-slate-400 text-xs">
                                  {user.email} • {user.role}
                                </div>
                              </div>
                            </button>
                          ))}
                          {getFilteredUsers().filter(user => !form.assigneeIds.includes(user._id)).length === 0 && (
                            <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                              No users found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={!form.title || !form.description || !form.clientId}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tasks List */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500 dark:text-slate-400">Loading tasks...</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No tasks found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchTerm || (statusFilter && statusFilter !== 'all') || (priorityFilter && priorityFilter !== 'all')
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first task'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('taskNumber')}
                    >
                      <div className="flex items-center gap-2">
                        Task #
                        {getSortIcon('taskNumber')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-2">
                        Title
                        {getSortIcon('title')}
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center gap-2">
                        Priority
                        {getSortIcon('priority')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('estimateHours')}
                    >
                      <div className="flex items-center gap-2">
                        Est. Hours
                        {getSortIcon('estimateHours')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('revenue')}
                    >
                      <div className="flex items-center gap-2">
                        Revenue
                        {getSortIcon('revenue')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        Created
                        {getSortIcon('createdAt')}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedAndFilteredTasks().map((task) => (
                    <TableRow key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {task.taskNumber}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-48 truncate" title={task.title}>
                          {task.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-64 truncate text-sm text-slate-600 dark:text-slate-400" title={task.description}>
                          {task.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3 text-slate-400" />
                          <span className="text-sm">{getCreatorName(task)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span className="text-sm max-w-24 truncate" title={getAssigneeNames(task)}>
                            {getAssigneeNames(task)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.estimateHours > 0 ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3" />
                            {task.estimateHours}h
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.revenue > 0 ? (
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="w-3 h-3" />
                            ${task.revenue}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(task)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(task._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details and assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
              <Input 
                placeholder="Task title" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label>
              <Textarea 
                placeholder="Task description" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Hours</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={form.estimateHours} 
                  onChange={(e) => setForm({ ...form, estimateHours: Number(e.target.value) })} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={form.revenue} 
                  onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })} 
                />
              </div>
            </div>
            
            {canAssignTasks() && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Assign to</label>
                
                {/* Selected Assignees */}
                {getSelectedUsers().length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getSelectedUsers().map((user) => (
                      <div key={user._id} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-sm">
                        <span>{user.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAssignee(user._id)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Search and Add Assignee */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search users to assign..."
                      value={assigneeSearch}
                      onChange={(e) => setAssigneeSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {assigneeSearch && (
                    <div className="max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                      {getFilteredUsers()
                        .filter(user => !form.assigneeIds.includes(user._id))
                        .map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => addAssignee(user._id)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2"
                        >
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs">
                              {user.email} • {user.role}
                            </div>
                          </div>
                        </button>
                      ))}
                      {getFilteredUsers().filter(user => !form.assigneeIds.includes(user._id)).length === 0 && (
                        <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                          No users found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!form.title || !form.description}>
                Update Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


