import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { TASK_STATUS, TASK_PRIORITY, ROLES } from '../../shared/constants';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    clientId: '',
    page: 1,
    limit: 10
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    assigneeIds: [],
    priority: 'medium',
    estimateHours: 0,
    revenue: 0
  });

  // Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/tasks?${params}`);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Tasks management coming soon...</p>
          <p className="text-sm text-gray-500 mt-2">Total tasks: {tasks.length}</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
