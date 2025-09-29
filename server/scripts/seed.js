const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Client = require('../models/Client');
const Task = require('../models/Task');
const Feedback = require('../models/Feedback');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cake';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // Clean existing (optional)
  await Promise.all([
    User.deleteMany({}),
    Client.deleteMany({}),
    Task.deleteMany({}),
    Feedback.deleteMany({})
  ]);

  // Users
  const usersRaw = [
    { name: 'Alice Manager', email: 'alice@cake.dev', password: 'Passw0rd!', role: 'manager' },
    { name: 'Bob Leader', email: 'bob@cake.dev', password: 'Passw0rd!', role: 'leader' },
    { name: 'Carol Member', email: 'carol@cake.dev', password: 'Passw0rd!', role: 'member' },
    { name: 'Dan Member', email: 'dan@cake.dev', password: 'Passw0rd!', role: 'member' },
    { name: 'Eve Developer', email: 'eve@cake.dev', password: 'Passw0rd!', role: 'member' },
    { name: 'Frank Designer', email: 'frank@cake.dev', password: 'Passw0rd!', role: 'member' },
    { name: 'Grace Tester', email: 'grace@cake.dev', password: 'Passw0rd!', role: 'member' },
  ];
  const users = await User.create(usersRaw);

  const manager = users.find(u => u.role === 'manager');
  const leader = users.find(u => u.role === 'leader');
  const members = users.filter(u => u.role === 'member');

  // Clients
  const clients = await Client.insertMany([
    { name: 'Acme Corp', contact: { email: 'ops@acme.com', phone: '+1-555-0123', address: '123 Business Ave, New York, NY' }, tier: 'enterprise', createdBy: manager._id },
    { name: 'Globex Industries', contact: { email: 'it@globex.com', phone: '+1-555-0456' }, tier: 'premium', createdBy: leader._id },
    { name: 'Umbrella Corp', contact: { email: 'admin@umbrella.com', phone: '+1-555-0789' }, tier: 'basic', createdBy: manager._id },
    { name: 'TechStart Inc', contact: { email: 'hello@techstart.com', phone: '+1-555-0321' }, tier: 'premium', createdBy: leader._id },
    { name: 'Digital Solutions', contact: { email: 'contact@digitalsolutions.com', phone: '+1-555-0654' }, tier: 'enterprise', createdBy: manager._id },
    { name: 'CloudBase Ltd', contact: { email: 'info@cloudbase.com' }, tier: 'basic', createdBy: leader._id },
    { name: 'InnovateNow', contact: { email: 'team@innovatenow.com', phone: '+1-555-0987' }, tier: 'premium', createdBy: manager._id },
  ]);

  // Tasks
  const taskData = [
    {
      title: 'Design dashboard layout',
      description: 'Create modern dashboard UI with charts and cards for better user experience',
      clientId: clients[0]._id,
      assigneeIds: [members[0]._id, members[1]._id],
      createdBy: manager._id,
      status: 'in-progress',
      priority: 'high',
      estimateHours: 16,
      revenue: 2500
    },
    {
      title: 'Implement auth flow',
      description: 'JWT login, register, refresh, role guards and security middleware',
      clientId: clients[1]._id,
      assigneeIds: [leader._id],
      createdBy: manager._id,
      status: 'pending',
      priority: 'urgent',
      estimateHours: 12,
      revenue: 1800
    },
    {
      title: 'Write API docs',
      description: 'Swagger endpoints and examples for all REST APIs',
      clientId: clients[2]._id,
      assigneeIds: [members[1]._id],
      createdBy: leader._id,
      status: 'completed',
      priority: 'medium',
      estimateHours: 6,
      actualHours: 5,
      revenue: 900
    },
    {
      title: 'Database optimization',
      description: 'Optimize MongoDB queries and add proper indexing',
      clientId: clients[3]._id,
      assigneeIds: [members[2]._id, members[3]._id],
      createdBy: leader._id,
      status: 'in-progress',
      priority: 'high',
      estimateHours: 20,
      revenue: 3200
    },
    {
      title: 'Mobile app development',
      description: 'React Native app for iOS and Android platforms',
      clientId: clients[4]._id,
      assigneeIds: [members[4]._id],
      createdBy: manager._id,
      status: 'pending',
      priority: 'medium',
      estimateHours: 40,
      revenue: 6000
    },
    {
      title: 'Cloud deployment setup',
      description: 'AWS infrastructure setup with CI/CD pipeline',
      clientId: clients[5]._id,
      assigneeIds: [members[4]._id, leader._id],
      createdBy: manager._id,
      status: 'completed',
      priority: 'urgent',
      estimateHours: 8,
      actualHours: 7,
      revenue: 1200
    },
    {
      title: 'User testing and feedback',
      description: 'Conduct user testing sessions and collect feedback',
      clientId: clients[6]._id,
      assigneeIds: [members[4]._id],
      createdBy: leader._id,
      status: 'in-progress',
      priority: 'low',
      estimateHours: 10,
      revenue: 1500
    },
    {
      title: 'Performance monitoring',
      description: 'Implement monitoring tools and alerting system',
      clientId: clients[0]._id,
      assigneeIds: [members[0]._id],
      createdBy: manager._id,
      status: 'pending',
      priority: 'medium',
      estimateHours: 14,
      revenue: 2100
    }
  ];
  
  const tasks = [];
  for (const task of taskData) {
    const newTask = await Task.create(task);
    tasks.push(newTask);
  }

  // Feedback
  await Feedback.insertMany([
    { 
      title: 'Dashboard looks great!',
      description: 'The new dashboard design is exactly what we needed. Very intuitive and modern.',
      type: 'feature',
      priority: 'medium',
      status: 'resolved',
      taskId: tasks[0]._id, 
      clientId: clients[0]._id, 
      score: 5, 
      comment: 'Dashboard looks great! The new design is exactly what we needed. Very intuitive and modern.',
      createdBy: manager._id 
    },
    { 
      title: 'API documentation needs improvement',
      description: 'Some endpoints are missing examples and the response schemas could be clearer.',
      type: 'improvement',
      priority: 'high',
      status: 'in-progress',
      taskId: tasks[2]._id, 
      clientId: clients[2]._id, 
      score: 3, 
      comment: 'API documentation needs improvement. Some endpoints are missing examples and the response schemas could be clearer.',
      createdBy: leader._id 
    },
    { 
      title: 'Login page bug',
      description: 'Users are experiencing issues with the login form validation on mobile devices.',
      type: 'bug',
      priority: 'high',
      status: 'open',
      taskId: tasks[1]._id, 
      clientId: clients[1]._id, 
      score: 2, 
      comment: 'Login page bug: Users are experiencing issues with the login form validation on mobile devices.',
      createdBy: members[0]._id 
    },
    { 
      title: 'Need dark mode support',
      description: 'The application would benefit from a dark mode theme option for better user experience.',
      type: 'feature',
      priority: 'low',
      status: 'open',
      taskId: tasks[0]._id,
      clientId: clients[3]._id, 
      score: 4, 
      comment: 'Need dark mode support. The application would benefit from a dark mode theme option for better user experience.',
      createdBy: members[2]._id 
    },
    { 
      title: 'Database performance issue',
      description: 'Some queries are taking too long to execute, especially on the tasks page.',
      type: 'bug',
      priority: 'high',
      status: 'in-progress',
      taskId: tasks[3]._id, 
      clientId: clients[3]._id, 
      score: 2, 
      comment: 'Database performance issue: Some queries are taking too long to execute, especially on the tasks page.',
      createdBy: leader._id 
    },
    { 
      title: 'Mobile app feedback',
      description: 'The mobile app prototype looks promising. Looking forward to the full implementation.',
      type: 'feature',
      priority: 'medium',
      status: 'resolved',
      taskId: tasks[4]._id, 
      clientId: clients[4]._id, 
      score: 5, 
      comment: 'Mobile app feedback: The mobile app prototype looks promising. Looking forward to the full implementation.',
      createdBy: manager._id 
    },
    { 
      title: 'Cloud deployment success',
      description: 'The deployment process is now much smoother. Great work on the CI/CD pipeline!',
      type: 'improvement',
      priority: 'low',
      status: 'closed',
      taskId: tasks[5]._id, 
      clientId: clients[5]._id, 
      score: 5, 
      comment: 'Cloud deployment success: The deployment process is now much smoother. Great work on the CI/CD pipeline!',
      createdBy: leader._id 
    },
    { 
      title: 'User testing results',
      description: 'Collected valuable feedback from 15 users. Most issues are minor UI improvements.',
      type: 'other',
      priority: 'medium',
      status: 'resolved',
      taskId: tasks[6]._id, 
      clientId: clients[6]._id, 
      score: 4, 
      comment: 'User testing results: Collected valuable feedback from 15 users. Most issues are minor UI improvements.',
      createdBy: members[4]._id 
    },
    { 
      title: 'Performance monitoring request',
      description: 'We need better visibility into application performance and error tracking.',
      type: 'feature',
      priority: 'high',
      status: 'open',
      taskId: tasks[7]._id, 
      clientId: clients[0]._id, 
      score: 4, 
      comment: 'Performance monitoring request: We need better visibility into application performance and error tracking.',
      createdBy: manager._id 
    }
  ]);

  console.log('Seed complete:', {
    users: users.length,
    clients: clients.length,
    tasks: tasks.length,
    feedback: 9
  });
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
