import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

const Feedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    taskId: '',
    clientId: '',
    score: 5,
    comment: ''
  });

  useEffect(() => {
    fetchFeedback();
    fetchTasks();
    fetchClients();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback');
      setFeedback(response.data.feedback);
    } catch (err) {
      setError('Failed to fetch feedback');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      // Filter for completed tasks only
      const completedTasks = response.data.tasks.filter(task => task.status === 'completed');
      setTasks(completedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFeedback) {
        await api.put(`/feedback/${editingFeedback._id}`, formData);
      } else {
        await api.post('/feedback', formData);
      }
      setShowForm(false);
      setEditingFeedback(null);
      setFormData({ taskId: '', clientId: '', score: 5, comment: '' });
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save feedback');
    }
  };

  const handleEdit = (feedbackItem) => {
    setEditingFeedback(feedbackItem);
    setFormData({
      taskId: feedbackItem.taskId._id,
      clientId: feedbackItem.clientId._id,
      score: feedbackItem.score,
      comment: feedbackItem.comment || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/feedback/${id}`);
        fetchFeedback();
      } catch (err) {
        setError('Failed to delete feedback');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score) => {
    switch (score) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading feedback...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Feedback
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Feedback Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task
                  </label>
                  <select
                    name="taskId"
                    value={formData.taskId}
                    onChange={(e) => setFormData({...formData, taskId: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select a completed task</option>
                    {tasks.map(task => (
                      <option key={task._id} value={task._id}>
                        {task.title} - {task.clientId?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select client</option>
                    {clients.map(client => (
                      <option key={client._id} value={client._id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <select
                    name="score"
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value={1}>1 - Very Poor</option>
                    <option value={2}>2 - Poor</option>
                    <option value={3}>3 - Fair</option>
                    <option value={4}>4 - Good</option>
                    <option value={5}>5 - Excellent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Optional feedback comment..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingFeedback ? 'Update Feedback' : 'Create Feedback'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFeedback(null);
                    setFormData({ taskId: '', clientId: '', score: 5, comment: '' });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feedback List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Feedback List</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {feedback.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No feedback found. Create your first feedback entry.
              </div>
            ) : (
              feedback.map((item) => (
                <div key={item._id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-lg font-semibold ${getScoreColor(item.score)}`}>
                          {item.score}/5
                        </span>
                        <span className="text-sm text-gray-500">
                          {getScoreDescription(item.score)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Task:</strong> {item.taskId?.title}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Client:</strong> {item.clientId?.name}
                      </div>
                      {item.comment && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          "{item.comment}"
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        Created by {item.createdBy?.name} on {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
