import React, { useEffect, useState } from 'react';
import { feedbackAPI, tasksAPI, clientsAPI } from '../services/api';
import { FeedbackItem, Task, Client } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Edit, Trash2, Plus, MessageSquare, Star, ArrowUpDown, ArrowUp, ArrowDown, Hash, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Feedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'feature' as 'bug' | 'feature' | 'improvement' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'open' as 'open' | 'in-progress' | 'resolved' | 'closed',
    taskId: '',
    clientId: '',
    score: 5
  });

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [feedbackData, tasksData, clientsData] = await Promise.all([
          feedbackAPI.getAll(),
          tasksAPI.getAll(),
          clientsAPI.getAll()
        ]);
        
        const normalizedFeedback = Array.isArray(feedbackData) ? feedbackData : (feedbackData.feedback || feedbackData.data || []);
        const normalizedTasks = Array.isArray(tasksData) ? tasksData : (tasksData.tasks || tasksData.data || []);
        const normalizedClients = Array.isArray(clientsData) ? clientsData : (clientsData.clients || clientsData.data || []);
        
        setFeedback(normalizedFeedback);
        setTasks(normalizedTasks);
        setClients(normalizedClients);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      type: 'feature',
      priority: 'medium',
      status: 'open',
      taskId: '',
      clientId: '',
      score: 5
    });
  };

  const handleCreate = async () => {
    try {
      await feedbackAPI.create(form);
      setIsCreateOpen(false);
      resetForm();
      // Reload feedback
      const data = await feedbackAPI.getAll();
      const normalizedFeedback = Array.isArray(data) ? data : (data.feedback || data.data || []);
      setFeedback(normalizedFeedback);
    } catch (error) {
      console.error('Error creating feedback:', error);
    }
  };

  const handleEdit = (feedbackItem: FeedbackItem) => {
    setEditingFeedback(feedbackItem);
    setForm({
      title: feedbackItem.title,
      description: feedbackItem.description,
      type: feedbackItem.type,
      priority: feedbackItem.priority,
      status: feedbackItem.status,
      taskId: typeof feedbackItem.taskId === 'string' ? feedbackItem.taskId : feedbackItem.taskId._id,
      clientId: typeof feedbackItem.clientId === 'string' ? feedbackItem.clientId : feedbackItem.clientId._id,
      score: feedbackItem.score
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingFeedback) return;
    try {
      await feedbackAPI.update(editingFeedback._id, form);
      setIsEditOpen(false);
      setEditingFeedback(null);
      resetForm();
      // Reload feedback
      const data = await feedbackAPI.getAll();
      const normalizedFeedback = Array.isArray(data) ? data : (data.feedback || data.data || []);
      setFeedback(normalizedFeedback);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await feedbackAPI.delete(feedbackId);
      // Reload feedback
      const data = await feedbackAPI.getAll();
      const normalizedFeedback = Array.isArray(data) ? data : (data.feedback || data.data || []);
      setFeedback(normalizedFeedback);
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredFeedback = () => {
    let filtered = feedback.filter(item => {
      if (!item) return false;
      
      const matchesSearch = (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          case 'priority':
            aValue = a.priority;
            bValue = b.priority;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'score':
            aValue = a.score;
            bValue = b.score;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-500';
      case 'feature':
        return 'bg-blue-500';
      case 'improvement':
        return 'bg-green-500';
      case 'other':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskName = (taskId: string | Task | undefined) => {
    if (!taskId) return 'No Task';
    if (typeof taskId === 'string') {
      const task = tasks.find(t => t._id === taskId);
      return task ? task.taskNumber : 'Unknown Task';
    }
    return taskId.taskNumber || 'Unknown Task';
  };

  const getClientName = (clientId: string | Client | undefined) => {
    if (!clientId) return 'No Client';
    if (typeof clientId === 'string') {
      const client = clients.find(c => c._id === clientId);
      return client ? client.name : 'Unknown Client';
    }
    return clientId.name || 'Unknown Client';
  };

  const canManageFeedback = () => {
    return user?.role === 'manager' || user?.role === 'leader';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Feedback</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage client feedback and feature requests</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="improvement">Improvement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {canManageFeedback() && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Feedback</DialogTitle>
                  <DialogDescription>
                    Add new feedback or feature request.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
                    <Input 
                      placeholder="Feedback title" 
                      value={form.title} 
                      onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                    <Textarea 
                      placeholder="Detailed description..." 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'bug' | 'feature' | 'improvement' | 'other' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="improvement">Improvement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                      <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as 'low' | 'medium' | 'high' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Related Task</label>
                      <Select value={form.taskId} onValueChange={(v) => setForm({ ...form, taskId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Task</SelectItem>
                          {tasks.map(task => (
                            <SelectItem key={task._id} value={task._id}>
                              {task.taskNumber} - {task.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Client</label>
                      <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Client</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client._id} value={client._id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Score (1-10)</label>
                    <Input 
                      type="number"
                      min="1"
                      max="10"
                      placeholder="5" 
                      value={form.score} 
                      onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) || 5 })} 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={!form.title}>Create Feedback</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Feedback Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500 dark:text-slate-400">Loading feedback...</div>
            </div>
          ) : feedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <MessageSquare className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No feedback found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchTerm || (typeFilter && typeFilter !== 'all') || (statusFilter && statusFilter !== 'all')
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first feedback'
                }
              </p>
              {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && canManageFeedback() && (
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Feedback
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
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Title
                        {getSortIcon('title')}
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-2">
                        Type
                        {getSortIcon('type')}
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
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Score
                        {getSortIcon('score')}
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
                    {canManageFeedback() && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedAndFilteredFeedback().map((item) => (
                    <TableRow key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium">
                        <div className="max-w-48 truncate" title={item.title || ''}>
                          {item.title || 'Untitled'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-64 truncate text-sm text-slate-600 dark:text-slate-400" title={item.description || ''}>
                          {item.description || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(item.type || 'other')} text-white`}>
                          {item.type || 'other'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(item.priority || 'medium')} text-white`}>
                          {item.priority || 'medium'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(item.status || 'open')} text-white`}>
                          {item.status || 'open'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.taskId ? (
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3 text-slate-400" />
                            <span className="text-sm">{getTaskName(item.taskId)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.clientId ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span className="text-sm">{getClientName(item.clientId)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm">{item.score || 0}/10</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      {canManageFeedback() && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
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
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>
              Update feedback information and status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
              <Input 
                placeholder="Feedback title" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <Textarea 
                placeholder="Detailed description..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'bug' | 'feature' | 'improvement' | 'other' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as 'low' | 'medium' | 'high' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as 'open' | 'in-progress' | 'resolved' | 'closed' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Related Task</label>
                <Select value={form.taskId} onValueChange={(v) => setForm({ ...form, taskId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Task</SelectItem>
                    {tasks.map(task => (
                      <SelectItem key={task._id} value={task._id}>
                        {task.taskNumber} - {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Client</label>
                <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Client</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Score (1-10)</label>
              <Input 
                type="number"
                min="1"
                max="10"
                placeholder="5" 
                value={form.score} 
                onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) || 5 })} 
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!form.title}>Update Feedback</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


