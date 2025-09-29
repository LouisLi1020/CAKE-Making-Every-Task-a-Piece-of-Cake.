import React, { useEffect, useState } from 'react';
import { clientsAPI } from '../services/api';
import { Client } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Edit, Trash2, Plus, Building2, Mail, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    contact: {
      email: '',
      phone: ''
    },
    tier: 'basic' as 'basic' | 'premium' | 'enterprise'
  });

  // Load clients from API
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await clientsAPI.getAll();
        const normalizedClients = Array.isArray(data) ? data : (data.clients || data.data || []);
        setClients(normalizedClients);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      contact: {
        email: '',
        phone: ''
      },
      tier: 'basic'
    });
  };

  const handleCreate = async () => {
    try {
      await clientsAPI.create(form);
      setIsCreateOpen(false);
      resetForm();
      // Reload clients
      const data = await clientsAPI.getAll();
      const normalizedClients = Array.isArray(data) ? data : (data.clients || data.data || []);
      setClients(normalizedClients);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      contact: {
        email: client.contact.email || '',
        phone: client.contact.phone || ''
      },
      tier: client.tier
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingClient) return;
    try {
      await clientsAPI.update(editingClient._id, form);
      setIsEditOpen(false);
      setEditingClient(null);
      resetForm();
      // Reload clients
      const data = await clientsAPI.getAll();
      const normalizedClients = Array.isArray(data) ? data : (data.clients || data.data || []);
      setClients(normalizedClients);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientsAPI.delete(clientId);
      // Reload clients
      const data = await clientsAPI.getAll();
      const normalizedClients = Array.isArray(data) ? data : (data.clients || data.data || []);
      setClients(normalizedClients);
    } catch (error) {
      console.error('Error deleting client:', error);
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

  const getSortedAndFilteredClients = () => {
    let filtered = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (client.contact.email && client.contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTier = tierFilter === 'all' || client.tier === tierFilter;
      return matchesSearch && matchesTier;
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
            aValue = a.contact.email || '';
            bValue = b.contact.email || '';
            break;
          case 'tier':
            aValue = a.tier;
            bValue = b.tier;
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-500';
      case 'premium':
        return 'bg-blue-500';
      case 'basic':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const canManageClients = () => {
    return user?.role === 'manager' || user?.role === 'leader';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Clients</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your client relationships</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          {canManageClients() && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Client</DialogTitle>
                  <DialogDescription>
                    Add a new client to your system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name *</label>
                    <Input 
                      placeholder="Company name" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                      <Input 
                        placeholder="contact@company.com" 
                        value={form.contact.email} 
                        onChange={(e) => setForm({ 
                          ...form, 
                          contact: { ...form.contact, email: e.target.value }
                        })} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        value={form.contact.phone} 
                        onChange={(e) => setForm({ 
                          ...form, 
                          contact: { ...form.contact, phone: e.target.value }
                        })} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tier</label>
                    <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v as 'basic' | 'premium' | 'enterprise' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={!form.name}>Create Client</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>


      {/* Clients Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500 dark:text-slate-400">Loading clients...</div>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <Building2 className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No clients found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchTerm || (tierFilter && tierFilter !== 'all')
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first client'
                }
              </p>
              {!searchTerm && tierFilter === 'all' && canManageClients() && (
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Client
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
                        <Building2 className="w-4 h-4" />
                        Company Name
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Email
                        {getSortIcon('email')}
                      </div>
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => handleSort('tier')}
                    >
                      <div className="flex items-center gap-2">
                        Tier
                        {getSortIcon('tier')}
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
                    {canManageClients() && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedAndFilteredClients().map((client) => (
                    <TableRow key={client._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium">
                        <div className="max-w-48 truncate" title={client.name}>
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.contact.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="text-sm">{client.contact.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.contact.phone ? (
                          <span className="text-sm">{client.contact.phone}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTierColor(client.tier)} text-white`}>
                          {client.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      {canManageClients() && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(client)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(client._id)}
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
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name *</label>
              <Input 
                placeholder="Company name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <Input 
                  placeholder="contact@company.com" 
                  value={form.contact.email} 
                  onChange={(e) => setForm({ 
                    ...form, 
                    contact: { ...form.contact, email: e.target.value }
                  })} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                <Input 
                  placeholder="+1 (555) 123-4567" 
                  value={form.contact.phone} 
                  onChange={(e) => setForm({ 
                    ...form, 
                    contact: { ...form.contact, phone: e.target.value }
                  })} 
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tier</label>
              <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v as 'basic' | 'premium' | 'enterprise' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!form.name}>Update Client</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


