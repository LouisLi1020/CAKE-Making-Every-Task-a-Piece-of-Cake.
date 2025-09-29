import React, { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import { User } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Edit, Trash2, Plus, User as UserIcon, Mail, Shield, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'member' as 'manager' | 'leader' | 'member'
  });

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await usersAPI.getAll();
        const normalizedUsers = Array.isArray(data) ? data : (data.users || data.data || []);
        setUsers(normalizedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      role: 'member'
    });
  };

  const handleCreate = async () => {
    try {
      await usersAPI.create(form);
      setIsCreateOpen(false);
      resetForm();
      // Reload users
      const data = await usersAPI.getAll();
      const normalizedUsers = Array.isArray(data) ? data : (data.users || data.data || []);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await usersAPI.update(editingUser._id, form);
      setIsEditOpen(false);
      setEditingUser(null);
      resetForm();
      // Reload users
      const data = await usersAPI.getAll();
      const normalizedUsers = Array.isArray(data) ? data : (data.users || data.data || []);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(userId);
      // Reload users
      const data = await usersAPI.getAll();
      const normalizedUsers = Array.isArray(data) ? data : (data.users || data.data || []);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
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

  const getSortedAndFilteredUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'email':
            aValue = a.email;
            bValue = b.email;
            break;
          case 'role':
            aValue = a.role;
            bValue = b.role;
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-red-500';
      case 'leader':
        return 'bg-blue-500';
      case 'member':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const canManageUsers = () => {
    return user?.role === 'manager';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage team members and their roles</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="leader">Leader</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>

          {canManageUsers() && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new team member to your system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
                    <Input 
                      placeholder="Full name" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
                    <Input 
                      placeholder="user@company.com" 
                      type="email"
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as 'manager' | 'leader' | 'member' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="leader">Leader</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={!form.name || !form.email}>Create User</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Users Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500 dark:text-slate-400">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <UserIcon className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No users found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchTerm || (roleFilter && roleFilter !== 'all')
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first user'
                }
              </p>
              {!searchTerm && roleFilter === 'all' && canManageUsers() && (
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
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
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Name
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                        {getSortIcon('email')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Role
                        {getSortIcon('role')}
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
                    {canManageUsers() && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedAndFilteredUsers().map((user) => (
                    <TableRow key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} text-white`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      {canManageUsers() && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(user._id)}
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
              <Input 
                placeholder="Full name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
              <Input 
                placeholder="user@company.com" 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as 'manager' | 'leader' | 'member' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!form.name || !form.email}>Update User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


